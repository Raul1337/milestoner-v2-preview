import React,{useId,useState,useEffect} from 'react';
import {Plane,BookOpen,Footprints,Wallet,ChevronRight,Sparkles} from 'lucide-react';
import {useLanguage} from '../src/language';
import {domains} from '../src/model';
import {nextProjectTask,projectCardMetric,hasExampleArtwork} from './card-model';

const icons={travel:Plane,learning:BookOpen,fitness:Footprints,finance:Wallet};
function Illustration({domain}) {
 return <svg className="project-illustration" viewBox="0 0 96 56" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
  {domain==='travel' && <><path d="M15 17Q48 25 81 17M20 25H76M29 24L27 49M67 24L69 49M25 37H71M48 25V36"/><path d="M10 49H86" opacity=".35"/><circle cx="76" cy="8" r="5" fill="currentColor" stroke="none" opacity=".22"/></>}
  {domain==='learning' && <><path d="M13 18Q28 13 43 20V47Q28 40 13 45ZM43 20Q58 13 73 18V45Q58 40 43 47"/><path d="M57 6H83V24H73L66 30V24H57Z" fill="currentColor" fillOpacity=".12"/><path d="M63 12H77M63 17H73" opacity=".6"/></>}
  {domain==='fitness' && <><path d="M12 45C18 29 38 51 49 31S69 12 84 14" strokeDasharray="3 5" opacity=".45"/><path d="M26 16L38 21L46 34L61 35Q68 36 68 43H29Q21 42 21 35L24 24Z" fill="currentColor" fillOpacity=".1"/><path d="M29 25L38 27M33 30L42 32"/><circle cx="84" cy="14" r="4" fill="currentColor"/></>}
  {domain==='finance' && <><path d="M15 25H70Q75 25 75 30V46H15ZM15 25V15H67V25"/><path d="M60 33H80V42H60Z" fill="currentColor" fillOpacity=".15"/><circle cx="65" cy="37" r="1"/><circle cx="68" cy="12" r="9" fill="currentColor" fillOpacity=".12"/><path d="M68 7V17M65 9H70M66 15H71" opacity=".6"/></>}
 </svg>;
}
function ProjectMedia({project,scenario}) {
 const [failed,setFailed]=useState(false),Icon=icons[project.domain]||Sparkles;
 useEffect(()=>setFailed(false),[scenario,project.id]);
 const illustrate=hasExampleArtwork(project)&&scenario!=='no-images'&&!failed;
 return <span className={`project-media${illustrate?' has-illustration':''}`} aria-hidden="true">
  {illustrate && scenario==='broken-image' && project.id==='japan' ? <img className="project-illustration" src="data:image/svg+xml,invalid" alt="" onError={()=>setFailed(true)}/> : illustrate && <Illustration domain={project.domain}/>}
  <Icon className="media-category-icon" size={24}/>
 </span>;
}
export default function ResponsiveProjectCard({project,state,title,scenario,style,onOpen}) {
 const {language,t,content,number}=useLanguage(),en=language==='en',id=useId(),task=nextProjectTask(project),metric=projectCardMetric(state,project);
 const metricLabel=metric && (metric.kind==='learning'?(en?'Sessions logged':'Sesiones registradas'):metric.kind==='fitness'?(en?'Best distance':'Mayor distancia'):(en?'Saved':'Ahorrado'));
 const amount=metric && (metric.kind==='finance'?`$${number(metric.value)} / $${number(metric.target)} MXN`:`${number(metric.value)} / ${number(metric.target)} ${t(metric.unit)}`);
 const status=task?content(task,'text'):project.tasks?.length?(en?'No pending tasks':'Sin tareas pendientes'):(en?'Choose your next step':'Define tu próximo paso');
 return <button type="button" className="project-card exploration-card" style={style} onClick={onOpen} aria-labelledby={id+'-title'} aria-describedby={id+'-category '+id+'-status'+(metric?' '+id+'-metric':'')}>
  <span className="exploration-identity"><ProjectMedia project={project} scenario={scenario}/><span className="exploration-category" id={id+'-category'}>{t(domains[project.domain]?.name||'Project')}</span><ChevronRight className="project-affordance" size={18} aria-hidden="true"/></span>
  <h3 id={id+'-title'}>{title}</h3>
  <p className="project-next" id={id+'-status'}><span className="sr-only">{en?'Next step: ':'Siguiente paso: '}</span>{status}</p>
  {metric && <p className="project-specific-metric" id={id+'-metric'}><span>{metricLabel}</span><strong>{amount}</strong></p>}
 </button>;
}
