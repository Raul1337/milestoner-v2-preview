import test from 'node:test';
import assert from 'node:assert/strict';
import {initialDraft,compatibleDraft,createOnboardingStore,ONBOARDING_KEY,validDraft,toggleSelection,addCustomInterest,meaningfulDraft} from '../src/onboarding/model.js';
import {firstMilestoneDraft,exampleIssues,beginManualExample,editFirstMilestone,confirmFirstMilestone,postponeFirstMilestone,continueLocalDraft,allowedOnboardingStep,validFirstMilestone} from '../src/onboarding/first-milestone.js';
import {createOnboardingNavigation} from '../src/onboarding/navigation.js';
const configured=()=>({...editFirstMilestone(initialDraft(),{mode:'manual',title:'Probar cerámica & 星を見る',category:'learning'}),step:'review'});
function storage(){const data=new Map(),calls=[];return {data,calls,getItem(k){calls.push(['get',k]);return data.get(k)},setItem(k,v){calls.push(['set',k]);data.set(k,v)},removeItem(k){calls.push(['remove',k]);data.delete(k)}}}
function browser(hash=''){
 const listeners=new Map(),stack=[hash];let index=0;
 const win={location:{pathname:'/review/onboarding/',search:'?lang=es',hash},addEventListener:(k,v)=>{if(!listeners.has(k))listeners.set(k,new Set());listeners.get(k).add(v)},removeEventListener:(k,v)=>listeners.get(k)?.delete(v)};
 const emit=()=>{for(const k of ['popstate','hashchange'])for(const f of listeners.get(k)||[])f()};
 win.history={pushState:(_,__,url)=>{stack.splice(++index);stack.push(new URL(url,'https://example.test').hash);win.location.hash=stack[index]},replaceState:(_,__,url)=>{stack[index]=new URL(url,'https://example.test').hash;win.location.hash=stack[index]},back:()=>{if(index){win.location.hash=stack[--index];emit()}},forward:()=>{if(index<stack.length-1){win.location.hash=stack[++index];emit()}}};return win;
}
test('first milestone starts empty and bounded, independent of selected interests and existing project fixtures',()=>{
 const d=initialDraft();assert.equal(d.version,3);assert.deepEqual(d.firstMilestone,firstMilestoneDraft());assert.equal(d.firstMilestone.confirmed,null);assert.deepEqual(exampleIssues(d.firstMilestone),{title:true,category:true});
 const selected=toggleSelection(d,'languages');assert.deepEqual(selected.firstMilestone,d.firstMilestone);assert.equal(validDraft(d),true);assert.equal(meaningfulDraft(d),false);
 assert.deepEqual(Object.keys(d.firstMilestone),['idea','title','category','note','mode','postponed','confirmed']);
});
test('natural entry hands off verbatim to manual details without category inference or overwriting an edited title',()=>{
 let d=editFirstMilestone(initialDraft(),{idea:'  Cerámica <ficticia>\n星を見る  '});d=beginManualExample(d);
 assert.equal(d.firstMilestone.title,'  Cerámica <ficticia>\n星を見る  ');assert.equal(d.firstMilestone.category,'');
 d=editFirstMilestone(d,{title:'Edited by me',mode:'idea'});assert.equal(beginManualExample(d).firstMilestone.title,'Edited by me');assert.equal(meaningfulDraft(d),true);
});
test('review requires a visible title and explicit supported category; note is optional and bounded without trimming stored input',()=>{
 let d=editFirstMilestone(initialDraft(),{title:'\u200b',category:'learning'});assert.equal(exampleIssues(d.firstMilestone).title,true);
 d=editFirstMilestone(initialDraft(),{title:'Something fictional',category:'learning',note:''});assert.deepEqual(exampleIssues(d.firstMilestone),{title:false,category:false});
 for(const patch of [{title:'x'.repeat(241)},{note:'x'.repeat(281)},{category:'inferred-new-domain'},{title:'bad\u0000text'}])assert.equal(editFirstMilestone(d,patch),d);
 assert.equal(editFirstMilestone(d,{title:'x'.repeat(240),note:'n'.repeat(280)}).firstMilestone.note.length,280);assert.equal(validFirstMilestone(d.firstMilestone),true);
});
test('only explicit confirmation on a valid review creates one temporary snapshot, without native measurement or tracking values',()=>{
 let calls=0;const make=()=>{calls++;return 'review-one'};
 for(const step of ['milestone','account','finished']){const d={...configured(),step};assert.equal(confirmFirstMilestone(d,make),d)}
 const blank={...initialDraft(),step:'review'};assert.equal(confirmFirstMilestone(blank,make),blank);assert.equal(calls,0);
 const d=configured(),result=confirmFirstMilestone(d,make);assert.equal(calls,1);assert.equal(result.step,'account');assert.deepEqual(result.firstMilestone.confirmed,{id:'review-one',title:d.firstMilestone.title,category:'learning',note:''});assert.equal(d.firstMilestone.confirmed,null);
});
test('double taps, browser-back confirmation and reload reuse one snapshot and reject edits after confirmation',()=>{
 let calls=0;const first=confirmFirstMilestone(configured(),()=>{calls++;return 'review-one'}),back={...first,step:'review'};
 assert.equal(confirmFirstMilestone(back,()=>{calls++;return 'review-two'}),back);assert.equal(editFirstMilestone(first,{title:'Changed'}),first);assert.equal(postponeFirstMilestone(first),first);assert.equal(calls,1);
 const s=storage(),store=createOnboardingStore(s);store.save(first);const reload=createOnboardingStore(s).read();assert.deepEqual(reload,first);assert.equal(confirmFirstMilestone({...reload,step:'review'}).firstMilestone.confirmed.id,'review-one');
});
test('canceling review retains editable inputs without confirming or unlocking the account invitation',()=>{
 const draft=configured(),cancelled={...draft,step:'milestone'};assert.equal(cancelled.firstMilestone.confirmed,null);assert.deepEqual(cancelled.firstMilestone,draft.firstMilestone);
 assert.equal(allowedOnboardingStep('account',cancelled),'milestone');assert.equal(editFirstMilestone(cancelled,{note:'Changed after cancel'}).firstMilestone.note,'Changed after cancel');
});
test('postpone retains partial inputs, does not fabricate success and can resume without losing a single field',()=>{
 const original=editFirstMilestone(initialDraft(),{idea:'A fictional idea',title:'Still a draft',note:'Later, maybe'}),skipped=postponeFirstMilestone(original);
 assert.equal(skipped.step,'finished');assert.equal(skipped.firstMilestone.postponed,true);assert.equal(skipped.firstMilestone.confirmed,null);assert.equal(allowedOnboardingStep('account',skipped),'milestone');
 const resumed=editFirstMilestone(skipped,{});assert.equal(resumed.firstMilestone.postponed,false);for(const key of ['idea','title','category','note'])assert.equal(resumed.firstMilestone[key],original.firstMilestone[key]);
});
test('continuing locally preserves confirmed and skipped drafts and touches only the isolated session key',()=>{
 const s=storage(),keys=['milestoner-vision-v2-demo-v1','milestoner-vision-v2-profile-v1','milestoner-vision-v2-interest-universe-v1','milestoner-demo-insight-review-v1'];keys.forEach(k=>s.data.set(k,'unchanged:'+k));const before=new Map(s.data);
 const confirmed=confirmFirstMilestone(configured(),()=> 'review-one'),local=continueLocalDraft(confirmed);assert.equal(local.step,'finished');assert.deepEqual(local.firstMilestone,confirmed.firstMilestone);
 const store=createOnboardingStore(s);assert.equal(store.save(local).persisted,true);assert.deepEqual(createOnboardingStore(s).read(),local);for(const k of keys)assert.equal(s.data.get(k),before.get(k));assert.ok(s.calls.every(c=>c[1]===ONBOARDING_KEY));
 const skipped=postponeFirstMilestone(editFirstMilestone(initialDraft(),{title:'Partial'}));assert.deepEqual(continueLocalDraft(skipped).firstMilestone,skipped.firstMilestone);
});
test('V1 and V2 compatibility is explicit and nonmutating, including custom labels, selections and legacy finished step',()=>{
 const current=addCustomInterest(toggleSelection(initialDraft(),'photography'),'Cerámica de estrellas',()=> 'custom-example').draft;
 const {firstMilestone,...withoutFirst}=current,v2={...withoutFirst,version:2,step:'finished'},v1={version:1,name:'Fictional',selected:['reading'],step:'universe'};
 for(const previous of [v1,v2]){const s=storage(),raw=JSON.stringify(previous);s.data.set(ONBOARDING_KEY,raw);const value=createOnboardingStore(s).read();assert.equal(value.version,3);assert.deepEqual(value.firstMilestone,firstMilestoneDraft());assert.deepEqual(value.selected,previous.selected);assert.equal(value.step,previous.step);assert.equal(s.data.get(ONBOARDING_KEY),raw);assert.ok(s.calls.every(([op])=>op==='get'))}
 assert.deepEqual(compatibleDraft(v2).custom,current.custom);assert.equal(compatibleDraft({...v2,step:'account'}),null);
});
test('invalid confirmation snapshots and unsupported schemas never become valid account state; denied writes remain in memory only',()=>{
 const confirmed=confirmFirstMilestone(configured(),()=> 'review-one');
 for(const invalid of [{...confirmed,firstMilestone:null},{...confirmed,firstMilestone:{...confirmed.firstMilestone,confirmed:{...confirmed.firstMilestone.confirmed,title:'Different'}}},{...confirmed,firstMilestone:{...confirmed.firstMilestone,postponed:true}},{...confirmed,version:4}])assert.equal(validDraft(invalid),false);
 const denied={getItem(){throw Error()},setItem(){throw Error()},removeItem(){throw Error()}},store=createOnboardingStore(denied);assert.deepEqual(store.save(confirmed),{ok:true,persisted:false});assert.deepEqual(store.read(),confirmed);assert.deepEqual(createOnboardingStore(denied).read(),initialDraft());
});
test('direct account/review URLs are guarded and confirmed browser history cannot reconfirm or resurrect a discarded snapshot',()=>{
 const win=browser('#account');let draft=initialDraft();const nav=createOnboardingNavigation(win,draft.step,step=>{draft={...draft,step}},step=>allowedOnboardingStep(step,draft));assert.equal(win.location.hash,'#milestone');
 nav.go('review');assert.equal(win.location.hash,'#milestone');draft={...configured(),step:'milestone'};nav.go('review');assert.equal(win.location.hash,'#review');draft=confirmFirstMilestone(draft,()=> 'review-one');nav.go('account');assert.equal(win.location.hash,'#account');win.history.back();assert.equal(draft.step,'review');assert.equal(draft.firstMilestone.confirmed.id,'review-one');win.history.forward();assert.equal(draft.step,'account');
 draft=initialDraft();win.history.back();assert.equal(win.location.hash,'#milestone');assert.equal(draft.firstMilestone.confirmed,null);nav.destroy();
});
test('a complete manual review journey keeps identity/interest data and one confirmation through local continuation and session reload',()=>{
 let d=addCustomInterest(toggleSelection({...initialDraft(),name:'Fictional explorer'},'languages'),'Papel & tinta',()=> 'custom-one').draft;const originalInterests=structuredClone({name:d.name,selected:d.selected,custom:d.custom});
 d=beginManualExample(d);d=editFirstMilestone(d,{title:'Terminar una lección',category:'learning',note:'Una intención, sin horario'});d={...d,step:'review'};d=confirmFirstMilestone(d,()=> 'review-first');assert.equal(allowedOnboardingStep('account',d),'account');d=continueLocalDraft(d);
 const s=storage();createOnboardingStore(s).save(d);const loaded=createOnboardingStore(s).read();assert.equal(loaded.firstMilestone.confirmed.id,'review-first');assert.deepEqual({name:loaded.name,selected:loaded.selected,custom:loaded.custom},originalInterests);
});
