import React,{useCallback,useEffect,useId,useRef,useState} from 'react';
import {X,Maximize2,Minimize2} from 'lucide-react';
import {createPortal} from 'react-dom';
import {stableOverlayHeight} from './overlay-geometry';
import {MPlus} from './Navigation';
import {useLanguage} from './language';
import {OverlayContext} from './OverlayContext';
export default function MilesOverlay({onClose,guard,children,returnFocus}){
 const {language}=useLanguage(),L=(es,en)=>language==='en'?en:es;
 // The isolated Theme Playground keeps its accepted content-driven geometry.
 const stableGeometry=import.meta.env.BASE_URL==='/milestoner-v2-preview/';
 const [expanded,setExpanded]=useState(false),expandedRef=useRef(false),resizeRef=useRef();
 const ref=useRef(),id=useId(),dirty=useRef(false),confirmAction=useRef(),returnTo=useRef(),[confirm,setConfirm]=useState(false),[footer,setFooter]=useState(null);
 const requestDiscard=useCallback((action,force=false)=>{if(dirty.current||force){returnTo.current=document.activeElement;confirmAction.current=action;setConfirm(true)}else action()},[]);
 useEffect(()=>{guard.current=action=>requestDiscard(action);return()=>{guard.current=action=>action()}},[guard,requestDiscard]);
 useEffect(()=>{
  const el=ref.current,previous=returnFocus?.current||document.activeElement,signature={entry:previous?.dataset?.milesEntry,label:previous?.getAttribute('aria-label'),text:previous?.textContent,href:previous?.getAttribute('href')};
  const scroll={x:scrollX,y:scrollY},body=document.body,old={position:body.style.position,top:body.style.top,left:body.style.left,width:body.style.width,overflow:body.style.overflow},restoration=history.scrollRestoration;
  history.scrollRestoration='manual';Object.assign(body.style,{position:'fixed',top:-scroll.y+'px',left:-scroll.x+'px',width:'100%',overflow:'hidden'});el.showModal();el.querySelector('.miles-close')?.focus({preventScroll:true});
  const viewport=()=>{const v=window.visualViewport;if(stableGeometry){const safeTop=parseFloat(getComputedStyle(el).getPropertyValue('--miles-safe-top'))||0;el.style.setProperty('--miles-stable-height',stableOverlayHeight(v?.height||innerHeight,{mobile:matchMedia('(max-width:600px)').matches,expanded:expandedRef.current,safeTop})+'px');el.style.setProperty('--miles-visual-top',(v?.offsetTop||0)+'px')}el.style.setProperty('--miles-vh',(v?.height||innerHeight)+'px');el.style.setProperty('--miles-keyboard-offset',Math.max(0,innerHeight-(v?.height||innerHeight)-(v?.offsetTop||0))+'px');const focus=document.activeElement;if(el.contains(focus)&&/INPUT|TEXTAREA|SELECT/.test(focus.tagName))requestAnimationFrame(()=>focus.scrollIntoView({block:'nearest'}))};
  resizeRef.current=viewport;viewport();window.visualViewport?.addEventListener('resize',viewport);window.visualViewport?.addEventListener('scroll',viewport);window.addEventListener('resize',viewport);
  const unload=e=>{if(dirty.current){e.preventDefault();e.returnValue=''}};window.addEventListener('beforeunload',unload);
  return()=>{el.close();Object.assign(body.style,old);history.scrollRestoration=restoration;window.scrollTo(scroll.x,scroll.y);window.visualViewport?.removeEventListener('resize',viewport);window.visualViewport?.removeEventListener('scroll',viewport);window.removeEventListener('resize',viewport);window.removeEventListener('beforeunload',unload);
   const fallback=[...document.querySelectorAll('button,a')].find(e=>signature.entry?e.dataset.milesEntry===signature.entry:signature.href?e.getAttribute('href')===signature.href:signature.label?e.getAttribute('aria-label')===signature.label:e.textContent===signature.text);
   (previous?.isConnected&&previous!==document.body&&previous!==document.documentElement?previous:fallback||document.getElementById('main'))?.focus({preventScroll:true});
  }
 },[]);
 function toggleExpansion(){expandedRef.current=!expandedRef.current;setExpanded(expandedRef.current);resizeRef.current?.()}
 function keep(){setConfirm(false);requestAnimationFrame(()=>returnTo.current?.isConnected&&returnTo.current.focus({preventScroll:true}))}
 const discardActions=<div className="compact-dialog-actions"><button className="primary" onClick={keep}>{L('Seguir editando','Keep editing')}</button><button className="text-button" onClick={()=>{setConfirm(false);const action=confirmAction.current;confirmAction.current=null;action?.()}}>{L('Descartar cambios','Discard changes')}</button></div>;
 return <dialog className="miles-overlay" ref={ref} id={id+'-surface'} data-geometry={stableGeometry?'stable':undefined} data-expanded={stableGeometry?expanded:undefined} aria-labelledby={id} onCancel={e=>{e.preventDefault();if(confirm)keep();else requestDiscard(onClose)}} onClick={e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom){if(confirm)keep();else requestDiscard(onClose)}}}} onKeyDown={e=>{
  if(e.key!=='Tab')return;const nodes=[...e.currentTarget.querySelectorAll('button,a[href],input,textarea,select,summary,[tabindex="0"]')].filter(n=>!n.disabled&&n.getClientRects().length&&!n.closest('[hidden]')),first=nodes[0],last=nodes.at(-1);
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}
 }} onInputCapture={()=>dirty.current=true}>
  <header className="miles-overlay-heading"><span className="overlay-brand"><MPlus/><span id={id}>Miles<small>{L('Demo con guiones · no es IA','Scripted demo · not AI')}</small></span></span>{stableGeometry&&<button className="icon-button miles-expand" aria-controls={id+'-surface'} aria-expanded={expanded} aria-label={expanded?L('Restaurar altura del 78%','Restore 78% height'):L('Expandir Miles','Expand Miles')} title={expanded?L('Restaurar altura del 78%','Restore 78% height'):L('Expandir Miles','Expand Miles')} onClick={toggleExpansion}>{expanded?<Minimize2 size={19}/>:<Maximize2 size={19}/>}</button>}<button className="icon-button miles-close" aria-label={L('Cerrar Miles','Close Miles')} onClick={()=>confirm?keep():requestDiscard(onClose)}><X size={20}/></button></header>
  <OverlayContext.Provider value={{inline:true,footer,stableGeometry,suspended:stableGeometry&&confirm,requestDiscard,onDirty:value=>{dirty.current=value}}}>
   <div hidden={confirm} className="miles-overlay-content"><div className="miles-overlay-scroll">{children}</div>{!stableGeometry&&<div className="miles-overlay-footer" ref={setFooter}/>}</div>
   {confirm&&<section className="miles-discard" aria-labelledby={id+'-discard'}><h2 id={id+'-discard'} tabIndex={-1} ref={el=>el?.focus()}>{L('¿Descartar los cambios sin guardar?','Discard unsaved changes?')}</h2><p>{L('Nada de este borrador se ha guardado. Puedes seguir editándolo.','Nothing in this draft has been saved. You can keep editing it.')}</p>{stableGeometry&&footer?createPortal(discardActions,footer):discardActions}</section>}
   {stableGeometry&&<div className="miles-overlay-footer" ref={setFooter}/>}
  </OverlayContext.Provider>
 </dialog>;
}
