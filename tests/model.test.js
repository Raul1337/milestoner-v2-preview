import test from 'node:test';
import assert from 'node:assert/strict';
import {initial,total,filterLogs,readDemo,saveDemo,KEY} from '../src/model.js';
test('Finance filters change the actual totals, not just the label',()=>{
 const s=initial();const sum=p=>filterLogs(s,'save',p).reduce((a,r)=>a+r.value,0);
 assert.equal(sum('week'),1500);assert.equal(sum('month'),4500);assert.equal(sum('year'),10500);
});
test('Overall counts records without combining incompatible units',()=>{
 assert.equal(filterLogs(initial(),'all','month').length,8);
 assert.equal(new Set(filterLogs(initial(),'all','month').map(x=>x.project)).size,4);
});
test('Fitness uses greatest distance, finance sums contributions',()=>{
 const s=initial();assert.equal(total(s,s.projects.find(p=>p.id==='run')),3.2);
 assert.equal(total(s,s.projects.find(p=>p.id==='save')),10500);
});
test('Future data and private reminders never leak into reports',()=>{
 const s=initial();s.logs.push({project:'save',date:'2027-01-01',value:9000});
 s.reminders.push({id:'private',private:true,done:true,date:'2026-10-30'});
 assert.equal(filterLogs(s,'all','year').length,10);
 assert.ok(filterLogs(s,'all','year').every(r=>s.projects.some(p=>p.id===r.project)));
});
test('A new project has zero progress and empty period history',()=>{
 const s=initial(),p={id:'new',domain:'learning'};assert.equal(total(s,p),0);assert.deepEqual(filterLogs(s,'new','year'),[]);
});
test('Demo persists only in its own key and recovers invalid JSON',()=>{
 const map=new Map();globalThis.localStorage={getItem:k=>map.get(k),setItem:(k,v)=>map.set(k,v)};
 const s=initial();s.mode='On Demand';assert.equal(saveDemo(s),true);assert.equal(readDemo().mode,'On Demand');
 assert.deepEqual([...map.keys()],[KEY]);map.set(KEY,'bad json');assert.equal(readDemo().projects.length,4);
});
test('Unavailable storage falls back to an in-memory demo',()=>{
 globalThis.localStorage={getItem(){throw Error('disabled')},setItem(){throw Error('disabled')}};
 assert.equal(readDemo().projects.length,4);assert.equal(saveDemo(initial()),false);
});
