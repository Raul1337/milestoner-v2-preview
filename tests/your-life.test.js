import test from 'node:test';
import assert from 'node:assert/strict';
import {initial,TODAY,saveDemo,readDemo} from '../src/model.js';
import {chronologicalReminders} from '../card-exploration/life-model.js';
test('reminder timeline orders dates then known times chronologically',()=>{
 const rows=[{id:'future',date:'2026-11-01',time:'08:00'},{id:'later',date:'2026-10-30',time:'21:00'},{id:'earlier',date:'2026-10-30',time:'18:00'},{id:'past',date:'2026-10-29',time:'22:00'}];
 assert.deepEqual(chronologicalReminders(rows).map(r=>r.id),['past','earlier','later','future']);
});
test('missing hours stay missing and follow timed reminders on the same date',()=>{
 const rows=[{id:'unknown',date:'2026-10-30',time:''},{id:'midnight',date:'2026-10-30',time:'00:00'},{id:'evening',date:'2026-10-30',time:'21:00'}];
 assert.deepEqual(chronologicalReminders(rows).map(r=>r.id),['midnight','evening','unknown']);assert.equal(rows[0].time,'');
});
test('ties and undated entries retain stable order without fabricated dates',()=>{
 const rows=[{id:'u1'},{id:'b',date:'2026-10-30'},{id:'a',date:'2026-10-30'},{id:'u2',date:'',time:''}];
 assert.deepEqual(chronologicalReminders(rows).map(r=>r.id),['b','a','u1','u2']);assert.equal(rows[0].date,undefined);
});
test('sorting keeps original reminder entities and leaves projects, privacy and storage shape untouched',()=>{
 const state=initial(),before=JSON.stringify(state),rows=chronologicalReminders(state.reminders);
 assert.equal(rows[0].id,'ticket');assert.equal(rows[1].id,'med');assert.equal(rows[1],state.reminders[0]);assert.equal(rows[1].private,true);assert.equal(JSON.stringify(state),before);assert.equal(state.projects.length,4);
});

test('Today and the reminder collection share saved identities, edits and completion without expanding recurrence',()=>{
 const state=initial();state.reminders.push({id:'future',title:'Fictional future reminder',date:'2026-11-10',time:'',repeat:'Una vez',private:false,done:false});
 const count=state.reminders.length,privateId=state.reminders[0].id;
 state.reminders=state.reminders.map(r=>r.id===privateId?{...r,done:true}:r);
 const today=state.reminders.filter(r=>r.date===TODAY),collection=chronologicalReminders(state.reminders);
 assert.equal(today.find(r=>r.id===privateId),collection.find(r=>r.id===privateId));
 assert.equal(today.find(r=>r.id===privateId).done,true);assert.equal(collection.find(r=>r.id===privateId).repeat,'Diario');
 assert.equal(today.some(r=>r.id==='future'),false);assert.equal(collection.find(r=>r.id==='future').time,'');
 state.reminders=state.reminders.map(r=>r.id==='future'?{...r,date:TODAY}:r);
 assert.equal(state.reminders.filter(r=>r.date===TODAY).length,today.length+1);
 let saved;globalThis.localStorage={setItem:(k,v)=>saved=v,getItem:()=>saved};try{saveDemo(state);const restored=readDemo();assert.equal(restored.reminders.length,count);assert.equal(new Set(restored.reminders.map(r=>r.id)).size,count);assert.equal(restored.reminders.find(r=>r.id===privateId).repeat,'Diario');assert.equal(restored.reminders.find(r=>r.id===privateId).private,true)}finally{delete globalThis.localStorage}
});
