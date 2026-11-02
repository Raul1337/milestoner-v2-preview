import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ONBOARDING_KEY,STEPS,INTEREST_CATALOG,initialDraft,draftIdentity,draftInterests,toggleSelection,createOnboardingStore} from '../src/onboarding/model.js';
import {createOnboardingNavigation} from '../src/onboarding/navigation.js';
import {appearanceTokens} from '../src/onboarding/appearance.js';
import {contrast} from '../theme-playground/native-palette.js';
import {universeLayout,affinityDiameter} from '../src/universe-layout.js';
import app from '../vite.config.js';

function storage(){const data=new Map(),calls=[];return {data,calls,getItem:k=>{calls.push(['get',k]);return data.get(k)||null},setItem:(k,v)=>{calls.push(['set',k]);data.set(k,v)},removeItem:k=>{calls.push(['remove',k]);data.delete(k)}}}
function browser(hash='',state=null){
 const listeners=new Map(),stack=[{hash,state}];let index=0;
 const win={location:{pathname:'/milestoner-v2-preview/review/onboarding/',search:'?lang=es&appearance=dark',hash},addEventListener:(type,fn)=>{if(!listeners.has(type))listeners.set(type,new Set());listeners.get(type).add(fn)},removeEventListener:(type,fn)=>listeners.get(type)?.delete(fn)};
 const emit=()=>{for(const type of ['popstate','hashchange'])for(const fn of listeners.get(type)||[])fn()};
 const move=i=>{if(i<0||i>=stack.length)return;index=i;win.location.hash=stack[index].hash;emit()};
 win.history={get state(){return stack[index].state},pushState:(state,_,url)=>{stack.splice(++index);stack.push({hash:new URL(url,'https://example.test').hash,state});win.location.hash=stack[index].hash},replaceState:(state,_,url)=>{stack[index]={hash:new URL(url,'https://example.test').hash,state};win.location.hash=stack[index].hash},back:()=>move(index-1),forward:()=>move(index+1)};
 return win;
}
test('optional name and empty interests use a neutral identity without fictional user attribution',()=>{
 const d=initialDraft();assert.equal(d.name,'');assert.deepEqual(d.selected,[]);assert.deepEqual(draftInterests(d),[]);
 assert.equal(draftIdentity(d,'es'),'Tú');assert.equal(draftIdentity({...d,name:'   '},'en'),'You');
 assert.equal(draftIdentity({...d,name:'  名前 de prueba  '},'es'),'名前 de prueba');
});
test('explicit selections are reversible and every interest starts Curious independently of category and click order',()=>{
 let a=initialDraft(),b=initialDraft();for(const i of INTEREST_CATALOG)a=toggleSelection(a,i.id);for(const i of [...INTEREST_CATALOG].reverse())b=toggleSelection(b,i.id);
 assert.deepEqual(a.selected,b.selected);assert.equal(draftInterests(a).length,35);
 assert.ok(draftInterests(a).every(i=>i.affinity==='curious'&&i.note===''));
 assert.deepEqual(INTEREST_CATALOG.map(i=>i.name),draftInterests(a).map(i=>i.name));
 for(const i of INTEREST_CATALOG)a=toggleSelection(a,i.id);assert.deepEqual(a.selected,[]);
 assert.equal(toggleSelection(a,'unknown'),a);
});
test('session draft edits, finish and discard preserve every existing application/profile/interest key',()=>{
 const s=storage(),keys=['milestoner-vision-v2-demo-v1','milestoner-vision-v2-profile-v1','milestoner-vision-v2-interest-universe-v1','milestoner-vision-v2-sidebar-expanded-v1','milestoner-demo-insight-review-v1'];
 keys.forEach((k,i)=>s.data.set(k,JSON.stringify({sentinel:i})));const original=new Map(s.data);
 const store=createOnboardingStore(s);assert.deepEqual(store.read(),initialDraft());assert.equal(s.calls.filter(c=>c[0]!=='get').length,0);
 const d={...toggleSelection(initialDraft(),'photography'),name:'Fictional example',step:'finished'};
 assert.equal(store.save(d).persisted,true);assert.deepEqual(createOnboardingStore(s).read(),d);
 d.name='mutated caller';assert.equal(store.read().name,'Fictional example');
 assert.equal(store.clear(),true);assert.deepEqual(createOnboardingStore(s).read(),initialDraft());
 assert.deepEqual(s.data,original);assert.ok(s.calls.every(c=>c[1]===ONBOARDING_KEY));
});
test('corrupt or unsupported session storage never migrates saved data and blocked storage is explicitly visit-only',()=>{
 const s=storage(),store=createOnboardingStore(s);for(const raw of ['{',JSON.stringify({version:2}),JSON.stringify({...initialDraft(),selected:['missing']}),JSON.stringify({...initialDraft(),selected:['reading','reading']})]){s.data.set(ONBOARDING_KEY,raw);assert.deepEqual(store.read(),initialDraft());assert.equal(s.data.get(ONBOARDING_KEY),raw)}
 const denied={getItem(){throw Error('blocked')},setItem(){throw Error('blocked')},removeItem(){throw Error('blocked')}};
 const temporary=createOnboardingStore(denied),d={...initialDraft(),name:'Visit only',step:'information'};
 assert.deepEqual(temporary.save(d),{ok:true,persisted:false});assert.deepEqual(temporary.read(),d);assert.deepEqual(createOnboardingStore(denied).read(),initialDraft());
 assert.equal(temporary.save({...d,name:'x'.repeat(51)}).ok,false);assert.equal(temporary.read().name,d.name);assert.equal(temporary.clear(),false);
});
test('Back/Forward and reload restore the isolated step without consuming selections or touching Miles history',()=>{
 const s=storage(),store=createOnboardingStore(s),win=browser();let draft=initialDraft(),changes=0;
 const nav=createOnboardingNavigation(win,draft.step,step=>{draft={...draft,step};store.save(draft);changes++});
 assert.equal(win.location.hash,'#welcome');for(const step of ['information','interests','universe','finished'])nav.go(step);
 assert.equal(changes,4);win.history.back();assert.equal(draft.step,'universe');win.history.back();assert.equal(draft.step,'interests');win.history.forward();assert.equal(draft.step,'universe');
 nav.destroy();const before=win.location.hash,restored=createOnboardingStore(s).read();const next=createOnboardingNavigation(win,restored.step,()=>{});assert.equal(win.location.hash,before);assert.equal(win.history.state,null);next.destroy();
 const fresh=browser();createOnboardingNavigation(fresh,restored.step,()=>{}).destroy();assert.equal(fresh.location.hash,'#universe');
 assert.equal(win.location.search,'?lang=es&appearance=dark');
});
test('discarded session content cannot return through browser history',()=>{
 const s=storage(),store=createOnboardingStore(s),win=browser();let draft=toggleSelection({...initialDraft(),name:'Temporary name'},'reading');
 const nav=createOnboardingNavigation(win,draft.step,step=>{draft={...draft,step};store.save(draft)});
 nav.go('interests');nav.go('universe');store.clear();draft=initialDraft();nav.go('welcome');store.clear();
 win.history.back();assert.equal(draft.name,'');assert.deepEqual(draft.selected,[]);assert.equal(createOnboardingStore(s).read().name,'');nav.destroy();
});
test('zero through twelve Curious selections reuse collision-safe approved geometry and one profile',()=>{
 for(const width of [288,343,358,396,720,1200])for(const count of [0,1,8,9,12])for(const expanded of [false,true]){
  const layout=universeLayout(width,count,expanded),nodes=[...layout.nodes.map(n=>({...n,r:affinityDiameter('curious',layout.max,layout.compact)/2})),{x:layout.cx,y:layout.cy,r:layout.profile/2}];
  assert.equal(layout.nodes.length,expanded?count:Math.min(count,8));
  for(const [i,a] of nodes.entries()){assert.ok(a.x-a.r>=0&&a.x+a.r<=width);for(const b of nodes.slice(i+1))assert.ok(Math.hypot(a.x-b.x,a.y-b.y)>a.r+b.r)}
 }
});
test('review appearance derives original Light/Dark and increased-contrast roles and has a separate build entry',()=>{
 const source=readFileSync(new URL('../src/tokens.css',import.meta.url),'utf8'),light=appearanceTokens(source,false),dark=appearanceTokens(source,true);
 assert.equal(light['--brand-primary'],dark['--brand-primary']);assert.equal(light['--text'],'#101A35');assert.equal(dark['--text'],'#EEF2FC');assert.equal(appearanceTokens(source,true,true)['--focus'],'#D2DCFF');
 assert.equal(app.build.rollupOptions.input.app,'index.html');assert.equal(app.build.rollupOptions.input.onboarding,'review/onboarding/index.html');
});
test('onboarding neutral text, canvas links and primary actions retain accessible token contrast',()=>{
 const source=readFileSync(new URL('../src/tokens.css',import.meta.url),'utf8');
 for(const dark of [false,true])for(const more of [false,true]){
  const v=appearanceTokens(source,dark,more);
  for(const bg of ['--canvas-top','--canvas-mid','--canvas-bottom','--surface-elevated'])for(const ink of ['--text','--text-secondary','--secondary-action'])assert.ok(contrast(v[ink],v[bg])>=4.5,`${dark}/${more}/${ink}/${bg}`);
  assert.ok(contrast(v['--on-brand'],v['--brand-primary'])>=4.5);
 }
});
