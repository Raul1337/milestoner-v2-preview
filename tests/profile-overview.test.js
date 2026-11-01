import test from 'node:test';
import assert from 'node:assert/strict';
import {initial,TODAY,readDemo,saveDemo} from '../src/model.js';
import {profileActivity,DEMO_PROFILE} from '../src/profile-overview-model.js';
import {backgroundRoute} from '../src/miles-navigation.js';

test('Profile shows at most three original eligible records with original project identities and dates',()=>{
 const s=initial(),before=JSON.stringify(s),rows=profileActivity(s);
 assert.deepEqual(rows.map(r=>r.entry.id),['l10','l5','l2']);
 assert.deepEqual(rows.map(r=>r.entry.date),['2026-10-29','2026-10-28','2026-10-27']);
 for(const row of rows){assert.equal(row.entry,s.logs.find(r=>r.id===row.entry.id));assert.equal(row.project,s.projects.find(p=>p.id===row.entry.project));assert.equal(backgroundRoute('project/'+row.project.id),'project/'+row.project.id)}
 assert.equal(JSON.stringify(s),before);
 assert.deepEqual(Object.keys(DEMO_PROFILE).sort(),['handle','name']);
});
test('Profile preserves Progress privacy, date and eligibility filters instead of treating tasks or events as achievements',()=>{
 const s=initial(),expected=profileActivity(s).map(r=>r.entry.id);
 s.projects.push({id:'private-plan',private:true,tasks:[]});
 for(const [id,project,date,value,extra] of [['private-entry','save',TODAY,10,{private:true}],['private-plan-entry','private-plan',TODAY,10,{}],['orphan','absent',TODAY,10,{}],['reminder','med',TODAY,10,{}],['future','save','2027-01-01',10,{}],['bad-date','save','2026-02-30',10,{}],['zero','save',TODAY,0,{}],['invalid','save',TODAY,NaN,{}],['outside-period','save','2025-01-01',10,{}]])s.logs.push({id,project,date,value,label:id,...extra});
 s.projects[0].tasks.forEach(t=>t.done=true);s.events.push({id:'another-event',project:'save',date:TODAY});
 assert.deepEqual(profileActivity(s).map(r=>r.entry.id),expected);
 assert.deepEqual(profileActivity({...s,logs:[]}),[]);
});
test('saved Miles and long-content records remain readable Profile activity without rewriting persistence or creating profile metrics',()=>{
 const s=initial(),id='bcd123',project={id,title:'A long fictional project '.repeat(10),domain:'learning',unit:'generic',tasks:[],vision:{kind:'project'}};
 s.projects.push(project);s.logs.push({id:'latest-saved',project:id,date:TODAY,value:1,label:'A long fictional entry '.repeat(10)});
 const before=JSON.stringify(s),row=profileActivity(s)[0];assert.equal(row.entry.id,'latest-saved');assert.equal(row.project,project);assert.equal(row.entry.label,s.logs.at(-1).label);assert.equal(JSON.stringify(s),before);
 let saved;globalThis.localStorage={getItem:()=>saved,setItem:(k,v)=>saved=v};
 try{assert.equal(saveDemo(s),true);const restored=readDemo();assert.deepEqual(profileActivity(restored)[0],row);assert.equal(saved,before);assert.equal(restored.version,1)}finally{delete globalThis.localStorage}
});
