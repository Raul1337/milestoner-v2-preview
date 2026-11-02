// A bounded UX rehearsal, never a native MilestoneDefinition, Project or tracking record.
export const EXAMPLE_CATEGORIES=Object.freeze([
 {id:'travel',es:'Viajes',en:'Travel'}, {id:'learning',es:'Aprendizaje',en:'Learning'},
 {id:'fitness',es:'Actividad física',en:'Fitness'}, {id:'finance',es:'Finanzas',en:'Finance'}
].map(Object.freeze));
export const firstMilestoneDraft=()=>({idea:'',title:'',category:'',note:'',mode:'idea',postponed:false,confirmed:null});
const text=(value,max)=>typeof value==='string'&&value.length<=max&&!/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f\u202a-\u202e\u2066-\u2069]/.test(value);
const category=value=>value===''||EXAMPLE_CATEGORIES.some(c=>c.id===value);
export const visibleExampleText=value=>typeof value==='string'&&/[\p{L}\p{N}\p{P}\p{S}]/u.test(value);
export function exampleIssues(first){return {title:!visibleExampleText(first.title),category:!EXAMPLE_CATEGORIES.some(c=>c.id===first.category)}}
export function readyForExampleReview(first){const issues=exampleIssues(first);return !issues.title&&!issues.category}
export function validFirstMilestone(first){
 if(!first||!text(first.idea,240)||!text(first.title,240)||!text(first.note,280)||!category(first.category)||!['idea','manual'].includes(first.mode)||typeof first.postponed!=='boolean')return false;
 const c=first.confirmed;
 return c===null||!!(c&&typeof c.id==='string'&&/^review-[a-zA-Z0-9-]{1,80}$/.test(c.id)&&!first.postponed&&readyForExampleReview(first)&&c.title===first.title.trim()&&c.category===first.category&&c.note===first.note.trim());
}
export function editFirstMilestone(draft,patch){
 if(draft.firstMilestone.confirmed)return draft;
 const allowed=Object.fromEntries(Object.entries(patch).filter(([key])=>['idea','title','category','note','mode'].includes(key)));
 const first={...draft.firstMilestone,...allowed,postponed:false};return validFirstMilestone(first)?{...draft,firstMilestone:first}:draft;
}
export function beginManualExample(draft){
 const first=draft.firstMilestone;
 return editFirstMilestone(draft,{mode:'manual',title:first.title.trim()?first.title:first.idea});
}
export function confirmFirstMilestone(draft,makeId=()=>`review-${globalThis.crypto.randomUUID()}`){
 const first=draft.firstMilestone;
 if(first.confirmed||draft.step!=='review'||!validFirstMilestone(first)||!readyForExampleReview(first))return draft;
 const id=makeId();if(typeof id!=='string'||!/^review-[a-zA-Z0-9-]{1,80}$/.test(id))return draft;
 return {...draft,step:'account',firstMilestone:{...first,postponed:false,confirmed:{id,title:first.title.trim(),category:first.category,note:first.note.trim()}}};
}
export function postponeFirstMilestone(draft){return draft.firstMilestone.confirmed?draft:{...draft,step:'finished',firstMilestone:{...draft.firstMilestone,postponed:true}}}
export function continueLocalDraft(draft){return {...draft,step:'finished'}}
export function firstMilestoneMeaningful(first){return !!(first.idea.trim()||first.title.trim()||first.category||first.note.trim()||first.confirmed)}
export function allowedOnboardingStep(step,draft){
 if(step==='account'&&!draft.firstMilestone.confirmed)return 'milestone';
 if(step==='review'&&!readyForExampleReview(draft.firstMilestone))return 'milestone';
 return step;
}
