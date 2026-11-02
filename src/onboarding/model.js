import {INTEREST_CATALOG,LEGACY_IDS,normalizeInterest} from './catalog.js';
export {INTEREST_CATALOG,interestLabel} from './catalog.js';

// Keep the key for explicit, non-destructive V1 compatibility. Only payload version changes.
export const ONBOARDING_KEY='milestoner-vision-v2-onboarding-review-v1';
export const CUSTOM_INTEREST_LIMIT=60; // Unicode code points, never silently truncated.
export const STEPS=Object.freeze(['welcome','information','interests','universe','finished']);
export const initialDraft=()=>({version:2,name:'',selected:[],custom:[],step:'welcome'});
export function draftStep(value,fallback='welcome'){return STEPS.includes(value)?value:STEPS.includes(fallback)?fallback:'welcome'}
const baseValid=v=>v&&typeof v.name==='string'&&v.name.length<=50&&!/[\u0000-\u001f\u007f]/.test(v.name)&&Array.isArray(v.selected)&&new Set(v.selected).size===v.selected.length&&STEPS.includes(v.step);
export function customTextError(text){
 if(typeof text!=='string'||!text.trim()||!/[\p{L}\p{N}\p{P}\p{S}]/u.test(text))return 'empty';
 if(/[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/u.test(text))return 'characters';
 return [...text.trim()].length>CUSTOM_INTEREST_LIMIT?'length':null;
}
function knownDuplicate(custom,label){const normalized=normalizeInterest(label);return INTEREST_CATALOG.find(i=>Object.values(i.name).some(n=>normalizeInterest(n)===normalized))||custom.find(i=>normalizeInterest(i.label)===normalized)}
export function validDraft(v){
 if(!baseValid(v)||v.version!==2||!Array.isArray(v.custom))return false;
 const seen=[];
 for(const i of v.custom){if(!i||typeof i.id!=='string'||!/^custom-[a-zA-Z0-9-]{1,80}$/.test(i.id)||seen.some(s=>s.id===i.id)||customTextError(i.label)||i.label!==i.label.trim()||knownDuplicate(seen,i.label))return false;seen.push(i)}
 return v.selected.every(id=>INTEREST_CATALOG.some(i=>i.id===id)||seen.some(i=>i.id===id));
}
export function compatibleDraft(v){
 if(validDraft(v))return structuredClone(v);
 if(v?.version===1&&baseValid(v)&&v.selected.every(id=>LEGACY_IDS.includes(id)))return {...structuredClone(v),version:2,custom:[]};
 return null;
}
const allIds=draft=>[...INTEREST_CATALOG,...draft.custom].map(i=>i.id);
export function toggleSelection(draft,id){
 const ids=allIds(draft);if(!ids.includes(id))return draft;
 const selected=new Set(draft.selected);if(selected.has(id))selected.delete(id);else selected.add(id);
 return {...draft,selected:ids.filter(id=>selected.has(id))};
}
export function addCustomInterest(draft,text,makeId=()=>`custom-${globalThis.crypto.randomUUID()}`){
 const error=customTextError(text);if(error)return {ok:false,error};
 const label=text.trim(),duplicate=knownDuplicate(draft.custom,label);if(duplicate)return {ok:false,error:'duplicate',existingId:duplicate.id};
 const id=makeId();if(typeof id!=='string'||!/^custom-[a-zA-Z0-9-]{1,80}$/.test(id)||allIds(draft).includes(id))return {ok:false,error:'identity'};
 return {ok:true,id,draft:{...draft,custom:[...draft.custom,{id,label}],selected:[...draft.selected,id]}};
}
export function removeCustomInterest(draft,id){return {...draft,custom:draft.custom.filter(i=>i.id!==id),selected:draft.selected.filter(i=>i!==id)}}
export function draftOptions(draft){return [...INTEREST_CATALOG,...draft.custom.map(i=>({id:i.id,name:i.label,tone:'brand',custom:true}))]}
// Web candidate rule only. No category/confidence inference, normal app writes or native contract change.
export function draftInterests(draft){return draftOptions(draft).filter(i=>draft.selected.includes(i.id)).map(i=>({...i,affinity:'curious',note:''}))}
export function draftIdentity(draft,language='es'){return draft.name.trim()||(language==='en'?'You':'Tú')}
export function meaningfulDraft(draft){return !!draft.name.trim()||draft.selected.length>0||draft.custom.length>0}
export function createOnboardingStore(storage){
 let memory;
 return {
  read(){if(memory)return structuredClone(memory);try{const value=compatibleDraft(JSON.parse(storage.getItem(ONBOARDING_KEY)));if(value)return value}catch{}return initialDraft()},
  save(value){if(!validDraft(value))return {ok:false,persisted:false};memory=structuredClone(value);try{storage.setItem(ONBOARDING_KEY,JSON.stringify(value));return {ok:true,persisted:true}}catch{return {ok:true,persisted:false}}},
  clear(){memory=initialDraft();try{storage.removeItem(ONBOARDING_KEY);return true}catch{return false}}
 };
}
