import React,{useState} from 'react';
import {ArrowLeft,ArrowRight,CheckCheck,FilePenLine,LockKeyhole,Pencil,Plane,BookOpen,Footprints,Wallet} from 'lucide-react';
import {MPlus} from '../Navigation';
import {domainStyle} from '../PlanSummary';
import {EXAMPLE_CATEGORIES,beginManualExample,editFirstMilestone,exampleIssues,visibleExampleText,confirmFirstMilestone,postponeFirstMilestone} from './first-milestone';
const icons={travel:Plane,learning:BookOpen,fitness:Footprints,finance:Wallet};
export function FirstExampleSummary({first,language,compact=false}){
 const L=(es,en)=>language==='en'?en:es,value=first.confirmed||first,category=EXAMPLE_CATEGORIES.find(c=>c.id===value.category),Icon=icons[value.category]||FilePenLine;
 return <article className={'first-example-summary'+(compact?' is-compact':'')} style={domainStyle(value.category||'brand')} aria-label={L('Resumen del ejemplo temporal','Temporary example summary')}>
  <div className="first-example-identity"><span><Icon size={22} aria-hidden="true"/></span><div><small>{first.confirmed?L('Confirmado en esta sesión','Confirmed in this session'):L('Borrador · por confirmar','Draft · awaiting confirmation')}</small><h2><bdi dir="auto">{value.title}</bdi></h2></div></div>
  {category&&<span className="first-example-category">{category[language]}</span>}
  {!compact&&value.note.trim()&&<p className="first-example-note"><bdi dir="auto">{value.note}</bdi></p>}
  {!compact&&<p className="first-example-boundary">{L('Ejemplo de intención · sin seguimiento, fechas ni progreso configurados.','An intention example · tracking, dates and progress are not configured.')}</p>}
 </article>;
}
export default function FirstMilestone({draft,step,language,update,go,onContinueLocally}){
 const L=(es,en)=>language==='en'?en:es,first=draft.firstMilestone,[errors,setErrors]=useState({});
 function edit(patch){update(d=>editFirstMilestone(d,patch));setErrors({})}
 function manual(e){e?.preventDefault();if(e&&!visibleExampleText(first.idea)){setErrors({idea:true});requestAnimationFrame(()=>document.getElementById('first-idea')?.focus());return}update(beginManualExample);setErrors({});requestAnimationFrame(()=>document.getElementById('first-title')?.focus())}
 function backToIdea(){edit({mode:'idea'});requestAnimationFrame(()=>document.getElementById('first-idea')?.focus())}
 function review(e){e.preventDefault();const issues=exampleIssues(first);if(issues.title||issues.category){setErrors(issues);requestAnimationFrame(()=>document.getElementById(issues.title?'first-title':'first-category')?.focus());return}go('review')}
 function confirm(){const value=update(confirmFirstMilestone);if(value.firstMilestone.confirmed)go('account')}
 function postpone(){update(postponeFirstMilestone);go('finished')}
 if(step==='account')return <div className="first-account">
  <div className="first-confirmed-note" role="status"><CheckCheck size={20} aria-hidden="true"/><span>{L('Tu ejemplo está confirmado en esta sesión.','Your example is confirmed in this session.')}</span></div>
  <p className="onboarding-lead">{L('Ya tienes un punto de partida. Más adelante podrás elegir una identidad de cuenta para Milestoner. Hoy puedes seguir sin registrarte.','You have a starting point. Later, you can choose an account identity for Milestoner. Today, you can carry on without registering.')}</p>
  <FirstExampleSummary first={first} language={language} compact/>
  <div className="first-account-local"><LockKeyhole size={22} aria-hidden="true"/><div><h2>{L('Tu espacio puede seguir siendo local.','Your space can stay local.')}</h2><p>{L('Conectar una identidad no asociaría automáticamente tus datos locales ni los respaldaría, restauraría, combinaría o sincronizaría.','Connecting an identity would not automatically associate, back up, restore, merge or synchronize your local data.')}</p></div></div>
  <details className="first-account-information"><summary>{L('¿Qué significaría conectar una cuenta?','What would connecting an account mean?')}</summary><p>{L('Apple y Google son los proveedores previstos. La conexión identificaría tu cuenta; asociar datos locales requeriría un paso explícito independiente.','Apple and Google are the planned providers. Connecting would identify your account; associating local data would require a separate explicit step.')}</p><p>{L('Esta candidata no inicia sesión ni conecta proveedores. La simulación de cuenta, sus cancelaciones y conflictos se revisarán en V2.5C.3. No se ofrece respaldo ni sincronización cloud.','This candidate does not sign in or connect providers. Account simulation, cancellations and conflicts will be reviewed in V2.5C.3. Cloud backup and synchronization are not offered.')}</p></details>
  <footer className="onboarding-actions"><button className="text-button" onClick={()=>go('review')}><ArrowLeft size={17}/>{L('Revisar ejemplo','Review example')}</button><button className="primary" onClick={onContinueLocally}>{L('Continuar localmente','Continue locally')}<ArrowRight size={18}/></button></footer>
 </div>;
 if(step==='review'||first.confirmed)return <div className="first-review">
  <p className="onboarding-lead">{first.confirmed?L('Esta confirmación temporal se conserva. Volver o recargar no crea otro ejemplo.','This temporary confirmation is retained. Going back or reloading does not create another example.'):L('Revisa tus palabras. Sólo se confirmará este ejemplo cuando tú lo decidas.','Review your own words. This example is only confirmed when you decide.')}</p>
  <FirstExampleSummary first={first} language={language}/>
  <p className="first-review-disclosure">{L('Al confirmar, el ejemplo permanecerá sólo en esta pestaña. No se añadirá a tus proyectos ni a la app nativa.','Once confirmed, the example stays in this tab only. It is not added to your projects or the native app.')}</p>
  {!first.confirmed&&<div className="first-review-edit"><button className="text-button" onClick={()=>go('milestone','first-title')}><Pencil size={16}/>{L('Editar detalles','Edit details')}</button><button className="text-button" onClick={()=>go('milestone')}>{L('Cancelar revisión','Cancel review')}</button></div>}
  <footer className="onboarding-actions"><button className="text-button" onClick={()=>go(first.confirmed?'universe':'milestone')}><ArrowLeft size={17}/>{L('Atrás','Back')}</button><button className="primary" onClick={first.confirmed?()=>go('account'):confirm}>{first.confirmed?L('Continuar','Continue'):L('Confirmar ejemplo','Confirm example')}<ArrowRight size={18}/></button></footer>
 </div>;
 return <div className="first-milestone-composition">
  <div className="onboarding-guide first-guide"><MPlus/><div><strong>{L('Una idea tuya. Un primer paso.','Your idea. A first step.')}</strong><p>{L('Tú pones la intención. Le damos un espacio para revisarla.','You bring the intention. We give it a space for review.')}</p></div></div>
  <p className="first-scope-note">{L('Esta demo te permite preparar una intención. Sólo vive en esta revisión, sin IA ni seguimiento real. Usa un ejemplo ficticio.','This demo lets you prepare an intention. It stays in this review, without AI or real tracking. Use a fictional example.')}</p>
  {first.mode==='idea'?<form id="first-idea-form" className="first-composer" onSubmit={manual} noValidate>
   <label htmlFor="first-idea">{L('¿Qué te gustaría lograr, probar o aprender?','What would you like to accomplish, try or learn?')}</label>
   <textarea id="first-idea" value={first.idea} maxLength={240} onChange={e=>edit({idea:e.target.value})} rows={3} placeholder={L('Una idea, con tus propias palabras…','An idea, in your own words…')} aria-invalid={!!errors.idea} aria-describedby={errors.idea?'first-idea-error':'first-idea-note'} dir="auto"/>
   {errors.idea&&<p id="first-idea-error" role="alert">{L('Escribe una idea o usa la alternativa manual.','Write an idea or use the manual alternative.')}</p>}
   <p id="first-idea-note">{L('Conservaremos tus palabras. No se deduce una meta de tus intereses.','We keep your words. No milestone is derived from your interests.')}</p>
   <div className="first-composer-actions"><button type="button" className="text-button" onClick={()=>manual()}><FilePenLine size={16}/>{L('Prefiero crear manualmente','I prefer to create manually')}</button><button type="submit" className="primary">{L('Dar forma a mi idea','Shape my idea')}<ArrowRight size={18}/></button></div>
  </form>:<form id="first-manual-form" className="first-manual-form" onSubmit={review} noValidate>
   <label htmlFor="first-title">{L('Nombre de tu primera meta','Your first milestone name')}</label><textarea required id="first-title" value={first.title} rows={2} maxLength={240} onChange={e=>edit({title:e.target.value})} aria-invalid={!!errors.title} aria-describedby={errors.title?'first-title-error':undefined} dir="auto"/>
   {errors.title&&<p id="first-title-error" role="alert">{L('Escribe un nombre para revisar el ejemplo.','Enter a name to review the example.')}</p>}
   <label htmlFor="first-category">{L('Categoría','Category')}</label><select required id="first-category" value={first.category} onChange={e=>edit({category:e.target.value})} aria-invalid={!!errors.category} aria-describedby={errors.category?'first-category-error':'first-category-note'}><option value="">{L('Elige una categoría','Choose a category')}</option>{EXAMPLE_CATEGORIES.map(c=><option key={c.id} value={c.id}>{c[language]}</option>)}</select>
   {errors.category&&<p id="first-category-error" role="alert">{L('Elige la categoría. No la inferimos de tu texto.','Choose the category. We do not infer it from your text.')}</p>}<p id="first-category-note">{L('Elige entre las cuatro categorías disponibles en esta demo.','Choose from the four categories available in this demo.')}</p>
   <label htmlFor="first-note">{L('Nota (opcional)','Note (optional)')}</label><textarea id="first-note" value={first.note} maxLength={280} rows={2} onChange={e=>edit({note:e.target.value})} dir="auto"/>
   <div className="first-composer-actions"><button type="button" className="text-button" onClick={backToIdea}><ArrowLeft size={16}/>{L('Volver a mi idea','Back to my idea')}</button><button className="primary" type="submit">{L('Revisar ejemplo','Review example')}<ArrowRight size={18}/></button></div>
  </form>}
  <footer className="onboarding-actions"><button className="text-button" onClick={()=>go('universe')}><ArrowLeft size={17}/>{L('Volver al Universo','Back to Universe')}</button><button className="text-button" onClick={postpone}>{L('Dejarlo para después','Leave it for later')}</button></footer>
  <p className="onboarding-demo-note">{L('Todavía no has confirmado nada. Puedes posponerlo y conservar lo escrito.','Nothing is confirmed yet. You can postpone this and keep what you wrote.')}</p>
 </div>;
}
