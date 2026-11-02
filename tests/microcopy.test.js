import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {build} from 'esbuild';
import {formatDateLabel} from '../src/date-presentation.js';
import {initialDraft} from '../src/onboarding/model.js';

// Render the real components without mounting a browser or running effects. The
// isolated entry's DOM mount is removed in memory only; production code is unchanged.
const bundled=await build({stdin:{resolveDir:process.cwd(),loader:'jsx',contents:`
 import React from 'react';
 import {renderToStaticMarkup} from 'react-dom/server';
 import {LanguageProvider} from './src/language.jsx';
 import {DemoProfileProvider} from './src/DemoProfile.jsx';
 import {Onboarding} from './src/onboarding/main.jsx';
 import Discover from './src/Discover.jsx';
 import YouExperience from './src/YouExperience.jsx';
 import ProjectDetails from './src/ProjectDetails.jsx';
 import PlanSummary from './src/PlanSummary.jsx';
 import MilesCreation from './src/MilesCreation.jsx';
 import FirstMilestone from './src/onboarding/FirstMilestone.jsx';
 import {initial} from './src/model.js';
 import {proposal} from './src/creation-model.js';
 export function render(screen,language,draft){
  const keys=['location','sessionStorage','localStorage','matchMedia'],descriptors=keys.map(k=>Object.getOwnPropertyDescriptor(globalThis,k));
  const state=initial(),before=JSON.stringify(state),noop=()=>{};
  Object.defineProperty(globalThis,'matchMedia',{configurable:true,value:()=>({matches:false})});
  Object.defineProperty(globalThis,'location',{configurable:true,value:{search:'?lang='+language,hash:'#'+draft.step}});
  Object.defineProperty(globalThis,'sessionStorage',{configurable:true,value:{getItem:()=>JSON.stringify(draft),setItem(){throw Error('SSR must not write storage')}}});
  Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem:()=>null,setItem(){throw Error('SSR must not write storage')}}});
  try{
   const content=screen==='onboarding'?<Onboarding/>:screen==='discover'?<Discover projects={state.projects} onExplore={noop} onProject={noop}/>:screen==='universe'||screen==='interest'||screen==='suggestion'?<DemoProfileProvider><YouExperience route={screen==='universe'?'you':screen==='interest'?'you/interest/photography':'you/interest/suggest-astronomy'} appState={state} navigationGuard={{current:null}} onOpenProject={noop}/></DemoProfileProvider>:screen==='project'?<ProjectDetails p={state.projects[0]} state={state}/>:screen==='plan'?<PlanSummary value={{...proposal('french',language==='en'),date:'2027-04-10',milestone:'B1'}} onChange={noop}/>:screen==='first-review'?<FirstMilestone draft={draft} step="review" language={language}/>:<MilesCreation projects={state.projects}/>;
   const html=renderToStaticMarkup(<LanguageProvider>{content}</LanguageProvider>);
   if(JSON.stringify(state)!==before)throw Error('Rendering changed demo records');
   return html;
  }finally{keys.forEach((k,i)=>{if(descriptors[i])Object.defineProperty(globalThis,k,descriptors[i]);else delete globalThis[k]})}
 }
`},bundle:true,platform:'node',format:'cjs',packages:'external',write:false,define:{'import.meta.env.BASE_URL':JSON.stringify('/milestoner-v2-preview/')},plugins:[{name:'review-render-only',setup(b){
 b.onResolve({filter:/\.css(?:\?raw)?$/},()=>({path:'empty-style',namespace:'review-style'}));
 b.onLoad({filter:/.*/,namespace:'review-style'},()=>({contents:'export default "";',loader:'js'}));
 b.onLoad({filter:/src\/onboarding\/main\.jsx$/},async args=>{const source=await readFile(args.path,'utf8'),mount=/^createRoot\(document.getElementById\('root'\)\)\.render\(.*\);$/m;assert.match(source,mount);return{contents:source.replace(mount,'export {Onboarding};'),loader:'jsx'}});
}}]});
const mod={exports:{}};new Function('require','module','exports',bundled.outputFiles[0].text)(createRequire(import.meta.url),mod,mod.exports);
const render=(screen,language='es',draft=initialDraft())=>mod.exports.render(screen,language,draft);

test('welcome keeps brand, Miles, local-first action and isolated-prototype disclosure without repeated introductions',()=>{
 for(const language of ['es','en']){const html=render('onboarding',language);
  assert.match(html,language==='es'?/Haz espacio para lo que importa\./:/Make room for what matters\./);
  assert.match(html,language==='es'?/Con Miles, paso a paso\./:/With Miles, one step at a time\./);
  assert.match(html,language==='es'?/Empezar sin cuenta/:/Start without an account/);
  assert.match(html,language==='es'?/Prototipo aislado, sin IA ni servicios conectados/:/Isolated prototype, without AI or connected services/);
  assert.match(html,language==='es'?/Borrador temporal/:/Temporary draft/);
  assert.doesNotMatch(html,/Un espacio para lo que te mueve|A space for what moves you|Miles es una guía visual|Miles is a visual guide/);
 }
});
test('optional name keeps its instruction association, field limits and neutral unnamed Universe',()=>{
 for(const language of ['es','en']){const html=render('onboarding',language,{...initialDraft(),step:'information'}),input=html.match(/<input[^>]+name="preferredName"[^>]*>/)?.[0];
  assert.ok(input);assert.match(input,/maxLength="50"/);assert.match(input,/aria-describedby="onboarding-name-note"/);assert.doesNotMatch(input,/required/);
  assert.match(html,language==='es'?/Nombre preferido \(opcional\)/:/Preferred name \(optional\)/);
  assert.match(html,language==='es'?/Si lo omites, verás «Tú»/:/Leave it blank to see “You”/);
  assert.doesNotMatch(html,/Sin cuestionarios largos|No long questionnaires|Un nombre basta|A name is enough/);
  const universe=render('onboarding',language,{...initialDraft(),step:'universe'});assert.match(universe,language==='es'?/Editar nombre opcional/:/Edit optional name/);assert.match(universe,language==='es'?/>Tú<|>Tú ·/:/>You<|>You ·/);
 }
});
test('interest selection states planned benefit and current limits while keeping unselected capsules and an optional path',()=>{
 for(const language of ['es','en']){const html=render('onboarding',language,{...initialDraft(),step:'interests'});
  assert.match(html,language==='es'?/¿Qué te interesa\?/:/What interests you\?/);
  assert.match(html,language==='es'?/En el futuro, tus intereses ayudarán a Miles y Discover/:/In the future, your interests will help Miles and Discover/);
  assert.match(html,language==='es'?/sin personalización ni IA/:/without personalization or AI/);
  const capsules=html.match(/<button[^>]+id="pick-[^>]+>/g)||[];assert.equal(capsules.length,15);for(const capsule of capsules)assert.match(capsule,/aria-pressed="false"/);
  assert.match(html,language==='es'?/Continuar sin intereses/:/Continue without interests/);assert.match(html,/id="discovery-custom-note"/);
  assert.doesNotMatch(html,/Todos parten de|All start as|Descubre ideas hechas para ti|Discover ideas that feel like you/);
 }
});
test('Discover presents example ideas as editable proposals without suggesting a bookmark feature or personalization',()=>{
 for(const language of ['es','en']){const html=render('discover',language);
  assert.match(html,language==='es'?/Encuentra una idea y dale forma con Miles\./:/Find an idea and shape it with Miles\./);
  assert.match(html,language==='es'?/sin personalización ni IA/:/no personalization or AI/);
  assert.doesNotMatch(html,/guardarlo después|save it later|bookmark/i);assert.equal((html.match(/class="discovery-card"/g)||[]).length,8);
  assert.match(html,language==='es'?/nada se crea sin tu confirmación/:/nothing is created without your confirmation/);
  assert.match(html,language==='es'?/aria-label="Explorar con Miles:/:/aria-label="Explore with Miles:/);
 }
});
test('Universe edit and decline controls are explicit while the canonical Not really affinity stays unchanged',()=>{
 for(const language of ['es','en']){const html=render('universe',language),detail=render('interest',language),suggestion=render('suggestion',language);
  assert.match(html,language==='es'?/>Editar intereses</:/>Edit interests</);assert.match(html,/href="#you\/edit"/);
  assert.equal((html.match(/class="profile-node"/g)||[]).length,1);assert.equal((html.match(/class="interest-node /g)||[]).length,8);
  assert.equal((html.match(language==='es'?/>Descartar sugerencia</g:/>Dismiss suggestion</g)||[]).length,2);
  assert.match(detail,language==='es'?/value="not-really">No mucho<|value="not-really"[^>]*>No mucho</:/value="not-really">Not really<|value="not-really"[^>]*>Not really</);
  assert.match(suggestion,language==='es'?/>Descartar sugerencia</:/>Dismiss suggestion</);assert.match(suggestion,/value="not-really"/);
  assert.doesNotMatch(html+suggestion,/propuesta sintética|synthetic proposal|Ejemplos sintéticos|Synthetic examples/);
 }
});
test('dates add the recorded year only on explicit request and retain the original default formatting',()=>{
 for(const locale of ['es-MX','en-US'])for(const iso of ['2026-10-30','2027-04-10','2027-04-14']){
  const original=new Date(iso+'T12:00:00').toLocaleDateString(locale,{day:'numeric',month:'short'});
  assert.equal(formatDateLabel(iso,locale),original);assert.match(formatDateLabel(iso,locale,true),new RegExp(iso.slice(0,4)));
 }
});
test('project and proposal dates expose their real 2027 year without changing task, event or progress semantics',()=>{
 for(const language of ['es','en']){const html=render('project',language),plan=render('plan',language);
  assert.match(html,language==='es'?/Inicio del viaje: [^<]*2027/:/Travel starts: [^<]*2027/);
  assert.match(html,/Higashiyama/);assert.match(html,language==='es'?/Completar una actividad no añade registros de progreso/:/Completing an activity does not add progress records/);
  assert.match(plan,/2027/);assert.match(plan,language==='es'?/Actividades sugeridas/:/Suggested activities/);
  assert.match(plan,language==='es'?/Opcional · sólo descriptivo/:/Optional · descriptive only/);
  assert.match(plan,language==='es'?/Sin programar/:/Not scheduled/);assert.match(plan,language==='es'?/No crea eventos ni inscripciones/:/Does not create events or enrollment/);
 }
});
test('M+ and first-example review retain action-specific honesty and explicit confirmation boundaries',()=>{
 const d={...initialDraft(),step:'review'};d.firstMilestone={...d.firstMilestone,title:'Ejemplo ficticio',category:'learning'};
 for(const language of ['es','en']){const miles=render('miles',language),review=render('first-review',language,d);
  assert.match(miles,language==='es'?/Sin IA ni acciones externas/:/No AI or external actions/);
  assert.match(miles,language==='es'?/Nada se guarda sin confirmar/:/Nothing is saved until you confirm/);
  assert.match(review,language==='es'?/No se añadirá a tus proyectos ni a la app nativa/:/It is not added to your projects or the native app/);
  assert.match(review,language==='es'?/>Confirmar ejemplo</:/>Confirm example</);
 }
});
