import test from 'node:test';
import assert from 'node:assert/strict';
import {addActivity,editActivity,removeActivity,planDraft,planPatch} from '../src/draft-actions.js';
import {proposal,confirmedProject,todayTasks,confirmedReminder} from '../src/creation-model.js';
import {TODAY,initial,KEY,saveDemo,readDemo} from '../src/model.js';
const create=d=>confirmedProject(d,'plan',d.tasks.map((_,i)=>'task-'+i));
test('compact edits preserve unrelated draft sections and do not mutate the original',()=>{
 const d={...proposal('japan',true),budget:'Demo budget',calendar:'Explore options',itinerary:'Tokyo',preferences:'Relaxed'};
 const before=structuredClone(d),edited=editActivity(d,1,'Compare trains',TODAY);
 assert.deepEqual(d,before);assert.equal(edited.tasks[0],d.tasks[0]);assert.equal(edited.taskDates[1],TODAY);
 for(const k of ['budget','calendar','itinerary','preferences','title'])assert.equal(edited[k],d[k]);
});
test('add, schedule, remove and edit keep dates associated with their activity',()=>{
 let d=proposal('japan',true);d=editActivity(d,0,d.tasks[0],'2026-11-02');d=addActivity(d,'Compare trains',TODAY);
 d=removeActivity(d,1);assert.deepEqual(d.taskDates,['2026-11-02',TODAY]);
 d=editActivity(d,1,'Compare rail routes',TODAY);const p=create(d);
 assert.deepEqual(p.tasks.map(t=>[t.text,t.date]),[['Check passport validity','2026-11-02'],['Compare rail routes',TODAY]]);
 assert.deepEqual(todayTasks([p]).map(x=>x.t.text),['Compare rail routes']);
});
test('clearing an optional activity date removes it from Today without changing project date',()=>{
 let d={...proposal('french',true),date:'2026-12-01'};d=editActivity(d,0,d.tasks[0],TODAY);
 assert.equal(todayTasks([create(d)]).length,1);d=editActivity(d,0,d.tasks[0],'');
 assert.equal(todayTasks([create(d)]).length,0);assert.equal(create(d).date,'2026-12-01');
});
test('blank activities cannot shift dates or identities during confirmation',()=>{
 const d={...proposal('japan',true),tasks:['','Keep this'],taskDates:['2026-11-01',TODAY]};
 assert.deepEqual(create(d).tasks,[{id:'task-1',text:'Keep this',date:TODAY,done:false}]);
});
test('revisiting compact editors preserves saved task identity, status and extra data',()=>{
 const p=create(proposal('japan',true));p.tasks[1]={...p.tasks[1],done:true,extra:'preserved'};
 let d=planDraft(p);d=removeActivity(d,0);d=editActivity(d,0,'Changed route',TODAY);d=addActivity(d,'New step','');
 const patch=planPatch(p,d,()=> 'new-id');
 assert.deepEqual(patch.tasks,[{id:'task-1',text:'Changed route',date:TODAY,done:true,extra:'preserved'},{id:'new-id',text:'New step',date:'',done:false}]);
 assert.equal(p.tasks.length,2);assert.equal(p.tasks[1].text,'Compare possible routes');
});
test('skipping clarification leaves unknowns concise and creates no schedule',()=>{
 for(const kind of ['japan','french']){const d=proposal(kind,true),p=create(d);assert.equal(d.date,'');assert.equal(d.budget,'');assert.equal(d.preferences,'');assert.equal(todayTasks([p]).length,0);assert.equal(p.target,0)}
});
test('editing or cancelling drafts never writes storage; only explicit saving persists',()=>{
 let writes=0,raw=null;globalThis.localStorage={setItem:(key,value)=>{assert.equal(key,KEY);writes++;raw=value},getItem:()=>raw};
 try{let d=proposal('japan',true);d=addActivity(d,'Discard this',TODAY);d=removeActivity(d,0);assert.equal(writes,0);
 const state=initial();saveDemo({...state,projects:[...state.projects,create(d)]});assert.equal(writes,1);assert.equal(readDemo().projects.at(-1).tasks.at(-1).text,'Discard this');}finally{delete globalThis.localStorage}
});
test('B1 is descriptive metadata and calendar ideas never become tasks or events',()=>{
 const state=initial(),d={...proposal('french',true),milestone:'B1',calendar:'Explore a weekly class'};
 const p=create(d);assert.equal(p.target,0);assert.equal(p.vision.milestone,'B1');assert.equal(p.tasks.length,2);assert.equal(todayTasks([p]).length,0);
 let raw;globalThis.localStorage={setItem:(_,v)=>raw=v,getItem:()=>raw};
 try{saveDemo({...state,projects:[...state.projects,p]});const restored=readDemo();assert.deepEqual(restored.events,state.events);assert.deepEqual(restored.reminders,state.reminders);assert.equal(restored.projects.at(-1).vision.calendar,d.calendar);}finally{delete globalThis.localStorage}
});
test('confirmed compact details round-trip without changing legacy records or the storage version',()=>{
 const state=initial(),p=create(proposal('japan',true)),d=planDraft(p);d.title='Synthetic compact plan';d.preferences='Slow pace';
 const updated={...p,...planPatch(p,d,()=> 'new-id')};let raw;globalThis.localStorage={setItem:(_,v)=>raw=v,getItem:()=>raw};
 try{saveDemo({...state,projects:[...state.projects,updated]});const restored=readDemo();assert.deepEqual(restored.projects.slice(0,4),state.projects);assert.deepEqual(restored.projects.at(-1),updated);assert.equal(restored.version,1);}finally{delete globalThis.localStorage}
});
test('minimal dentist confirmation preserves a missing time and remains a standalone reminder',()=>{
 const r=confirmedReminder({title:' Call the dentist ',date:'2026-10-31',time:''},'r');
 assert.equal(r.title,'Call the dentist');assert.equal(r.time,'');assert.equal(r.project,undefined);assert.equal(r.done,false);
});
