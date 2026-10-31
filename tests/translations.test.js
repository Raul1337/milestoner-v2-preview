import test from 'node:test';
import assert from 'node:assert/strict';
import {translate,resolveLanguage,enLabels,displayContent} from '../src/translations.js';
import {initial,KEY} from '../src/model.js';

test('language selection uses EN/ES only and does not change the persistence contract',()=>{
 assert.equal(resolveLanguage('?lang=en','es-MX'),'en');
 assert.equal(resolveLanguage('?lang=es','en-US'),'es');
 assert.equal(resolveLanguage('?lang=unknown','en-GB'),'en');
 assert.equal(resolveLanguage('','fr-FR'),'es');
 assert.equal(KEY,'milestoner-vision-v2-demo-v1');
});
test('navigation and section names are consistent while brands stay unchanged',()=>{
 for(const [en,es] of Object.entries({Home:'Inicio',Discover:'Descubrir',Progress:'Progreso',You:'Tú',Today:'Hoy','Your Life':'Tu vida',Overview:'Resumen',Insights:'Perspectivas',Settings:'Ajustes',Schedule:'Agenda'})){
  assert.equal(translate('es',en),es);assert.equal(translate('en',en),en);
 }
 for(const brand of ['Milestoner','Miles','M+ · Miles','Apple Calendar','Google Calendar'])assert.equal(translate('es',brand),brand);
});
test('English covers every built-in project, task, reminder, event and log without mutating fixtures',()=>{
 const state=initial(),before=JSON.stringify(state);
 const strings=[...state.projects.flatMap(p=>[p.title,p.subtitle,...p.tasks.map(t=>t.text)]),...state.logs.map(l=>l.label),...state.reminders.map(r=>r.title),...state.events.map(e=>e.title)];
 for(const text of strings){assert.ok(Object.hasOwn(enLabels,text),text);assert.notEqual(translate('en',text),text)}
 assert.equal(JSON.stringify(state),before);
});
test('dynamic labels translate values, preserve whitespace and leave custom content intact',()=>{
 assert.equal(translate('en','{0} {1}',[translate('en','Completar'),translate('en','Practicar conversación · 15 min')]),'Complete Practice conversation · 15 min');
 assert.equal(translate('en','Restan ${0} MXN de ejemplo.',['500']),'MXN $500 remaining in this example.');
 assert.equal(translate('es',' {0} ',[translate('es','Home')]),' Inicio ');
 assert.equal(translate('en','My custom project 123'),'My custom project 123');
 assert.equal(translate('es',42),42);
});

test('custom content and braces are never treated as UI translation keys',()=>{
 const fixture=initial().projects[1],fixtures=new Map([[fixture.id,fixture]]);
 assert.equal(displayContent('en',fixture,'title',fixtures),'Learn French');
 assert.equal(displayContent('es',{id:'custom',title:'Home'},'title',fixtures),'Home');
 assert.equal(displayContent('en',{...fixture,title:'My {0} plan'},'title',fixtures),'My {0} plan');
 assert.equal(translate('en','My {0} plan'),'My {0} plan');
});
