import test from 'node:test';
import assert from 'node:assert/strict';
import {SIDEBAR_KEY,readSidebarExpanded,saveSidebarExpanded} from '../src/sidebar-preference.js';
import {KEY} from '../src/model.js';
import {translate} from '../src/translations.js';

test('sidebar defaults to collapsed for missing, invalid or unavailable storage',()=>{
 for(const value of [null,'false','invalid','1','{}']){
  globalThis.localStorage={getItem:()=>value};
  assert.equal(readSidebarExpanded(),false);
 }
 globalThis.localStorage={getItem(){throw new Error('blocked')},setItem(){throw new Error('blocked')}};
 assert.equal(readSidebarExpanded(),false);
 assert.equal(saveSidebarExpanded(true),false);
 delete globalThis.localStorage;
 assert.equal(readSidebarExpanded(),false);
});
test('both sidebar preferences round-trip without writing demo data',()=>{
 const values=new Map([[KEY,'existing demo data']]);
 globalThis.localStorage={getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value)};
 for(const expanded of [true,false]){
  assert.equal(saveSidebarExpanded(expanded),true);
  assert.equal(readSidebarExpanded(),expanded);
  assert.equal(values.get(KEY),'existing demo data');
  assert.equal(values.size,2);
 }
 assert.notEqual(SIDEBAR_KEY,KEY);
 delete globalThis.localStorage;
});
test('sidebar controls have complete EN and ES labels',()=>{
 for(const [es,en] of [['Expandir navegación','Expand navigation'],['Contraer navegación','Collapse navigation'],['Navegación de escritorio','Desktop navigation']]){
  assert.equal(translate('es',es),es);
  assert.equal(translate('en',es),en);
 }
});
