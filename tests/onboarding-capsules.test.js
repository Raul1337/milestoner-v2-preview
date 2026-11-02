import test from 'node:test';
import assert from 'node:assert/strict';
import {INTEREST_CATALOG,DISCOVERY_GROUPS,interestLabel} from '../src/onboarding/catalog.js';
import {INITIAL_DISCOVERY_IDS,capsuleView} from '../src/onboarding/discovery-view.js';
import {initialDraft,draftOptions,toggleSelection,addCustomInterest,removeCustomInterest,compatibleDraft,createOnboardingStore,ONBOARDING_KEY} from '../src/onboarding/model.js';
const ids=view=>view.visible.map(i=>i.id);
const options=()=>draftOptions(initialDraft());
test('initial capsule cloud is an authored diverse fifteen-item subset; show more exposes the same complete catalog',()=>{
 const first=capsuleView(options(),[]),all=capsuleView(options(),[],{expanded:true});
 assert.equal(INITIAL_DISCOVERY_IDS.length,15);assert.equal(new Set(INITIAL_DISCOVERY_IDS).size,15);assert.equal(Object.isFrozen(INITIAL_DISCOVERY_IDS),true);
 assert.deepEqual(ids(first),INITIAL_DISCOVERY_IDS);assert.equal(first.catalogVisible,15);assert.equal(all.catalogVisible,35);assert.equal(first.total,35);
 assert.equal(new Set(first.visible.map(i=>i.group)).size,DISCOVERY_GROUPS.length);
 assert.deepEqual(new Set(ids(all)),new Set(INTEREST_CATALOG.map(i=>i.id)));assert.deepEqual(ids(all).slice(0,15),ids(first));
 assert.equal(new Set(ids(all)).size,35);assert.deepEqual(ids(capsuleView(options(),[])),ids(first));
});
test('selecting, deselecting and hiding the full catalog never reorder ordinary browsing or consume hidden selections',()=>{
 let d=initialDraft();const initialOrder=ids(capsuleView(draftOptions(d),d.selected));
 for(const id of ['health','cinema','history']){d=toggleSelection(d,id);assert.deepEqual(ids(capsuleView(draftOptions(d),d.selected)),initialOrder)}
 const saved=structuredClone(d),expandedOrder=ids(capsuleView(draftOptions(d),d.selected,{expanded:true}));
 d=toggleSelection(d,'health');assert.deepEqual(ids(capsuleView(draftOptions(d),d.selected,{expanded:true})),expandedOrder);
 assert.equal(ids(capsuleView(draftOptions(d),d.selected)).includes('history'),false);assert.ok(d.selected.includes('history'));
 assert.ok(ids(capsuleView(draftOptions(d),d.selected,{selectedOnly:true})).includes('history'));assert.deepEqual(saved.selected,['cinema','health','history']);
});
test('search always spans every predefined English and Spanish label, including all twenty initially hidden options',()=>{
 const data=options();for(const i of INTEREST_CATALOG)for(const language of ['es','en'])for(const expanded of [false,true]){
  const query=' '+interestLabel(i,language).toUpperCase().normalize('NFD').replace(/\p{M}/gu,'')+' ';
  const result=capsuleView(data,[],{query,expanded});assert.ok(ids(result).includes(i.id),`${i.id}/${language}`);assert.equal(result.browsing,false);
 }
 assert.equal(capsuleView(data,[],{query:'no matching fictional interest'}).total,0);
 assert.equal(capsuleView(data,[],{query:'   '}).catalogVisible,15);
});
test('custom capsules remain literal, stable and visible in compact browsing, with independent deselection and deletion',()=>{
 let d=initialDraft();d=addCustomInterest(d,'星を見る & Cerámica <ficticia>',()=> 'custom-one').draft;d=addCustomInterest(d,'Astronomía de papel',()=> 'custom-two').draft;
 const before=structuredClone(d),view=capsuleView(draftOptions(d),d.selected);
 assert.equal(view.visible.length,17);assert.deepEqual(ids(view).slice(-2),['custom-one','custom-two']);assert.equal(view.visible.at(-2).name,'星を見る & Cerámica <ficticia>');assert.equal(view.visible.at(-2).group,undefined);
 d=toggleSelection(d,'custom-one');assert.deepEqual(ids(capsuleView(draftOptions(d),d.selected)),ids(view));
 assert.deepEqual(ids(capsuleView(draftOptions(d),d.selected,{selectedOnly:true})),['custom-two']);assert.equal(d.custom[0].id,before.custom[0].id);
 d=removeCustomInterest(d,'custom-one');assert.equal(ids(capsuleView(draftOptions(d),d.selected)).includes('custom-one'),false);
 d=addCustomInterest(d,before.custom[0].label,()=> 'custom-new').draft;assert.deepEqual(ids(capsuleView(draftOptions(d),d.selected)).slice(-2),['custom-two','custom-new']);
});
test('view switching and search compose truthfully without changing selection order or empty selected state',()=>{
 let d=initialDraft();for(const id of ['reading','history','learning'])d=toggleSelection(d,id);
 const opts=draftOptions(d),snapshot=structuredClone(d);
 assert.deepEqual(ids(capsuleView(opts,d.selected,{selectedOnly:true})),['learning','reading','history']);
 assert.deepEqual(ids(capsuleView(opts,d.selected,{selectedOnly:true,query:'HISTORY'})),['history']);
 assert.equal(capsuleView(opts,[],{selectedOnly:true}).visible.length,0);
 assert.equal(capsuleView(opts,d.selected,{selectedOnly:true,query:'cooking'}).visible.length,0);
 assert.deepEqual(d,snapshot);
});
test('expanded and filtered views are ephemeral, retaining the onboarding payload and V1 compatibility without any storage write',()=>{
 const previous={version:1,name:'Fictional',selected:['photography','hiking'],step:'interests'},upgraded=compatibleDraft(previous);
 let d=addCustomInterest(upgraded,'Cerámica ficticia',()=> 'custom-demo').draft;const raw=JSON.stringify(d),calls=[],data=new Map([[ONBOARDING_KEY,raw],['application','unchanged']]);
 const store=createOnboardingStore({getItem:k=>data.get(k),setItem:(k,v)=>{calls.push(k);data.set(k,v)}});d=store.read();
 for(const expanded of [false,true])for(const selectedOnly of [false,true])for(const query of ['', 'ceramica', 'reading'])capsuleView(draftOptions(d),d.selected,{expanded,selectedOnly,query});
 assert.deepEqual(calls,[]);assert.equal(data.get(ONBOARDING_KEY),raw);assert.equal(data.get('application'),'unchanged');assert.equal(d.version,3);assert.deepEqual(d,JSON.parse(raw));
});
