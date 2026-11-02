import test from 'node:test';
import assert from 'node:assert/strict';
import {initialAccount,PROVIDERS,PRESETS,ACCOUNT_REVIEW_KEY,loadScenario,startSignIn,completeOperation,cancelOperation,startAssociationCheck,prepareAssociation,confirmAssociation,cancelConsent,canPrepareAssociation,canConfirmAssociation,changeLocalContext,setOutcome,signOut,reconnectSession,restoreSameSession,departAccount,accountEnvelope,restoreAccount,createAccountStore,allowedAccountRoute} from '../src/account/model.js';
import {accountReviewLinks,createAccountNavigation} from '../src/account/navigation.js';
import {initialDraft,createOnboardingStore,ONBOARDING_KEY} from '../src/onboarding/model.js';
const finish=s=>completeOperation(s,s.pending);
const login=(provider='google')=>finish(startSignIn(initialAccount(),provider));
const check=s=>finish(startAssociationCheck(s));
const prepared=()=>prepareAssociation(check(login()));
const accepted=s=>confirmAssociation(s,s.consent);
const enrolled=()=>finish(accepted(prepared()));
function storage(){const data=new Map(),calls=[];return {data,calls,getItem(k){calls.push(['get',k]);return data.get(k)},setItem(k,v){calls.push(['set',k]);data.set(k,v)}}}
function browser(hash=''){
 const listeners=new Map(),stack=[hash];let index=0;
 const win={location:{pathname:'/review/account/',search:'?lang=es',hash},addEventListener:(k,v)=>{if(!listeners.has(k))listeners.set(k,new Set());listeners.get(k).add(v)},removeEventListener:(k,v)=>listeners.get(k)?.delete(v)};
 const emit=()=>{for(const key of ['popstate','hashchange'])for(const f of listeners.get(key)||[])f()};win.history={pushState:(_,__,url)=>{stack.splice(++index);stack.push(new URL(url,'https://example.test').hash);win.location.hash=stack[index]},replaceState:(_,__,url)=>{stack[index]=new URL(url,'https://example.test').hash;win.location.hash=stack[index]},back:()=>{if(index){win.location.hash=stack[--index];emit()}},forward:()=>{if(index<stack.length-1){win.location.hash=stack[++index];emit()}}};return win;
}
test('Apple and Google have separate explicit pending/success states and never imply association',()=>{
 for(const provider of PROVIDERS){const initial=initialAccount(),pending=startSignIn(initial,provider);assert.equal(pending.session,'signing-in');assert.equal(initial.session,'signed-out');assert.equal(startSignIn(pending,'google'),pending);const done=finish(pending);assert.equal(done.session,'signed-in');assert.equal(done.provider,provider);assert.equal(done.association,'not-checked');assert.equal(canPrepareAssociation(done),false);assert.deepEqual(done.links,{})}
});
test('unsupported providers, automatic switching and confirmation without an observation are refused',()=>{
 const s=initialAccount();assert.equal(startSignIn(s,'email'),s);const signed=login();assert.equal(startSignIn(signed,'apple'),signed);assert.equal(prepareAssociation(signed),signed);assert.equal(confirmAssociation(signed,{provider:'google'}),signed);
});
test('sign-in cancellation, configured cancellation and service failure leave local use possible',()=>{
 const pending=startSignIn(initialAccount(),'apple');assert.equal(cancelOperation(pending).session,'signed-out');assert.equal(cancelOperation(pending).notice,'sign-in-cancelled');
 for(const outcome of ['cancel','unavailable']){const state=finish(startSignIn(setOutcome(initialAccount(),'login',outcome),'google'));assert.equal(state.session,'signed-out');assert.equal(state.provider,null);assert.equal(state.notice,outcome==='cancel'?'sign-in-cancelled':'service-unavailable')}
});
test('association lookup has a stable checking phase and every explicit outcome is represented independently',()=>{
 for(const outcome of ['none','same','other','conflict','offline','unavailable']){const s=setOutcome(login(),'lookup',outcome),pending=startAssociationCheck(s);assert.equal(pending.association,'checking');assert.equal(startAssociationCheck(pending),pending);const done=finish(pending);assert.equal(done.session,'signed-in');assert.equal(done.association,outcome);assert.equal(canPrepareAssociation(done),outcome==='none')}
});
test('prepare is optional and cancellation performs no simulated enrollment or link mutation',()=>{
 const s=check(login());assert.equal(s.association,'none');const p=prepareAssociation(s);assert.ok(p.consent);assert.deepEqual(p.links,{});assert.equal(p.pending,null);const cancelled=cancelConsent(p);assert.equal(cancelled.consent,null);assert.deepEqual(cancelled.links,{});assert.equal(confirmAssociation(cancelled,p.consent),cancelled);assert.equal(canPrepareAssociation(cancelled),true);
});
test('explicit context-bound confirmation is consumed once before an enrollment result can be shown',()=>{
 const p=prepared(),attempt=accepted(p);assert.equal(attempt.association,'enrolling');assert.equal(attempt.consent,null);assert.deepEqual(attempt.links,{});assert.equal(confirmAssociation(attempt,p.consent),attempt);const done=finish(attempt);assert.equal(done.association,'same');assert.deepEqual(done.links,{google:'sample-a'});assert.equal(completeOperation(done,attempt.pending),done);
});
test('context changes invalidate prepared confirmation and stale lookup/sign-in results',()=>{
 const p=prepared(),localChanged=changeLocalContext(p,'sample-b');assert.equal(localChanged.consent,null);assert.equal(localChanged.association,'not-checked');assert.equal(confirmAssociation(localChanged,p.consent),localChanged);
 const pending=startAssociationCheck(login()),changed=changeLocalContext(pending,'sample-b');assert.equal(completeOperation(changed,pending.pending),changed);
 const signin=startSignIn(initialAccount(),'apple'),cancelled=cancelOperation(signin);assert.equal(completeOperation(cancelled,signin.pending),cancelled);
});
test('session replacement, expiry and reload cannot reuse consent',()=>{
 const p=prepared(),expired=loadScenario('expired');assert.equal(confirmAssociation(expired,p.consent),expired);const restored=restoreAccount(accountEnvelope(p));assert.equal(restored.consent,null);assert.equal(restored.association,'not-checked');assert.equal(confirmAssociation(restored,p.consent),restored);
});
test('same-usable-session restoration preserves a compatible observation but discards consent',()=>{
 const associated=enrolled(),refreshed=restoreSameSession(associated);assert.equal(refreshed.association,'same');assert.deepEqual(refreshed.observation,associated.observation);const p=prepared(),r=restoreSameSession(p);assert.equal(r.consent,null);assert.equal(r.association,'none');assert.equal(confirmAssociation(r,p.consent),r);
});
test('known different-user and registration conflicts fail closed with no replacement or merge',()=>{
 const other=loadScenario('other-user');assert.equal(prepareAssociation(other),other);const observedNone=check(setOutcome(other,'lookup','none')),attempt=accepted(prepareAssociation(observedNone)),done=finish(attempt);assert.equal(done.association,'conflict');assert.deepEqual(done.links,{google:'sample-b'});
 const rejected=finish(accepted(prepareAssociation(setOutcome(check(login()),'enroll','conflict')))); // setting outcomes invalidates old lookup
 assert.equal(rejected.association,'not-checked');
});
test('a configured enrollment conflict never fabricates a link',()=>{
 let s=setOutcome(login(),'enroll','conflict');s=prepareAssociation(check(s));s=finish(accepted(s));assert.equal(s.association,'conflict');assert.deepEqual(s.links,{});assert.equal(canPrepareAssociation(s),false);
});
test('ambiguous results require a lookup before retry for both possible fictional outcomes',()=>{
 for(const result of ['ambiguous-committed','ambiguous-not-committed']){let s=setOutcome(login(),'enroll',result);s=prepareAssociation(check(s));s=finish(accepted(s));assert.equal(s.association,'ambiguous');assert.equal(prepareAssociation(s),s);const observed=check(s);assert.equal(observed.association,result==='ambiguous-committed'?'same':'none');assert.equal(canPrepareAssociation(observed),result==='ambiguous-not-committed')}
});
test('logout clears only simulated session/observations, preserving in-memory links without unlinking',()=>{
 const linked=enrolled(),out=signOut(linked);assert.equal(out.session,'signed-out');assert.equal(out.provider,null);assert.equal(out.consent,null);assert.deepEqual(out.links,linked.links);const again=check(finish(startSignIn(out,'google')));assert.equal(again.association,'same');
});
test('switching providers requires logout and cannot link a second provider to an already represented local user',()=>{
 const linked=enrolled();assert.equal(startSignIn(linked,'apple'),linked);let s=finish(startSignIn(signOut(linked),'apple'));s=prepareAssociation(check(s));s=finish(accepted(s));assert.equal(s.association,'conflict');assert.deepEqual(s.links,{google:'sample-a'});
});
test('expired and unavailable sessions can retry the same provider, never gate local data or preserve consent',()=>{
 for(const preset of ['expired','session-unavailable']){const s=loadScenario(preset);assert.equal(canPrepareAssociation(s),false);const pending=reconnectSession(s);assert.equal(pending.provider,'google');assert.equal(pending.session,'signing-in');assert.equal(finish(pending).session,'signed-in');assert.equal(signOut(s).session,'signed-out')}
});
test('leaving a pending accepted attempt keeps uncertainty instead of claiming cancellation/rollback',()=>{
 const attempted=accepted(prepared()),left=departAccount(attempted);assert.equal(left.association,'ambiguous');assert.equal(left.pending,null);assert.equal(canPrepareAssociation(left),false);assert.equal(completeOperation(left,attempted.pending),left);assert.equal(restoreAccount(accountEnvelope(attempted)).association,'ambiguous');
});
test('only the synthetic session envelope survives reload; positive associations, links and confirmations do not',()=>{
 const linked=enrolled(),saved=accountEnvelope(linked);assert.deepEqual(Object.keys(saved),['version','session','provider','local','outcomes','needsCheck','interrupted']);assert.equal(JSON.stringify(saved).includes('sample-a'),true);const reloaded=restoreAccount(saved);assert.equal(reloaded.session,'signed-in');assert.equal(reloaded.association,'not-checked');assert.deepEqual(reloaded.links,{});assert.equal(reloaded.notice,'returning');
 const interrupted=restoreAccount(accountEnvelope(startSignIn(initialAccount(),'apple')));assert.equal(interrupted.session,'signed-out');assert.equal(interrupted.notice,'interrupted');
});
test('store reads/writes only its own key and leaves the onboarding example and saved Web records byte-identical',()=>{
 const s=storage(),onboarding={...initialDraft(),name:'Fictional example'};createOnboardingStore(s).save(onboarding);const keys=['milestoner-vision-v2-demo-v1','milestoner-vision-v2-profile-v1','milestoner-vision-v2-interest-universe-v1'];keys.forEach(k=>s.data.set(k,'sentinel:'+k));const before=new Map(s.data);s.calls.length=0;
 const store=createAccountStore(s);store.read();store.save(enrolled());store.save(signOut(enrolled()));for(const [k,v] of before)assert.equal(s.data.get(k),v);assert.ok(s.calls.every(c=>c[1]===ACCOUNT_REVIEW_KEY));assert.equal(s.data.get(ONBOARDING_KEY),JSON.stringify(onboarding));
});
test('corrupt and blocked storage never becomes a real identity or an authoritative association',()=>{
 for(const value of [null,{version:2},{...accountEnvelope(login()),provider:'real-person@example.test'},{...accountEnvelope(login()),outcomes:{login:'oauth'}}])assert.equal(restoreAccount(value),null);
 const denied={getItem(){throw Error()},setItem(){throw Error()}},store=createAccountStore(denied);assert.equal(store.read().available,false);assert.equal(store.save(login()),false);assert.equal(store.read().available,false);assert.equal(store.read().state.session,'signed-in');assert.equal(createAccountStore(denied).read().state.session,'signed-out');
});
test('all authored review presets are deterministic and contain only fixed provider/local-context labels',()=>{
 for(const p of PRESETS){const a=loadScenario(p),b=loadScenario(p);assert.deepEqual(a,b);assert.ok(['sample-a','sample-b'].includes(a.local));assert.ok(a.provider===null||PROVIDERS.includes(a.provider));assert.equal(a.consent,null);assert.equal(a.pending,null)}assert.deepEqual(loadScenario('unknown'),initialAccount());
});
test('provider Back cancels and Forward cannot resurrect a pending sign-in',()=>{
 let s=initialAccount();const w=browser('#account'),nav=createAccountNavigation(w,()=>s,()=>{},current=>{if(current==='provider')s=cancelOperation(s)});s=startSignIn(s,'google');nav.go('provider');w.history.back();assert.equal(s.session,'signed-out');w.history.forward();assert.equal(w.location.hash,'#account');nav.destroy();
});
test('confirmation Back/Escape-style cancellation and identity changes make history entries unusable',()=>{
 let s=prepared();const w=browser('#account'),nav=createAccountNavigation(w,()=>s,()=>{},current=>{if(current==='confirm')s=cancelConsent(s)});const old=s.consent;nav.go('confirm');w.history.back();assert.equal(s.consent,null);w.history.forward();assert.equal(w.location.hash,'#account');assert.equal(confirmAssociation(s,old),s);
 s=prepareAssociation(s);nav.go('confirm');s=changeLocalContext(s,'sample-b');nav.reconcile();assert.equal(w.location.hash,'#account');assert.equal(s.consent,null);nav.destroy();
});
test('direct confirmation/provider links cannot manufacture account state; local and onboarding destinations are fixed',()=>{
 assert.equal(allowedAccountRoute('confirm',initialAccount()),'account');assert.equal(allowedAccountRoute('provider',login()),'account');assert.equal(allowedAccountRoute('confirm',prepared()),'confirm');
 const w=browser('#confirm'),nav=createAccountNavigation(w,initialAccount,()=>{});assert.equal(w.location.hash,'#account');nav.destroy();const links=accountReviewLinks('/milestoner-v2-preview/','en','dark');assert.equal(links.local,'/milestoner-v2-preview/?lang=en#home');assert.equal(links.onboarding,'/milestoner-v2-preview/review/onboarding/?lang=en&appearance=dark');assert.ok(!accountReviewLinks('/milestoner-v2-preview/','https://evil.test','javascript:bad').account.includes('evil'));
});

 test('offline and unavailable presets stay honest on retry until the review outcome changes',()=>{
  for(const [preset,result] of [['offline','offline'],['lookup-unavailable','unavailable'],['conflict','conflict']]){
   const state=loadScenario(preset);
   assert.equal(finish(startAssociationCheck(state)).association,result);
   assert.equal(canPrepareAssociation(finish(startAssociationCheck(state))),false);
  }
 });
