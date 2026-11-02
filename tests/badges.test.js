import test from 'node:test';
import assert from 'node:assert/strict';
import {BADGE_CATALOG,BADGE_VIEWS,badgeCatalog,badgeView,badgeText} from '../src/badges-model.js';
import {initial} from '../src/model.js';

test('the bilingual badge catalog is immutable illustration data, without award rules or earned history',()=>{
 assert.equal(BADGE_CATALOG.length,8);assert.equal(new Set(BADGE_CATALOG.map(b=>b.id)).size,8);
 const fields=['description','descriptionEn','icon','id','name','nameEn','tone'];
 for(const badge of BADGE_CATALOG){
  assert.deepEqual(Object.keys(badge).sort(),fields);
  for(const field of fields)assert.ok(typeof badge[field]==='string'&&badge[field].length>0);
  assert.ok(Object.isFrozen(badge));
  assert.equal(badgeText(badge,'name','en'),badge.nameEn);assert.equal(badgeText(badge,'description','en'),badge.descriptionEn);
  assert.equal(badgeText(badge,'name','es'),badge.name);assert.equal(badgeText(badge,'description','es'),badge.description);
 }
 assert.ok(Object.isFrozen(BADGE_CATALOG));
 assert.throws(()=>BADGE_CATALOG.push({}));assert.throws(()=>{BADGE_CATALOG[0].earned=true});
});
test('catalog examples never become featured or earned from task completion or recorded progress',()=>{
 const state=initial(),before=JSON.stringify(state);
 const catalog=badgeCatalog('all');assert.equal(badgeCatalog('featured').length,0);
 state.projects.forEach(p=>p.tasks.forEach(t=>t.done=true));state.logs.push({id:'extra',project:'run',date:'2026-10-30',value:50});
 assert.equal(badgeCatalog('all'),catalog);assert.deepEqual(badgeCatalog('featured'),[]);
 assert.notEqual(JSON.stringify(state),before);
 assert.deepEqual(BADGE_VIEWS,['all','featured']);assert.equal(badgeView('milestones'),'all');
 assert.equal(badgeView('earned'),'all');assert.equal(badgeView(undefined),'all');
});
