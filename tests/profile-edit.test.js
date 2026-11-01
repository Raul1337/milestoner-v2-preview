import test from 'node:test';
import assert from 'node:assert/strict';
import {initial,KEY} from '../src/model.js';
import {INTEREST_KEY,initialInterests} from '../src/interest-model.js';
import {PROFILE_KEY,PROFILE_LIMITS,AVATAR_OPTIONS,initialProfile,validateProfile,createProfileStore} from '../src/profile-model.js';

test('profile defaults are isolated, versioned and read-only until explicit Save',()=>{
 const app=JSON.stringify(initial()),interests=JSON.stringify(initialInterests()),map=new Map([[KEY,app],[INTEREST_KEY,interests]]),writes=[];
 const storage={getItem:k=>map.get(k),setItem:(k,v)=>{writes.push(k);map.set(k,v)}};
 const store=createProfileStore(storage),draft=store.read();assert.equal(draft.displayName,'Alex Rivera');assert.equal(draft.username,'alex.demo');assert.equal(draft.avatar,'original');assert.equal(draft.version,1);assert.deepEqual(writes,[]);
 draft.displayName='Unsaved fictional name';draft.avatar='lagoon';assert.equal(store.read().displayName,'Alex Rivera');
 assert.equal(store.save(draft).persisted,true);assert.deepEqual(writes,[PROFILE_KEY]);assert.equal(map.get(KEY),app);assert.equal(map.get(INTEREST_KEY),interests);assert.notEqual(PROFILE_KEY,KEY);assert.notEqual(PROFILE_KEY,INTEREST_KEY);
 assert.deepEqual(createProfileStore(storage).read(),draft);
});
test('profile validation enforces demo limits, permits optional fields and preserves non-Latin names',()=>{
 const base=initialProfile();for(const displayName of ['', '   ','x'.repeat(51),'A\nB'])assert.equal(validateProfile({...base,displayName}).errors.displayName,'name');
 assert.equal(validateProfile({...base,displayName:'  Álex 山田  ',username:'  @alex.demo  ',bio:'  Fictitious bio  '}).profile.displayName,'Álex 山田');
 const normalized=validateProfile({...base,username:' @alex.demo ',bio:' Test '}).profile;assert.equal(normalized.username,'alex.demo');assert.equal(normalized.bio,'Test');
 assert.equal(validateProfile({...base,username:'',bio:''}).profile.username,'');
 for(const username of ['space here','a@b','a/b','-first','x'.repeat(25)])assert.equal(validateProfile({...base,username}).errors.username,'username');
 assert.equal(validateProfile({...base,bio:'x'.repeat(161)}).errors.bio,'bio');assert.equal(validateProfile({...base,displayName:'x'.repeat(PROFILE_LIMITS.displayName),username:'x'.repeat(PROFILE_LIMITS.username),bio:'x'.repeat(PROFILE_LIMITS.bio)}).profile.bio.length,160);
 assert.equal(validateProfile({...base,avatar:'remote-photo-url'}).errors.avatar,'avatar');
});
test('all curated avatar choices persist explicitly and can be reversed to the original',()=>{
 let saved;const storage={getItem:()=>saved,setItem:(k,v)=>saved=v},store=createProfileStore(storage);
 assert.equal(new Set(AVATAR_OPTIONS.map(a=>a.id)).size,3);
 for(const avatar of [...AVATAR_OPTIONS.map(a=>a.id),'original']){const result=store.save({...initialProfile(),avatar});assert.equal(result.persisted,true);assert.equal(createProfileStore(storage).read().avatar,avatar)}
});
test('unavailable persistence is reported honestly, keeps visit-only state and cannot masquerade as a durable save',()=>{
 const old={...initialProfile(),displayName:'Previously saved demo'},storage={getItem:()=>JSON.stringify(old),setItem(){throw Error('denied')}},store=createProfileStore(storage);
 const next={...old,displayName:'Visit only demo',username:'',bio:''},result=store.save(next);assert.equal(result.ok,true);assert.equal(result.persisted,false);assert.deepEqual(store.read(),next);assert.deepEqual(createProfileStore(storage).read(),old);
 const denied=createProfileStore({getItem(){throw Error('denied')},setItem(){throw Error('denied')}});assert.deepEqual(denied.read(),initialProfile());assert.equal(denied.save(next).persisted,false);
 const before=store.read();assert.equal(store.save({...next,displayName:''}).ok,false);assert.deepEqual(store.read(),before);
});
test('corrupt and unsupported stored profiles fall back without migration or writes; activity reset leaves personalization separate',()=>{
 for(const data of ['{bad',JSON.stringify({...initialProfile(),version:2}),JSON.stringify({...initialProfile(),avatar:'absent'}),JSON.stringify({...initialProfile(),displayName:null})]){let writes=0;const store=createProfileStore({getItem:()=>data,setItem:()=>writes++});assert.deepEqual(store.read(),initialProfile());assert.equal(writes,0)}
 const map=new Map(),storage={getItem:k=>map.get(k),setItem:(k,v)=>map.set(k,v)},store=createProfileStore(storage),next={...initialProfile(),displayName:'Personalized demo'};
 store.save(next);storage.setItem(KEY,JSON.stringify(initial()));assert.deepEqual(createProfileStore(storage).read(),next);
});
