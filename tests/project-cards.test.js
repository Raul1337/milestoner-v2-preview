import test from 'node:test';
import assert from 'node:assert/strict';
import {initial} from '../src/model.js';
import {projectCardMetric,nextProjectTask,hasExampleArtwork} from '../card-exploration/card-model.js';
test('cards show project-specific session/distance/savings data and no travel or overall percentage',()=>{
 const s=initial();assert.equal(projectCardMetric(s,s.projects[0]),null);
 assert.deepEqual(s.projects.slice(1).map(p=>projectCardMetric(s,p).value),[3,3.2,10500]);
 for(const p of s.projects)assert.equal(projectCardMetric(s,p)?.percentage,undefined);
});
test('unconfirmed/new projects and unsupported units or targets have no inferred metric',()=>{
 const s=initial(),p=s.projects[1];
 for(const patch of [{vision:{version:1}},{id:'new-project'},{unit:'pages'},{target:0}])assert.equal(projectCardMetric(s,{...p,...patch}),null);
});
test('future, unrelated and invalid entries never appear in card metrics',()=>{
 const s=initial(),p=s.projects[1];s.logs.push({project:p.id,date:'2027-01-01',value:99},{project:'other',date:'2026-10-30',value:99},{project:p.id,date:'2026-10-30',value:NaN});
 assert.equal(projectCardMetric(s,p).value,3);s.logs=[];assert.equal(projectCardMetric(s,p),null);
});
test('next action is an existing pending task; all-reviewed does not mean project completion',()=>{
 const s=initial(),before=JSON.stringify(s),p=s.projects[0];assert.equal(nextProjectTask(p).id,'jp3');
 assert.equal(nextProjectTask({...p,tasks:p.tasks.map(t=>({...t,done:true}))}),null);
 assert.equal(nextProjectTask({...p,tasks:[]}),null);projectCardMetric(s,s.projects[2]);assert.equal(JSON.stringify(s),before);
});
test('example artwork is optional and never follows unrelated or renamed records',()=>{
 const p=initial().projects[0];assert.equal(hasExampleArtwork(p),true);assert.equal(hasExampleArtwork({...p,title:'Custom project'}),false);assert.equal(hasExampleArtwork({...p,id:'reminder'}),false);
});
