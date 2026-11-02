import {initialInterests} from '../interest-model.js';

export const ONBOARDING_KEY='milestoner-vision-v2-onboarding-review-v1';
export const STEPS=Object.freeze(['welcome','information','interests','universe','finished']);
const tones=['learning','travel','learning','finance','fitness','learning','finance','travel','learning','travel','finance','fitness'];
// Read the authored catalog only. Existing confirmed state and affinity strengths are not inputs.
export const INTEREST_CATALOG=Object.freeze(initialInterests().confirmed.map((i,index)=>Object.freeze({id:i.id,name:Object.freeze({...i.name}),tone:tones[index]})));
export const initialDraft=()=>({version:1,name:'',selected:[],step:'welcome'});
export function draftStep(value,fallback='welcome'){return STEPS.includes(value)?value:STEPS.includes(fallback)?fallback:'welcome'}
export function validDraft(value){
 return value?.version===1&&typeof value.name==='string'&&value.name.length<=50&&!/[\u0000-\u001f\u007f]/.test(value.name)&&Array.isArray(value.selected)&&value.selected.every(id=>INTEREST_CATALOG.some(i=>i.id===id))&&new Set(value.selected).size===value.selected.length&&STEPS.includes(value.step);
}
export function toggleSelection(draft,id){
 if(!INTEREST_CATALOG.some(i=>i.id===id))return draft;
 const selected=new Set(draft.selected);if(selected.has(id))selected.delete(id);else selected.add(id);
 return {...draft,selected:INTEREST_CATALOG.filter(i=>selected.has(i.id)).map(i=>i.id)};
}
// Owner-approved Web candidate rule only. No confidence/source inference or native contract change.
export function draftInterests(draft){return INTEREST_CATALOG.filter(i=>draft.selected.includes(i.id)).map(i=>({...i,affinity:'curious',note:''}))}
export function draftIdentity(draft,language='es'){return draft.name.trim()||(language==='en'?'You':'Tú')}
export function meaningfulDraft(draft){return !!draft.name.trim()||draft.selected.length>0}
export function createOnboardingStore(storage){
 let memory;
 return {
  read(){if(memory)return structuredClone(memory);try{const value=JSON.parse(storage.getItem(ONBOARDING_KEY));if(validDraft(value))return structuredClone(value)}catch{}return initialDraft()},
  save(value){if(!validDraft(value))return {ok:false,persisted:false};memory=structuredClone(value);try{storage.setItem(ONBOARDING_KEY,JSON.stringify(value));return {ok:true,persisted:true}}catch{return {ok:true,persisted:false}}},
  clear(){memory=initialDraft();try{storage.removeItem(ONBOARDING_KEY);return true}catch{return false}}
 };
}
