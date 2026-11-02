import test from 'node:test';
import assert from 'node:assert/strict';
import {MILES_ENTRY,backgroundRoute,navigationView,createMilesNavigation} from '../src/miles-navigation.js';
function browser(hash='home'){
 const listeners=new Map(),stack=[{hash:'#'+hash,state:null}];let index=0;
 const win={location:{pathname:'/milestoner-v2-preview/',search:'?lang=en',hash:'#'+hash},addEventListener:(n,f)=>{if(!listeners.has(n))listeners.set(n,new Set());listeners.get(n).add(f)},removeEventListener:(n,f)=>listeners.get(n)?.delete(f)};
 function emit(){for(const type of ['popstate','hashchange'])for(const f of listeners.get(type)||[])f()}
 function move(next){if(next<0||next>=stack.length)return;index=next;win.location.hash=stack[index].hash;emit()}
 win.history={get state(){return stack[index].state},pushState(state,_,url){stack.splice(index+1);stack.push({hash:new URL(url,'https://example.test').hash,state});index++;win.location.hash=stack[index].hash},replaceState(state,_,url){stack[index]={hash:new URL(url,'https://example.test').hash,state};win.location.hash=stack[index].hash},back:()=>move(index-1),forward:()=>move(index+1)};
 Object.defineProperty(win,'localStorage',{get(){throw Error('Navigation must not access demo storage')}});
 return {win,stack,get index(){return index},hash(value){win.history.pushState(null,'',win.location.pathname+win.location.search+'#'+value);emit()}};
}
test('overlay URL view has a boolean open state and safe bookmark fallback',()=>{
 assert.deepEqual(navigationView({hash:'#miles'},{state:null}),{open:true,route:'home'});
 assert.deepEqual(navigationView({hash:'#miles'},{state:{[MILES_ENTRY]:{background:'project/japan'}}}),{open:true,route:'project/japan'});
 assert.equal(backgroundRoute('https://private.invalid'),'home');assert.equal(backgroundRoute('project/demo-123'),'project/demo-123');
});
test('opening and closing Miles preserve the underlying route and do not write demo storage',()=>{
 const b=browser('discover'),views=[],nav=createMilesNavigation(b.win,v=>views.push(v),a=>a());nav.open();
 assert.deepEqual(views.at(-1),{route:'discover',open:true});assert.equal(b.win.location.hash,'#miles');nav.close();
 assert.deepEqual(views.at(-1),{route:'discover',open:false});assert.equal(b.win.location.hash,'#discover');nav.destroy();
});
test('dirty browser Back restores Miles until discard is explicitly confirmed',()=>{
 const b=browser('project/japan'),views=[];let discard;
 const nav=createMilesNavigation(b.win,v=>views.push(v),a=>discard=a);nav.open();b.win.history.back();
 assert.equal(b.win.location.hash,'#miles');assert.equal(views.at(-1).open,true);assert.equal(typeof discard,'function');
 // Keep editing: no action, no loss of context. A second Back still creates only one guard.
 b.win.history.back();assert.equal(b.stack.length,2);assert.equal(b.win.location.hash,'#miles');discard();
 assert.deepEqual(views.at(-1),{route:'project/japan',open:false});assert.equal(b.win.location.hash,'#project/japan');nav.destroy();
});
test('a direct miles bookmark closes to Home, not to a foreign page',()=>{
 const b=browser('miles'),views=[],nav=createMilesNavigation(b.win,v=>views.push(v),a=>a());
 assert.equal(b.stack.length,2);assert.equal(b.stack[0].hash,'#home');nav.close();assert.equal(b.win.location.hash,'#home');assert.equal(views.at(-1).open,false);nav.destroy();
});
test('refresh-compatible overlay history is reused without appending duplicate entries',()=>{
 const b=browser('discover');let nav=createMilesNavigation(b.win,()=>{},a=>a());nav.open();nav.destroy();const length=b.stack.length;
 nav=createMilesNavigation(b.win,()=>{},a=>a());assert.equal(b.stack.length,length);assert.equal(navigationView(b.win.location,b.win.history).route,'discover');nav.close();assert.equal(b.win.location.hash,'#discover');nav.destroy();
});
test('Forward reopens Miles over its original context after a clean close',()=>{
 const b=browser('you'),views=[],nav=createMilesNavigation(b.win,v=>views.push(v),a=>a());nav.open();nav.close();b.win.history.forward();assert.deepEqual(views.at(-1),{route:'you',open:true});nav.close();nav.destroy();
});
test('legacy hash links enter Miles over the current app route',()=>{
 const b=browser('progress'),views=[],nav=createMilesNavigation(b.win,v=>views.push(v),a=>a());b.hash('miles');assert.deepEqual(views.at(-1),{route:'progress',open:true});nav.close();assert.equal(b.win.location.hash,'#progress');nav.destroy();
});
test('confirmation closes once and explicit follow-up navigation runs once',()=>{
 const b=browser(),views=[];let count=0;const nav=createMilesNavigation(b.win,v=>views.push(v),a=>a());nav.open();nav.close(()=>{count++;b.hash('project/new-plan')});
 assert.equal(count,1);assert.equal(b.win.location.hash,'#project/new-plan');assert.deepEqual(views.at(-1),{route:'project/new-plan',open:false});nav.destroy();
});
test('dedicated profile editor has its own route and dirty navigation protection without overwriting Edit Universe',()=>{
 assert.equal(backgroundRoute('you/profile/edit'),'you/profile/edit');assert.equal(backgroundRoute('you/edit'),'you/edit');assert.equal(backgroundRoute('you/profile/edit/other'),'home');
 const b=browser('you/profile'),views=[];let dirty=true,pending,requests=0;
 const nav=createMilesNavigation(b.win,v=>views.push(v),a=>a(),()=>({isDirty:()=>dirty,request:a=>{pending=a;requests++}}));
 b.hash('you/profile/edit');b.win.history.back();assert.equal(b.win.location.hash,'#you/profile/edit');assert.equal(views.at(-1).route,'you/profile/edit');assert.equal(requests,1);
 // Keep editing does not invoke the pending action. Explicit discard alone resumes it.
 b.hash('you');assert.equal(b.win.location.hash,'#you/profile/edit');dirty=false;pending();assert.equal(b.win.location.hash,'#you');assert.equal(views.at(-1).route,'you');
 b.win.history.back();assert.equal(views.at(-1).route,'you/profile/edit');b.win.history.forward();assert.equal(views.at(-1).route,'you');nav.destroy();
});
test('Miles can open and return over a dirty profile draft without consuming it or requesting discard',()=>{
 const b=browser('you/profile/edit'),views=[];let requests=0;
 const nav=createMilesNavigation(b.win,v=>views.push(v),a=>a(),()=>({isDirty:()=>true,request:()=>requests++}));
 nav.open();assert.deepEqual(views.at(-1),{route:'you/profile/edit',open:true});nav.close();assert.deepEqual(views.at(-1),{route:'you/profile/edit',open:false});assert.equal(requests,0);
 b.win.history.forward();assert.equal(views.at(-1).route,'you/profile/edit');assert.equal(views.at(-1).open,true);nav.close();assert.equal(requests,0);nav.destroy();
});
test('Badges and Featured retain their route through Miles, reload, Back and Forward without storage access',()=>{
 for(const route of ['you/badges','you/badges/featured']){
  assert.equal(backgroundRoute(route),route);
  const b=browser('you/profile'),views=[];let nav=createMilesNavigation(b.win,v=>views.push(v),a=>a());
  b.hash(route);nav.open();assert.deepEqual(views.at(-1),{route,open:true});
  nav.destroy();nav=createMilesNavigation(b.win,v=>views.push(v),a=>a());
  assert.deepEqual(navigationView(b.win.location,b.win.history),{route,open:true});
  nav.close();assert.deepEqual(views.at(-1),{route,open:false});
  b.win.history.back();assert.equal(views.at(-1).route,'you/profile');
  b.win.history.forward();assert.equal(views.at(-1).route,route);nav.destroy();
 }
 assert.equal(backgroundRoute('you/badges/manage'),'home');
});
