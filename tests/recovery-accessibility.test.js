import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {formSnapshot,bindUnsavedNavigation,dismissOnEscape} from '../src/unsaved-changes.js';
import {nonmodalBoundary} from '../src/insight-position.js';
import {createOnboardingStore,initialDraft,ONBOARDING_KEY} from '../src/onboarding/model.js';
import {appearanceTokens} from '../src/onboarding/appearance.js';

test('meaningful form changes include dates and checks; whitespace and returning to original values do not require discard',()=>{
 const input={name:'title',type:'text',value:''},date={name:'date',type:'date',value:'2026-10-30'},check={name:'private',type:'checkbox',checked:false},root={querySelectorAll:()=>[input,date,check,{name:'submit',type:'submit',value:'Save'}]};
 const original=formSnapshot(root);input.value='   ';assert.equal(formSnapshot(root),original);
 input.value='Fictional preparation';assert.notEqual(formSnapshot(root),original);input.value='';assert.equal(formSnapshot(root),original);
 date.value='2026-11-03';assert.notEqual(formSnapshot(root),original);date.value='2026-10-30';check.checked=true;assert.notEqual(formSnapshot(root),original);
 check.checked=false;assert.equal(formSnapshot(root),original);
});
test('editor recovery binds one channel, warns on dirty reload and releases listeners without stealing a newer guard',()=>{
 const listeners=new Map(),win={addEventListener:(n,f)=>listeners.set(n,f),removeEventListener:(n,f)=>{if(listeners.get(n)===f)listeners.delete(n)}},channel={current:null};let dirty=false,requests=0,prevented=0;
 const release=bindUnsavedNavigation(win,channel,()=>dirty,()=>requests++),guard=channel.current;
 listeners.get('beforeunload')({preventDefault:()=>prevented++});assert.equal(prevented,0);
 dirty=true;const e={preventDefault:()=>prevented++};listeners.get('beforeunload')(e);assert.equal(prevented,1);assert.equal(e.returnValue,'');
 assert.equal(guard.blockMiles,true);assert.equal(guard.isDirty(),true);guard.request();assert.equal(requests,1);
 const newer={};channel.current=newer;release();assert.equal(channel.current,newer);assert.equal(listeners.size,0);
});
test('nonmodal insight traversal exits before/after the panel and leaves ordinary Tab traversal untouched',()=>{
 const items=[{id:'close'},{id:'dismiss'},{id:'review'}];
 assert.equal(nonmodalBoundary(items,items[0],true),'before');assert.equal(nonmodalBoundary(items,items[2],false),'after');
 for(const backwards of [true,false])assert.equal(nonmodalBoundary(items,items[1],backwards),null);
 assert.equal(nonmodalBoundary(items,items[0],false),null);assert.equal(nonmodalBoundary(items,items[2],true),null);assert.equal(nonmodalBoundary([],null,false),null);
});
test('Escape prevents native closure exactly once while respecting an inner contextual panel that already consumed it',()=>{
 let dismissed=0,prevented=0,stopped=0;const event={key:'Escape',defaultPrevented:false,preventDefault(){this.defaultPrevented=true;prevented++},stopPropagation(){stopped++}};
 assert.equal(dismissOnEscape(event,()=>dismissed++),true);assert.equal(dismissed,1);assert.equal(prevented,1);assert.equal(stopped,1);
 assert.equal(dismissOnEscape(event,()=>dismissed++),false);assert.equal(dismissed,1);
 assert.equal(dismissOnEscape({...event,key:'Tab',defaultPrevented:false},()=>dismissed++),false);assert.equal(dismissed,1);
});
test('failed onboarding discard retains exact in-memory and stored drafts; explicit retry clears only the isolated key',()=>{
 const data=new Map([['sentinel','unchanged']]);let blocked=true;
 const storage={getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v),removeItem:k=>{if(blocked)throw Error('denied');data.delete(k)}},store=createOnboardingStore(storage),draft={...initialDraft(),name:'Fictional recovery'};
 assert.equal(store.save(draft).persisted,true);const literal=data.get(ONBOARDING_KEY);
 assert.equal(store.clear(),false);assert.deepEqual(store.read(),draft);assert.equal(data.get(ONBOARDING_KEY),literal);
 blocked=false;assert.equal(store.clear(),true);assert.deepEqual(store.read(),initialDraft());assert.equal(data.has(ONBOARDING_KEY),false);assert.equal(data.get('sentinel'),'unchanged');
});
test('denied onboarding save remains visit-only and can be retried without replacing its content',()=>{
 let blocked=true,saved;const storage={getItem:()=>saved,setItem:(k,v)=>{if(blocked)throw Error('denied');saved=v},removeItem(){throw Error('denied')}},store=createOnboardingStore(storage),draft={...initialDraft(),name:'Fictional visit only'};
 assert.equal(store.save(draft).persisted,false);assert.deepEqual(store.read(),draft);assert.equal(store.clear(),false);assert.deepEqual(store.read(),draft);
 blocked=false;assert.equal(store.save(store.read()).persisted,true);assert.deepEqual(createOnboardingStore(storage).read(),draft);
});
test('explicit Light/Dark appearance uses increased-contrast roles rather than overriding them with normal inline colors',async()=>{
 const css=await readFile('src/tokens.css','utf8');
 for(const dark of [false,true]){const ordinary=appearanceTokens(css,dark,false),more=appearanceTokens(css,dark,true);assert.notEqual(more['--text-secondary'],ordinary['--text-secondary']);assert.notEqual(more['--border'],ordinary['--border']);assert.notEqual(more['--focus'],ordinary['--focus']);assert.equal(more['--brand-primary'],ordinary['--brand-primary'])}
 const source=await readFile('card-exploration/LabControls.jsx','utf8');assert.match(source,/appearanceTokens\(tokenCSS,appearance==='dark',contrast.matches\)/);assert.match(source,/contrast.addEventListener\('change',apply\)/);assert.match(source,/contrast.removeEventListener\('change',apply\)/);
});
test('Settings heading levels, quiet route focus and small secondary text preserve semantic and readable presentation',async()=>{
 const main=await readFile('src/main.jsx','utf8'),style=await readFile('src/style.css','utf8'),badges=await readFile('src/badges.css','utf8'),profile=await readFile('src/profile-overview.css','utf8');
 assert.match(main,/<h2 className="miles-mode-title">/);assert.doesNotMatch(main,/<h3>\{t\("¿Cómo quieres que te acompañe Miles/);
 assert.match(style,/#main h1\[tabindex="-1"\]:focus\{outline:none;text-decoration:underline/);assert.match(style,/button:focus-visible, a:focus-visible/);
 assert.match(badges,/\.badge-card p\{font-size:\.8125rem\}/);assert.match(profile,/\.profile-activity-copy small\{[^}]*font-size:\.75rem/);
});
