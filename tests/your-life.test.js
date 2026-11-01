import test from 'node:test';
import assert from 'node:assert/strict';
import {initial} from '../src/model.js';
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
