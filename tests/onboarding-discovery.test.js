import test from 'node:test';
import assert from 'node:assert/strict';
import {initialInterests} from '../src/interest-model.js';
import {DISCOVERY_GROUPS,INTEREST_CATALOG,LEGACY_IDS,interestLabel,normalizeInterest,matchesInterest,discoveryResults} from '../src/onboarding/catalog.js';
import {ONBOARDING_KEY,CUSTOM_INTEREST_LIMIT,initialDraft,validDraft,compatibleDraft,addCustomInterest,removeCustomInterest,toggleSelection,draftOptions,draftInterests,meaningfulDraft,createOnboardingStore} from '../src/onboarding/model.js';
import {universeLayout,affinityDiameter} from '../src/universe-layout.js';
const add=(d,text,id='custom-test')=>addCustomInterest(d,text,()=>id);
const storage=()=>{const data=new Map(),calls=[];return {data,calls,getItem(k){calls.push(['get',k]);return data.get(k)},setItem(k,v){calls.push(['set',k]);data.set(k,v)},removeItem(k){calls.push(['remove',k]);data.delete(k)}}};
test('35 bilingual optional interests use discovery themes without altering original catalog identities or roles',()=>{
 assert.equal(INTEREST_CATALOG.length,35);assert.equal(new Set(INTEREST_CATALOG.map(i=>i.id)).size,35);assert.equal(DISCOVERY_GROUPS.length,8);
 const original=initialInterests().confirmed;assert.deepEqual(INTEREST_CATALOG.slice(0,12).map(({id,name})=>({id,name})),original.map(({id,name})=>({id,name})));
 assert.deepEqual(INTEREST_CATALOG.slice(0,12).map(i=>i.tone),['learning','travel','learning','finance','fitness','learning','finance','travel','learning','travel','finance','fitness']);
 assert.equal(original.length,12);assert.ok(INTEREST_CATALOG.every(i=>DISCOVERY_GROUPS.some(g=>g.id===i.group)&&i.name.es&&i.name.en));
 assert.deepEqual(initialDraft().selected,[]);assert.equal(Object.isFrozen(INTEREST_CATALOG[0].name),true);
});
test('bilingual search normalizes accents case and whitespace; selection review includes custom text unchanged',()=>{
 assert.equal(normalizeInterest('  FOTOGRAFÍA   artística '),'fotografia artistica');
 assert.equal(matchesInterest(INTEREST_CATALOG.find(i=>i.id==='physical-activity'),' FISICA '),true);
 assert.equal(matchesInterest(INTEREST_CATALOG.find(i=>i.id==='physical-activity'),'physical activity'),true);
 assert.equal(matchesInterest(INTEREST_CATALOG[0],'xxxx-no-match'),false);
 const d=add(initialDraft(),'星を見る & arte <ficticio>').draft,custom=draftInterests(d)[0];
 assert.equal(matchesInterest(custom,'ARTE'),true);assert.equal(interestLabel(custom,'en'),interestLabel(custom,'es'));assert.equal(custom.tone,'brand');assert.equal(custom.custom,true);assert.equal(custom.group,undefined);
 assert.equal(draftOptions(d).length,36);assert.equal(draftInterests(toggleSelection(d,custom.id)).length,0);
});
test('custom validation trims only ends, supports Unicode and special text, counts code points and never truncates',()=>{
 for(const text of ['', '   ', '\u200b', '\u0301'])assert.equal(add(initialDraft(),text).error,'empty');
 for(const text of ['a\nb','a\u0000b','a\u202eb'])assert.equal(add(initialDraft(),text).error,'characters');
 const text='  星を見る 👩🏽‍🚀 & <script> / "test"  ',r=add(initialDraft(),text);assert.equal(r.ok,true);assert.equal(r.draft.custom[0].label,text.trim());assert.equal(validDraft(r.draft),true);
 assert.equal(CUSTOM_INTEREST_LIMIT,60);assert.equal(add(initialDraft(),'😀'.repeat(60)).ok,true);assert.equal(add(initialDraft(),'😀'.repeat(61)).error,'length');
 assert.equal(add(initialDraft(),'x'.repeat(61)).error,'length');assert.deepEqual(initialDraft().custom,[]);
});
test('duplicates check BOTH locales and every retained custom interest using accents, case and whitespace',()=>{
 for(const i of INTEREST_CATALOG)for(const label of Object.values(i.name)){
  const r=add(initialDraft(),'  '+label.normalize('NFD').replace(/\p{M}/gu,'').toUpperCase().replaceAll(' ','   ')+' ');
  assert.equal(r.error,'duplicate',label);assert.equal(r.existingId,i.id);
 }
 let d=add(initialDraft(),'Cerámica   azul').draft;d=toggleSelection(d,'custom-test');
 assert.equal(add(d,' ceramica azul ','custom-other').existingId,'custom-test');assert.equal(d.selected.length,0);
});
test('multiple custom identities survive deselect, reselect and reload; explicit deletion permits a new identity',()=>{
 let d=add(initialDraft(),'Astronomía amateur','custom-one').draft;d=add(d,'Papel & tinta','custom-two').draft;
 d=toggleSelection(d,'custom-one');assert.equal(d.custom[0].id,'custom-one');assert.equal(meaningfulDraft({...d,selected:[]}),true);
 const s=storage(),store=createOnboardingStore(s);assert.equal(store.save(d).persisted,true);d=createOnboardingStore(s).read();assert.equal(d.custom.length,2);
 d=toggleSelection(d,'custom-one');assert.deepEqual(draftInterests(d).map(i=>i.id),['custom-one','custom-two']);assert.ok(draftInterests(d).every(i=>i.affinity==='curious'));
 d=removeCustomInterest(d,'custom-one');assert.deepEqual(d.selected,['custom-two']);assert.equal(add(d,'astronomia amateur','custom-three').ok,true);
 assert.equal(add(d,'Another','custom-two').error,'identity');assert.equal(add(d,'Another','invalid id').error,'identity');
});
test('V1 sessions retain every selection, name and step through explicit nonmutating compatibility',()=>{
 const s=storage(),v1={version:1,name:'旧い名前',selected:[...LEGACY_IDS].reverse(),step:'universe'},raw=JSON.stringify(v1);s.data.set(ONBOARDING_KEY,raw);
 const restored=createOnboardingStore(s).read();assert.deepEqual(restored,{...v1,version:2,custom:[]});assert.equal(s.data.get(ONBOARDING_KEY),raw);assert.ok(s.calls.every(([op])=>op==='get'));
 assert.deepEqual(draftInterests(restored).map(i=>i.id),LEGACY_IDS);assert.equal(validDraft(restored),true);
 const next=add(restored,'Fictional custom').draft;createOnboardingStore(s).save(next);assert.deepEqual(createOnboardingStore(s).read(),next);
 assert.deepEqual(v1,{version:1,name:'旧い名前',selected:[...LEGACY_IDS].reverse(),step:'universe'});assert.equal(compatibleDraft({...v1,selected:['science']}),null);
});
test('V2 validation rejects broken identities, missing references and duplicate labels; storage denial remains honest and isolated',()=>{
 const d=add(initialDraft(),'Text','custom-one').draft;
 for(const invalid of [{...d,custom:null},{...d,selected:['custom-missing']},{...d,custom:[{id:'custom-one',label:' Text'}]},{...d,custom:[...d.custom,{id:'custom-two',label:'TEXT'}]},{...d,custom:[{id:'custom-one',label:'Photography'}]},{...d,custom:[...d.custom,d.custom[0]]},{...d,selected:['custom-one','custom-one']}])assert.equal(validDraft(invalid),false);
 const s=storage(),keys=['profile','universe','projects','settings'];keys.forEach(k=>s.data.set(k,`sentinel:${k}`));const before=new Map(s.data),store=createOnboardingStore(s);store.save(d);store.clear();assert.deepEqual(s.data,before);assert.ok(s.calls.every(c=>c[1]===ONBOARDING_KEY));
 const denied={getItem(){throw Error()},setItem(){throw Error()},removeItem(){throw Error()}},temporary=createOnboardingStore(denied);assert.deepEqual(temporary.save(d),{ok:true,persisted:false});assert.deepEqual(temporary.read(),d);assert.deepEqual(createOnboardingStore(denied).read(),initialDraft());assert.equal(temporary.clear(),false);
});
test('large combined selections preserve one approved profile and collision-free normal/expanded orbital slots',()=>{
 let d=initialDraft();for(const i of INTEREST_CATALOG)d=toggleSelection(d,i.id);for(let n=0;n<25;n++)d=add(d,`Fictional custom ${n}`,`custom-${n}`).draft;
 assert.equal(draftInterests(d).length,60);assert.equal(new Set(d.selected).size,60);
 for(const width of [288,343,358,396,736,1200])for(const count of [0,8,35,43,60])for(const expanded of [false,true]){
  const l=universeLayout(width,count,expanded),nodes=[...l.nodes.map(n=>({...n,r:affinityDiameter('curious',l.max,l.compact)/2})),{x:l.cx,y:l.cy,r:l.profile/2}];
  assert.equal(l.nodes.length,expanded?count:Math.min(count,8));for(const [index,a] of nodes.entries()){assert.ok(a.x-a.r>=0&&a.x+a.r<=width);assert.ok(a.y-a.r>=0&&a.y+a.r<=l.height);for(const b of nodes.slice(index+1))assert.ok(Math.hypot(a.x-b.x,a.y-b.y)>a.r+b.r,`${width}/${count}/${expanded}`)}
 }
});

test('search, discovery-theme and selected-only filters compose without changing selections or classifying custom text',()=>{
 let d=toggleSelection(initialDraft(),'science');d=add(d,'Ciencia del papel').draft;const options=draftOptions(d),before=structuredClone(d);
 assert.deepEqual(discoveryResults(options,d.selected,{selectedOnly:true}).map(i=>i.id),['science','custom-test']);
 assert.equal(discoveryResults(options,d.selected,{group:'move'}).length,5);
 assert.deepEqual(discoveryResults(options,d.selected,{group:'learn',selectedOnly:true}).map(i=>i.id),['science']);
 assert.deepEqual(discoveryResults(options,d.selected,{group:'custom',query:'CIENCIA'}).map(i=>i.id),['custom-test']);
 assert.equal(discoveryResults(options,d.selected,{query:'unmatched-fictional-query'}).length,0);
 assert.equal(discoveryResults(options,[],{selectedOnly:true}).length,0);assert.deepEqual(d,before);
});
