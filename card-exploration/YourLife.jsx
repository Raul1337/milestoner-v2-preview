import React,{useId,useState,useEffect} from 'react';
import {ChevronDown,ChevronRight,LockKeyhole,Check,Clock,Plus} from 'lucide-react';
import {useLanguage} from '../src/language';
import {domains,TODAY} from '../src/model';
import {chronologicalReminders} from './life-model';

export function ReminderTimeline({reminders,onOpen}) {
 const {language,t,content,dateLabel}=useLanguage(),en=language==='en',rows=chronologicalReminders(reminders);
 const dateText=date=>!date?(en?'Date not set':'Sin fecha'):date===TODAY?`${t('Today')} · ${dateLabel(date)}`:`${dateLabel(date)}${date.slice(0,4)!==TODAY.slice(0,4)?' · '+date.slice(0,4):''}`;
 return <ul className="life-reminders">{rows.map((r,index)=>{
  const title=r.private?t('Privado'):content(r,'title'),time=r.time||(en?'No time':'Sin hora'),status=en?(r.done?'Done':'Pending'):(r.done?'Completado':'Pendiente'),repeat=r.repeat?t(r.repeat):'';
  return <li key={r.id}>
   {(index===0||rows[index-1].date!==r.date)&&<h3 className="reminder-date-group">{dateText(r.date)}</h3>}
   <button type="button" className="life-reminder-row" aria-haspopup="dialog" aria-label={`${r.private?(en?'Private reminder':'Recordatorio privado'):title} · ${dateText(r.date)} · ${time} · ${status}${repeat?' · '+repeat:''}`} onClick={()=>onOpen(r.id)}>
    <span className="reminder-time"><Clock size={13} aria-hidden="true"/>{time}</span>
    <span className="reminder-row-body"><span className={`reminder-row-title${r.done?' is-done':''}`}>{r.private&&<LockKeyhole size={14} aria-hidden="true"/>}{title}</span><small className="reminder-row-done">{r.done&&<Check size={12} aria-hidden="true"/>}{status}{repeat&&' · '+repeat}</small></span>
    <ChevronRight size={17} aria-hidden="true"/>
   </button>
  </li>;
 })}</ul>;
}

export default function YourLife({projects,reminders,category,setCategory,view,setView,headingRef,renderProject,onReminder,onCreateProject,onCreateReminder}) {
 const {language,t}=useLanguage(),en=language==='en',id=useId();
 const [desktop,setDesktop]=useState(()=>window.matchMedia('(min-width:901px)').matches),[remindersOpen,setRemindersOpen]=useState(true);
 useEffect(()=>{const media=window.matchMedia('(min-width:901px)'),change=()=>setDesktop(media.matches);media.addEventListener('change',change);return()=>media.removeEventListener('change',change)},[]);
 const isProjects=desktop||view.type==='projects';
 const filtered=projects.filter(p=>category==='all'||p.domain===category);
 function selectType(type){setView(v=>({...v,type}))}
 function tabsKey(event,index){
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?1:1-index;
  selectType(next===0?'projects':'reminders');document.getElementById(id+'-tab-'+next)?.focus();
 }
 return <><section className="your-life lab-life refined-life" aria-labelledby={id+'-heading'}>
  <header className="life-section-heading"><div><h2 id={id+'-heading'} ref={headingRef} tabIndex={-1}>{t('Your Life')}</h2>{!view.expanded&&<p className="life-collapsed-summary">{projects.length} {en?'projects':'proyectos'}{!desktop&&` · ${reminders.length} ${en?'reminders':'recordatorios'}`}</p>}</div><button type="button" className="icon-button life-collapse" aria-expanded={view.expanded} aria-controls={id+'-contents'} aria-label={en?(view.expanded?'Collapse Your Life':'Expand Your Life'):(view.expanded?'Contraer Tu vida':'Expandir Tu vida')} onClick={()=>setView(v=>({...v,expanded:!v.expanded}))}><ChevronDown size={22} aria-hidden="true"/></button></header>
  <div id={id+'-contents'} hidden={!view.expanded}>
   <div className="life-controls">
    {!desktop&&<div className="life-type-switch" role="tablist" aria-label={en?'Your Life type':'Tipo de Tu vida'}>{[['projects',en?'Projects':'Proyectos',projects.length],['reminders',en?'Reminders':'Recordatorios',reminders.length]].map(([type,label,count],index)=><button type="button" key={type} role="tab" id={id+'-tab-'+index} aria-selected={view.type===type} aria-controls={id+'-panel'} tabIndex={view.type===type?0:-1} onClick={()=>selectType(type)} onKeyDown={event=>tabsKey(event,index)}>{label}<span>{count}</span></button>)}</div>}
    {isProjects&&<label className="life-category"><span className="sr-only">{en?'Filter projects by category':'Filtrar proyectos por categoría'}</span><select value={category} onChange={event=>setCategory(event.target.value)} aria-label={en?'Filter projects by category':'Filtrar proyectos por categoría'}><option value="all">{en?'All categories':'Todas'}</option>{Object.entries(domains).map(([key,d])=><option key={key} value={key}>{t(d.name)}</option>)}</select></label>}
   </div>
   <div className="life-type-panel" id={id+'-panel'} role={desktop?undefined:'tabpanel'} aria-labelledby={desktop?id+'-heading':id+'-tab-'+(isProjects?0:1)}>
    {isProjects?<>{category!=='all'&&<p className="life-filter-result">{en?`${filtered.length} of ${projects.length} projects`:`${filtered.length} de ${projects.length} proyectos`}</p>}<div className="project-grid card-grid-exploration">{filtered.map(p=>renderProject(p))}{filtered.length===0&&<div className="life-empty"><h3>{en?'Room for your next project':'Espacio para tu próximo proyecto'}</h3><p>{projects.length?(en?'No projects in this category.':'No hay proyectos en esta categoría.'):(en?'Your projects will appear here.':'Tus proyectos aparecerán aquí.')}</p><button className="secondary" onClick={projects.length?()=>setCategory('all'):onCreateProject}>{projects.length?(en?'All categories':'Todas las categorías'):t('Crear con Miles')}</button></div>}</div></>:reminders.length?<ReminderTimeline reminders={reminders} onOpen={onReminder}/>:<div className="life-empty"><h3>{en?'No reminders yet':'Todavía no hay recordatorios'}</h3><p>{en?'A reminder can stay independent of a project.':'Un recordatorio puede ser independiente de un proyecto.'}</p><button className="secondary" onClick={onCreateReminder}>{t('Crear recordatorio')}</button></div>}
   </div>
  </div>
 </section>{desktop&&<section className="desktop-reminders" aria-labelledby={id+'-reminders-heading'}><header className="life-section-heading"><div><h2 id={id+'-reminders-heading'}>{t('Recordatorios')} <span className="count">{reminders.length}</span></h2><p className="life-collapsed-summary">{en?'Your saved reminders, including upcoming dates.':'Tus recordatorios guardados, incluidas próximas fechas.'}</p></div><div className="today-heading-actions"><button className="icon-button" aria-label={t('Crear recordatorio')} onClick={onCreateReminder}><Plus size={20}/></button><button className="icon-button life-collapse" aria-expanded={remindersOpen} aria-controls={id+'-reminders-content'} aria-label={en?(remindersOpen?'Collapse Reminders':'Expand Reminders'):(remindersOpen?'Contraer Recordatorios':'Expandir Recordatorios')} onClick={()=>setRemindersOpen(v=>!v)}><ChevronDown size={22} aria-hidden="true"/></button></div></header><div id={id+'-reminders-content'} hidden={!remindersOpen}>{reminders.length?<ReminderTimeline reminders={reminders} onOpen={onReminder}/>:<div className="desktop-reminders-empty"><p>{en?'No reminders yet. They stay independent of projects.':'Todavía no hay recordatorios. Son independientes de los proyectos.'}</p><button className="text-button" onClick={onCreateReminder}>{t('Crear recordatorio')}</button></div>}</div></section>}</>;
}
