import React,{useRef,useEffect} from 'react';
import {ArrowLeft,ArrowUpRight} from 'lucide-react';
import {useLanguage} from './language';
import {uid} from './model';
import PlanSummary,{domainStyle} from './PlanSummary';
import {planDraft,planPatch} from './draft-actions';
export default function PlanDetail({p,onPatch,onToggle,onMiles,logs}){
 const {language}=useLanguage(),L=(es,en)=>language==='en'?en:es,heading=useRef();
 useEffect(()=>{heading.current?.focus({preventScroll:true})},[p.id]);
 return <div className="compact-plan-detail" style={domainStyle(p.domain)}><button className="text-button" onClick={()=>location.hash='home'}><ArrowLeft size={15}/>{L('Volver a Tu vida','Back to Your Life')}</button><div className="plan-detail-top"><div><span className="summary-status">{L('PROYECTO CONFIRMADO · DEMO','CONFIRMED PROJECT · DEMO')}</span><h1 ref={heading} tabIndex={-1}>{p.title}</h1></div><button className="secondary" onClick={onMiles}>{L('Continuar con Miles','Continue with Miles')}<ArrowUpRight size={16}/></button></div><section className="panel summary-card confirmed-plan"><PlanSummary value={planDraft(p)} confirmed onChange={d=>onPatch(planPatch(p,d,uid))} onToggle={i=>onToggle(p.tasks[i])}/></section><p className="plan-record-note">{L('Registros de esta demo: ','Entries in this demo: ')}<strong>{logs.length}</strong>{L(' · Completar una actividad no inventa progreso.',' · Completing an activity does not invent progress.')}</p></div>;
}
