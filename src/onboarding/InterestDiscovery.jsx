import React,{useEffect,useState} from 'react';
import {Check,ChevronDown,ChevronUp,Plus,Search,Trash2,X} from 'lucide-react';
import CompactDialog from '../CompactDialog';
import {domainStyle} from '../PlanSummary';
import {interestLabel} from './catalog';
import {CUSTOM_INTEREST_LIMIT,addCustomInterest,draftOptions,removeCustomInterest,toggleSelection} from './model';
import {capsuleView} from './discovery-view';
import {interestIcon} from './interest-icons';

export default function InterestDiscovery({draft,update,language,initialSelected=false}){
 const L=(es,en)=>language==='en'?en:es;
 const [query,setQuery]=useState(''),[selectedOnly,setSelectedOnly]=useState(initialSelected),[expanded,setExpanded]=useState(false);
 const [customOpen,setCustomOpen]=useState(false),[text,setText]=useState(''),[error,setError]=useState(null),[notice,setNotice]=useState('');
 const selected=new Set(draft.selected),view=capsuleView(draftOptions(draft),draft.selected,{query,selectedOnly,expanded});
 useEffect(()=>{if(!customOpen)return;const frame=requestAnimationFrame(()=>document.getElementById('custom-interest')?.focus({preventScroll:true}));return()=>cancelAnimationFrame(frame)},[customOpen]);
 const focus=id=>requestAnimationFrame(()=>{const element=document.getElementById(id);element?.focus({preventScroll:true});element?.scrollIntoView({block:'nearest',behavior:'instant'})});
 function openCustom(){setText('');setError(null);setCustomOpen(true)}
 function add(e){
  e.preventDefault();const result=addCustomInterest(draft,text);
  if(!result.ok){setError(result);return}
  update(result.draft);setQuery('');setCustomOpen(false);
  setNotice(L('Interés añadido al borrador. Puedes añadir otro o revisar los elegidos.','Interest added to this draft. Add another or review your selections.'));
  focus('pick-'+result.id);
 }
 function useExisting(){
  const id=error.existingId;if(!selected.has(id))update(d=>toggleSelection(d,id));
  setQuery('');setSelectedOnly(true);setCustomOpen(false);
  setNotice(L('El interés existente está en tus elegidos.','The existing interest is in your selections.'));focus('pick-'+id);
 }
 function toggle(i){
  update(d=>toggleSelection(d,i.id));
  if(selectedOnly&&selected.has(i.id)){
   const index=view.visible.findIndex(item=>item.id===i.id),next=view.visible[index+1]||view.visible[index-1];
   focus(next?'pick-'+next.id:'discovery-selected');
  }
 }
 function toggleExpanded(){
  const next=!expanded;
  const firstNew=next?capsuleView(draftOptions(draft),draft.selected,{expanded:true}).visible.find(i=>!view.visible.some(current=>current.id===i.id)):null;
  setExpanded(next);focus(firstNew?'pick-'+firstNew.id:'discovery-more');
 }
 function remove(i){
  update(d=>removeCustomInterest(d,i.id));
  setNotice(L('Interés eliminado del borrador. Puedes volver a añadirlo.','Interest removed from this draft. You can add it again.'));focus('discovery-other');
 }
 function capsule(i){
  const Icon=interestIcon(i.id),label=interestLabel(i,language),active=selected.has(i.id);
  return <div key={i.id} className={'discovery-capsule-item'+(active?' is-picked':'')+(i.custom?' is-custom':'')} style={domainStyle(i.tone)}>
   <button id={'pick-'+i.id} className="discovery-capsule" aria-pressed={active} aria-describedby={i.custom?'discovery-custom-note':undefined} onClick={()=>toggle(i)}>
    <Icon size={18} aria-hidden="true"/><span className={'discovery-capsule-label'+(!/\s/.test(label)&&label.length>24?' unbroken-label':'')}><bdi dir="auto">{label}</bdi></span><Check className="discovery-capsule-check" size={16} aria-hidden="true"/>
   </button>
   {i.custom&&<button className="discovery-delete" onClick={()=>remove(i)} aria-label={L('Eliminar interés propio: ','Delete custom interest: ')+label}><Trash2 size={16} aria-hidden="true"/></button>}
  </div>;
 }
 const errorText=error&&({empty:L('Escribe un interés antes de añadirlo.','Enter an interest before adding it.'),length:L(`Usa como máximo ${CUSTOM_INTEREST_LIMIT} caracteres.`,`Use at most ${CUSTOM_INTEREST_LIMIT} characters.`),characters:L('Usa texto visible sin caracteres de control.','Use visible text without control characters.'),duplicate:L('Este interés ya existe, incluso si su nombre está en el otro idioma.','This interest already exists, including its name in the other language.'),identity:L('No se pudo crear la identidad temporal. Inténtalo otra vez.','A temporary identity could not be created. Try again.')}[error.error]);
 return <section className="interest-discovery" aria-label={L('Descubrir y elegir intereses','Discover and select interests')}>
  <p className="onboarding-lead">{L('Elige lo que te gusta o te da curiosidad. En el futuro, tus intereses ayudarán a Miles y Discover a proponerte ideas más afines a ti. Tú decides qué explorar.','Choose what you enjoy or feel curious about. In the future, your interests will help Miles and Discover suggest ideas that suit you. You decide what to explore.')}</p>
  <p className="discovery-honesty">{L('Demo: las ideas de Discover son ficticias y no se personalizan con tu selección. Sin recomendaciones de IA.','Demo: Discover ideas are fictional and are not personalized from your selections. No AI recommendations.')}</p>
  <div className="discovery-search"><Search size={18} aria-hidden="true"/><input id="discovery-search" type="search" autoComplete="off" value={query} onChange={e=>setQuery(e.target.value)} placeholder={L('Buscar entre 35 intereses','Search all 35 interests')} aria-label={L('Buscar intereses','Search interests')}/>{query&&<button onClick={()=>setQuery('')} aria-label={L('Borrar búsqueda','Clear search')}><X size={17} aria-hidden="true"/></button>}</div>
  <div className="discovery-review">
   <div className="discovery-view" role="group" aria-label={L('Vista de intereses','Interest view')}><button aria-pressed={!selectedOnly} onClick={()=>setSelectedOnly(false)}>{L('Explorar','Explore')}</button><button id="discovery-selected" aria-pressed={selectedOnly} onClick={()=>setSelectedOnly(true)}>{L('Elegidos','Selected')} <span>{selected.size}</span></button></div>
   <span role="status" className="discovery-result-count">{view.browsing?L(`${view.catalogVisible} de 35 intereses`,`${view.catalogVisible} of 35 interests`):L(`${view.total} ${view.total===1?'resultado':'resultados'}`,`${view.total} ${view.total===1?'result':'results'}`)}</span>
  </div>
  {notice&&<p role="status" className="discovery-notice">{notice}</p>}
  <div className="discovery-cloud">
   {!view.visible.length&&<div className="discovery-empty"><h2>{selectedOnly&&!query?L('Tu selección empieza aquí.','Your selection starts here.'):L('No encontramos coincidencias.','No matching interests.')}</h2><p>{L('Prueba otra búsqueda o añade tu propio interés. Todo es opcional.','Try another search or add your own interest. Everything is optional.')}</p><button className="text-button" onClick={()=>{setQuery('');setSelectedOnly(false)}}>{L('Volver a explorar','Back to exploring')}</button></div>}
   <div id="discovery-capsules" className="discovery-capsules" role="group" aria-label={L('Intereses seleccionables','Selectable interests')}>
    {view.visible.map(capsule)}
    <button id="discovery-other" className="discovery-other" onClick={openCustom}><Plus size={18} aria-hidden="true"/>{L('Otro interés','Other interest')}</button>
   </div>
   {view.browsing&&<div className="discovery-cloud-footer"><button id="discovery-more" className="text-button" aria-expanded={expanded} aria-controls="discovery-capsules" onClick={toggleExpanded}>{expanded?L('Ver menos intereses','See fewer interests'):L('Ver más intereses','See more interests')}{expanded?<ChevronUp size={16} aria-hidden="true"/>:<ChevronDown size={16} aria-hidden="true"/>}</button></div>}
  </div>
  <span id="discovery-custom-note" className="sr-only">{L('Interés propio. El botón de eliminar está a continuación.','Custom interest. The delete button follows.')}</span>
  <p className="onboarding-demo-note">{L('Sin mínimo. Puedes cambiar de idea. Todos parten de «Me da curiosidad», sin inferir tus preferencias.','No minimum. Change your mind any time. All start as “Curious”, without inferring your preferences.')}</p>
  {customOpen&&<CompactDialog title={L('Añadir otro interés','Add your own interest')} onClose={()=>setCustomOpen(false)}><form className="discovery-custom-form" onSubmit={add} noValidate><label htmlFor="custom-interest">{L('¿Qué te gustaría explorar?','What would you like to explore?')}</label><input id="custom-interest" autoComplete="off" value={text} onChange={e=>{setText(e.target.value);setError(null)}} aria-invalid={!!error} aria-describedby={'custom-interest-note'+(error?' custom-interest-error':'')} dir="auto"/><div className="discovery-character-count" aria-live="off">{[...text.trim()].length}/{CUSTOM_INTEREST_LIMIT}</div><p id="custom-interest-note">{L('Máximo 60 caracteres Unicode. Usa ejemplos ficticios. Conservamos tu texto, sin traducirlo ni asignarle una categoría. Afinidad inicial: Me da curiosidad.','Up to 60 Unicode characters. Use fictional examples. Your text stays as written, without translation or an assigned category. Starting affinity: Curious.')}</p>{error&&<div id="custom-interest-error" role="alert"><p>{errorText}</p>{error.existingId&&<button type="button" className="text-button" onClick={useExisting}>{selected.has(error.existingId)?L('Ver interés elegido','View selected interest'):L('Elegir interés existente','Select existing interest')}</button>}</div>}<div className="compact-dialog-actions"><button className="secondary" type="button" onClick={()=>setCustomOpen(false)}>{L('Cancelar','Cancel')}</button><button className="primary" type="submit"><Plus size={17} aria-hidden="true"/>{L('Añadir y elegir','Add and select')}</button></div></form></CompactDialog>}
 </section>;
}
