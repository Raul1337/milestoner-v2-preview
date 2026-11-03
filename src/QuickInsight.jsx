import React,{useEffect,useLayoutEffect,useRef,useState,useId} from 'react';
import {createPortal} from 'react-dom';
import {Bell,X,ArrowRight} from 'lucide-react';
import {useLanguage} from './language';
import {insightPosition,nonmodalBoundary} from './insight-position';
export default function QuickInsight({insight,onReview,onAction,blocked,longContent=false}){
 const {language,t,content}=useLanguage(),en=language==='en',panel=useRef(),trigger=useRef(),focused=useRef(null),id=useId();
 const [shown,setShown]=useState(null),[position,setPosition]=useState(null);
 function restoreFocus(){const candidates=[trigger.current,document.querySelector('.header-miles'),document.querySelector('.desktop-sidebar .miles-nav')];candidates.find(e=>e?.isConnected&&e.getBoundingClientRect().width)?.focus({preventScroll:true})}
 function close(restore=true){setShown(null);setPosition(null);if(restore)requestAnimationFrame(restoreFocus)}
 useEffect(()=>{if(blocked&&shown)close(false)},[blocked]);
 useLayoutEffect(()=>{
  if(!shown)return;
  const update=()=>{const a=trigger.current?.getBoundingClientRect();if(!a?.width||matchMedia('(min-width:901px)').matches){close(false);return}const v=window.visualViewport;setPosition(insightPosition(a,{left:v?.offsetLeft||0,top:v?.offsetTop||0,width:Math.min(v?.width||innerWidth,document.documentElement.clientWidth),height:v?.height||innerHeight}))};
  update();window.addEventListener('resize',update);window.addEventListener('scroll',update,true);window.visualViewport?.addEventListener('resize',update);window.visualViewport?.addEventListener('scroll',update);
  return()=>{window.removeEventListener('resize',update);window.removeEventListener('scroll',update,true);window.visualViewport?.removeEventListener('resize',update);window.visualViewport?.removeEventListener('scroll',update)};
 },[shown]);
 useEffect(()=>{
  if(!shown)return;
  const outside=e=>{if(panel.current?.contains(e.target)||trigger.current?.contains(e.target))return;const hadFocus=panel.current?.contains(document.activeElement);close(false);requestAnimationFrame(()=>{if(hadFocus&&(!document.activeElement||document.activeElement===document.body))restoreFocus()})};
  const key=e=>{if(e.key==='Escape'){e.preventDefault();close()}};
  document.addEventListener('click',outside,true);document.addEventListener('keydown',key);
  return()=>{document.removeEventListener('click',outside,true);document.removeEventListener('keydown',key)};
 },[shown]);
 useEffect(()=>{if(!shown){focused.current=null;return}if(position&&focused.current!==shown){panel.current?.querySelector('button')?.focus({preventScroll:true});focused.current=shown}},[shown,position]);
 const item=shown||insight;
 return <>{item&&!blocked&&<button ref={trigger} className="quick-insight-trigger icon-button" aria-label={en?(shown?'Close Miles suggestion · demo':'Pending Miles suggestion · demo'):(shown?'Cerrar sugerencia de Miles · demo':'Sugerencia pendiente de Miles · demo')} aria-haspopup="dialog" aria-expanded={!!shown} aria-controls={shown?id:undefined} onClick={()=>{if(shown)close();else{setShown(insight)}}}><Bell size={20} aria-hidden="true"/>{insight&&<i aria-hidden="true"/>}</button>}
 {shown&&!blocked&&createPortal(<section ref={panel} id={id} role="dialog" aria-modal="false" aria-labelledby={id+'-title'} className="quick-insight-popover" style={position?{left:position.left,top:position.top,width:position.width,maxHeight:position.maxHeight}:{visibility:'hidden'}} onKeyDown={e=>{if(e.key!=='Tab')return;const edge=nonmodalBoundary([...e.currentTarget.querySelectorAll('button')],document.activeElement,e.shiftKey);if(edge==='before'){e.preventDefault();close()}else if(edge==='after'){e.preventDefault();close(false);document.querySelector('.header-miles')?.focus({preventScroll:true})}}}>
 <header><div><small>Miles · {content(shown.project,'title')}{longContent&&(en?' · Accommodation preparation and comparison of options in Kyoto':' · Preparación de alojamiento y comparación de opciones en Kioto')}</small><h2 id={id+'-title'}>{en?'A next step':'Un próximo paso'}</h2></div><button className="icon-button" aria-label={en?'Close suggestion':'Cerrar sugerencia'} onClick={()=>close()}><X size={20}/></button></header>
 <div className="quick-insight-body"><p>{t(shown.reason)}</p>{longContent&&<p>{en?'You can review the existing preparation, compare options and decide later. This fictional suggestion does not book accommodation, create calendar events or send notifications.':'Puedes revisar el preparativo existente, comparar opciones y decidir después. Esta sugerencia ficticia no reserva alojamiento, no crea eventos de calendario ni envía notificaciones.'}</p>}<small>{en?'Suggestion based on this fictional example.':'Sugerencia basada en este ejemplo ficticio.'}</small></div>
 <footer><button className="text-button" onClick={()=>{onReview(shown);close()}}>{en?'Dismiss':'Descartar'}</button><button className="primary" onClick={()=>{const selected=shown;onReview(selected);close(false);onAction(selected);requestAnimationFrame(()=>document.getElementById('main')?.focus())}}>{t(shown.action)}<ArrowRight size={16}/></button></footer>
 </section>,document.body)}</>;
}
