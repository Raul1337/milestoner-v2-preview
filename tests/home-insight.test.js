import test from 'node:test';
import assert from 'node:assert/strict';
import {initial} from '../src/model.js';
import {selectHomeInsight} from '../src/home-insight.js';
import {translate} from '../src/translations.js';

test('On Demand is silent even with actionable confirmed examples', () => {
 const state=initial();state.mode='On Demand';assert.equal(selectHomeInsight(state),null);
});
test('Balanced explains the next preparation only after confirmed prerequisites', () => {
 const state=initial(),insight=selectHomeInsight(state);
 assert.equal(insight.id,'japan-accommodation');assert.equal(insight.project.id,'japan');
 for(const id of ['jp1','jp2']) {const s=initial();s.projects[0].tasks.find(t=>t.id===id).done=false;assert.equal(selectHomeInsight(s),null);}
 state.projects[0].tasks.find(t=>t.id==='jp3').done=true;assert.equal(selectHomeInsight(state),null);
});
test('Proactive has a broader evidence-backed opportunity and still returns only one', () => {
 const state=initial();state.mode='Proactive';assert.equal(selectHomeInsight(state).id,'japan-accommodation');
 const next=selectHomeInsight(state,['japan-accommodation']);assert.equal(next.id,'french-practice');assert.equal(next.project.id,'french');
 assert.equal(selectHomeInsight(state,['japan-accommodation','french-practice']),null);
 state.projects[1].tasks[0].done=true;assert.equal(selectHomeInsight(state,['japan-accommodation']),null);
});
test('no generic fallback or inference from drafts, calendar ideas or private reminders', () => {
 const state=initial();state.mode='Proactive';state.projects=[];
 state.draft={scenario:'japan'};state.calendarIdeas=['Practice French'];
 assert.equal(selectHomeInsight(state),null);
 const empty=initial();empty.mode='Proactive';empty.projects[0].tasks=[];empty.logs=[];
 assert.equal(selectHomeInsight(empty),null);
});
test('modified or unrelated records never get the scripted example explanation', () => {
 for(const change of [p=>p.title='Custom trip',p=>p.domain='finance',p=>p.vision={kind:'project'},p=>p.tasks[2].text='Custom next step']) {
  const state=initial();change(state.projects[0]);assert.equal(selectHomeInsight(state),null);
 }
 const state=initial();state.mode='Proactive';state.logs.forEach(l=>l.label='Custom entry');
 assert.equal(selectHomeInsight(state,['japan-accommodation']),null);
});
test('selection and dismissal do not mutate records or persistence shape', () => {
 const state=initial(),before=JSON.stringify(state),dismissed=['japan-accommodation'];
 assert.equal(selectHomeInsight(state,dismissed),null);
 assert.equal(JSON.stringify(state),before);assert.deepEqual(dismissed,['japan-accommodation']);
});
test('insight labels, explanations and mode descriptions have English and Spanish copy', () => {
 const state=initial();state.mode='Proactive';
 const insights=[selectHomeInsight(state),selectHomeInsight(state,['japan-accommodation'])];
 for(const text of ['Miles Insight','Ocultar sugerencia de Miles','Solo sugerencias puntuales con contexto confirmado.','Más oportunidades relevantes, una sugerencia a la vez.',...insights.flatMap(i=>[i.reason,i.action])]) {
  assert.notEqual(translate('en',text),translate('es',text),text);
 }
});
