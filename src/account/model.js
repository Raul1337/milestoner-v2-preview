// Deterministic UX rehearsal only. These keys are authored labels, never provider/user IDs.
export const ACCOUNT_REVIEW_KEY='milestoner-vision-v2-account-review-v1';
export const PROVIDERS=Object.freeze(['apple','google']);
export const LOCAL_CONTEXTS=Object.freeze(['sample-a','sample-b']);
export const OUTCOMES=Object.freeze({login:['success','cancel','unavailable'],lookup:['automatic','none','same','other','conflict','offline','unavailable'],enroll:['success','conflict','ambiguous-committed','ambiguous-not-committed']});
export const PRESETS=Object.freeze(['signed-out','returning','expired','session-unavailable','service-unavailable','unassociated','associated','other-user','conflict','offline','lookup-unavailable','ambiguous']);
export const initialAccount=()=>({version:1,session:'signed-out',provider:null,local:'sample-a',epoch:0,sequence:0,association:'not-checked',observation:null,consent:null,pending:null,links:{},notice:null,outcomes:{login:'success',lookup:'automatic',enroll:'success'}});
const signedIn=s=>s.session==='signed-in'&&PROVIDERS.includes(s.provider);
export const sameContext=(s,c)=>!!(c&&c.epoch===s.epoch&&c.provider===s.provider&&c.local===s.local);
const snapshot=s=>({epoch:s.epoch,provider:s.provider,local:s.local});
const operation=(s,kind)=>({...snapshot(s),kind,sequence:s.sequence+1});
const matching=(a,b)=>!!(a&&b&&a.kind===b.kind&&a.sequence===b.sequence&&a.epoch===b.epoch&&a.local===b.local&&a.provider===b.provider);
export const canPrepareAssociation=s=>signedIn(s)&&!s.pending&&s.association==='none'&&sameContext(s,s.observation);
export const canConfirmAssociation=(s,c=s.consent)=>canPrepareAssociation(s)&&sameContext(s,c)&&c.sequence===s.consent?.sequence;
export function startSignIn(s,provider){
 if(s.pending||s.session!=='signed-out'||!PROVIDERS.includes(provider))return s;
 const next={...s,provider,session:'signing-in',epoch:s.epoch+1,association:'not-checked',observation:null,consent:null,notice:null};const op=operation(next,'sign-in');return {...next,sequence:op.sequence,pending:op};
}
export function reconnectSession(s){
 if(s.pending||!['expired','unavailable'].includes(s.session)||!PROVIDERS.includes(s.provider))return s;
 return startSignIn({...s,session:'signed-out'},s.provider);
}
export function cancelConsent(s){return s.consent?{...s,consent:null,sequence:s.sequence+1,notice:'confirmation-cancelled'}:s}
export function startAssociationCheck(s){
 if(!signedIn(s)||s.pending)return s;
 const op=operation(s,'check');return {...s,sequence:op.sequence,pending:op,association:'checking',observation:null,consent:null,notice:null};
}
export function prepareAssociation(s){
 if(!canPrepareAssociation(s))return s;
 const sequence=s.sequence+1;return {...s,sequence,consent:{...snapshot(s),sequence},notice:null};
}
export function confirmAssociation(s,consent){
 if(!canConfirmAssociation(s,consent))return s;
 const op=operation(s,'enroll');return {...s,sequence:op.sequence,pending:op,consent:null,association:'enrolling',notice:null};
}
export function completeOperation(s,op){
 if(!matching(s.pending,op)||!sameContext(s,op))return s;
 if(op.kind==='sign-in'){
  if(s.session!=='signing-in')return s;
  const outcome=s.outcomes.login;
  return {...s,pending:null,session:outcome==='success'?'signed-in':'signed-out',provider:outcome==='success'?s.provider:null,association:'not-checked',observation:null,consent:null,notice:outcome==='success'?'signed-in':outcome==='cancel'?'sign-in-cancelled':'service-unavailable'};
 }
 if(!signedIn(s))return s;
 if(op.kind==='check'){
  let result=s.outcomes.lookup;
  if(result==='automatic')result=s.links[s.provider]?(s.links[s.provider]===s.local?'same':'other'):'none';
  return {...s,pending:null,association:result,observation:['none','same','other','conflict'].includes(result)?snapshot(s):null,consent:null,notice:null};
 }
 const result=s.outcomes.enroll,linked=s.links[s.provider];
 const incompatible=(linked&&linked!==s.local)||(!linked&&Object.values(s.links).includes(s.local));
 if(result==='conflict'||incompatible)return {...s,pending:null,association:'conflict',observation:null,notice:null};
 const links=result==='success'||result==='ambiguous-committed'?{...s.links,[s.provider]:s.local}:s.links;
 if(result.startsWith('ambiguous'))return {...s,pending:null,links,association:'ambiguous',observation:null,notice:'check-before-retry'};
 return {...s,pending:null,links,association:'same',observation:snapshot(s),notice:'associated'};
}
export function cancelOperation(s){
 if(!s.pending)return s;
 if(s.pending.kind==='enroll')return departAccount(s); // Accepted attempts are not presented as rolled back.
 const signin=s.pending.kind==='sign-in';return {...s,pending:null,sequence:s.sequence+1,consent:null,session:signin?'signed-out':s.session,provider:signin?null:s.provider,association:'not-checked',observation:null,notice:signin?'sign-in-cancelled':'check-cancelled'};
}
export function signOut(s){
 if(s.pending||s.session==='signed-out')return s;
 return {...s,session:'signed-out',provider:null,epoch:s.epoch+1,sequence:s.sequence+1,association:'not-checked',observation:null,consent:null,pending:null,notice:'signed-out'};
}
function invalidateContext(s,patch){
 const interrupted=s.pending?.kind==='enroll'||s.association==='ambiguous',signin=s.session==='signing-in';
 return {...s,...patch,session:signin?'signed-out':s.session,provider:signin?null:s.provider,epoch:s.epoch+1,sequence:s.sequence+1,pending:null,consent:null,observation:null,association:interrupted?'ambiguous':'not-checked',notice:'context-changed'};
}
export function changeLocalContext(s,local){return LOCAL_CONTEXTS.includes(local)&&local!==s.local?invalidateContext(s,{local}):s}
export function setOutcome(s,kind,value){return OUTCOMES[kind]?.includes(value)&&s.outcomes[kind]!==value?invalidateContext(s,{outcomes:{...s.outcomes,[kind]:value}}):s}
export function restoreSameSession(s){return signedIn(s)&&!s.pending?{...cancelConsent(s),notice:'same-session'}:s}
export function departAccount(s){
 if(s.pending?.kind==='enroll')return {...s,pending:null,consent:null,observation:null,sequence:s.sequence+1,association:'ambiguous',notice:'check-before-retry'};
 return cancelConsent(cancelOperation(s));
}
export function loadScenario(name){
 let s=initialAccount();if(!PRESETS.includes(name)||name==='signed-out')return s;
 if(name==='service-unavailable')return {...s,notice:'service-unavailable',outcomes:{...s.outcomes,login:'unavailable'}};
 s={...s,session:'signed-in',provider:'google',epoch:1,notice:'scenario'};
 if(name==='expired'||name==='session-unavailable')return {...s,session:name==='expired'?'expired':'unavailable'};
 if(name==='returning')return {...s,notice:'returning'};
 const association={unassociated:'none',associated:'same','other-user':'other',conflict:'conflict',offline:'offline','lookup-unavailable':'unavailable',ambiguous:'ambiguous'}[name];
 const links=name==='associated'?{google:'sample-a'}:name==='other-user'?{google:'sample-b'}:{};
 return {...s,association,links,outcomes:{...s.outcomes,lookup:name==='offline'?'offline':name==='lookup-unavailable'?'unavailable':name==='conflict'?'conflict':'automatic'},observation:['none','same','other','conflict'].includes(association)?snapshot(s):null};
}
export function allowedAccountRoute(route,s){return route==='provider'&&s.pending?.kind==='sign-in'?'provider':route==='confirm'&&canConfirmAssociation(s)?'confirm':'account'}
// Persist only a synthetic session/scenario envelope. Never cache positive association,
// registry, consent or in-flight operation as durable/server-authoritative state.
export function accountEnvelope(s){return {version:1,session:s.session==='signing-in'?'signed-out':s.session,provider:s.session==='signing-in'?null:s.provider,local:s.local,outcomes:{...s.outcomes},needsCheck:s.association==='ambiguous'||s.pending?.kind==='enroll',interrupted:s.pending?.kind||null}}
export function restoreAccount(value){
 if(!value||value.version!==1||!['signed-out','signed-in','expired','unavailable'].includes(value.session)||!LOCAL_CONTEXTS.includes(value.local)||typeof value.needsCheck!=='boolean'||![null,'sign-in','check','enroll'].includes(value.interrupted))return null;
 if(value.session==='signed-out'?value.provider!==null:!PROVIDERS.includes(value.provider))return null;
 if(!Object.keys(OUTCOMES).every(k=>OUTCOMES[k].includes(value.outcomes?.[k])))return null;
 const s={...initialAccount(),session:value.session,provider:value.provider,local:value.local,outcomes:Object.fromEntries(Object.keys(OUTCOMES).map(k=>[k,value.outcomes[k]])),epoch:1};
 return {...s,association:value.needsCheck&&signedIn(s)?'ambiguous':'not-checked',notice:value.interrupted?'interrupted':signedIn(s)?'returning':null};
}
export function createAccountStore(storage){
 let memory,available=true;
 return {read(){if(memory)return {state:structuredClone(memory),available};try{const state=restoreAccount(JSON.parse(storage.getItem(ACCOUNT_REVIEW_KEY)));return {state:state||initialAccount(),available:true}}catch{return {state:initialAccount(),available:false}}},save(state){memory=structuredClone(state);try{storage.setItem(ACCOUNT_REVIEW_KEY,JSON.stringify(accountEnvelope(state)));available=true;return true}catch{available=false;return false}}};
}
