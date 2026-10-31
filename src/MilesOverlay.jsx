import React,{useCallback,useEffect,useId,useRef,useState} from 'react';
import {X} from 'lucide-react';
import {MPlus} from './Navigation';
import {useLanguage} from './language';
import {OverlayContext} from './OverlayContext';
export default function MilesOverlay({onClose,guard,children}){
 const {language}=useLanguage(),L=(es,en)=>language==='en'?en:es;
 const ref=useRef(),id=useId(),dirty=useRef(false),confirmAction=useRef(),returnTo=useRef(),[confirm,setConfirm]=useState(false),[footer,setFooter]=useState(null);
 const requestDiscard=useCallback((action,force=false)=>{if(dirty.current||force){returnTo.current=document.activeElement;confirmAction.current=action;setConfirm(true)}else action()},[]);
 useEffect(()=>{guard.current=action=>requestDiscard(action);return()=>{guard.current=action=>action()}},[guard,requestDiscard]);
 useEffect(()=>{
  const el=ref.current,previous=document.activeElement,signature={entry:previous?.dataset?.milesEntry,label:previous?.getAttribute('aria-label'),text:previous?.textContent,href:previous?.getAttribute('href')};
  const scroll={x:scrollX,y:scrollY},body=document.body,old={position:body.style.position,top:body.style.top,left:body.style.left,width:body.style.width,overflow:body.style.overflow},restoration=history.scrollRestoration;
  history.scrollRestoration='manual';Object.assign(body.style,{position:'fixed',top:-scroll.y+'px',left:-scroll.x+'px',width:'100%',overflow:'hidden'});el.showModal();el.querySelector('.miles-close')?.focus({preventScroll:true});
  const viewport=()=>{const v=window.visualViewport;el.style.setProperty('--miles-vh',(v?.height||innerHeight)+'px');el.style.setProperty('--miles-keyboard-offset',Math.max(0,innerHeight-(v?.height||innerHeight)-(v?.offsetTop||0))+'px');const focus=document.activeElement;if(el.contains(focus)&&/INPUT|TEXTAREA|SELECT/.test(focus.tagName))requestAnimationFrame(()=>focus.scrollIntoView({block:'nearest'}))};
  viewport();window.visualViewport?.addEventListener('resize',viewport);window.visualViewport?.addEventListener('scroll',viewport);window.addEventListener('resize',viewport);
  const unload=e=>{if(dirty.current){e.preventDefault();e.returnValue=''}};window.addEventListener('beforeunload',unload);
  return()=>{el.close();Object.assign(body.style,old);history.scrollRestoration=restoration;window.scrollTo(scroll.x,scroll.y);window.visualViewport?.removeEventListener('resize',viewport);window.visualViewport?.removeEventListener('scroll',viewport);window.removeEventListener('resize',viewport);window.removeEventListener('beforeunload',unload);
   const fallback=[...document.querySelectorAll('button,a')].find(e=>signature.entry?e.dataset.milesEntry===signature.entry:signature.href?e.getAttribute('href')===signature.href:signature.label?e.getAttribute('aria-label')===signature.label:e.textContent===signature.text);
   (previous?.isConnected&&previous!==document.body&&previous!==document.documentElement?previous:fallback||document.getElementById('main'))?.focus({preventScroll:true});
  }
 },[]);
 function keep(){setConfirm(false);requestAnimationFrame(()=>returnTo.current?.isConnected&&returnTo.current.focus({preventScroll:true}))}
 return <dialog className="miles-overlay" ref={ref} aria-labelledby={id} onCancel={e=>{e.preventDefault();if(confirm)keep();else requestDiscard(onClose)}} onClick={e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom){if(confirm)keep();else requestDiscard(onClose)}}}} onKeyDown={e=>{
  if(e.key!=='Tab')return;const nodes=[...e.currentTarget.querySelectorAll('button,a[href],input,textarea,select,summary,[tabindex="0"]')].filter(n=>!n.disabled&&n.getClientRects().length&&!n.closest('[hidden]')),first=nodes[0],last=nodes.at(-1);
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}
 }} onInputCapture={()=>dirty.current=true}>
  <header className="miles-overlay-heading"><span className="overlay-brand"><MPlus/><span id={id}>Miles<small>{L('Demo con guiones · no es IA','Scripted demo · not AI')}</small></span></span><button className="icon-button miles-close" aria-label={L('Cerrar Miles','Close Miles')} onClick={()=>confirm?keep():requestDiscard(onClose)}><X size={20}/></button></header>
  <div hidden={confirm} className="miles-overlay-content"><OverlayContext.Provider value={{inline:true,footer,requestDiscard,onDirty:value=>{dirty.current=value}}}><div className="miles-overlay-scroll">{children}</div><div className="miles-overlay-footer" ref={setFooter}/></OverlayContext.Provider></div>
  {confirm&&<section className="miles-discard" aria-labelledby={id+'-discard'}><h2 id={id+'-discard'} tabIndex={-1} ref={el=>el?.focus()}>{L('¿Descartar los cambios sin guardar?','Discard unsaved changes?')}</h2><p>{L('Nada de este borrador se ha guardado. Puedes seguir editándolo.','Nothing in this draft has been saved. You can keep editing it.')}</p><div className="compact-dialog-actions"><button className="primary" onClick={keep}>{L('Seguir editando','Keep editing')}</button><button className="text-button" onClick={()=>{setConfirm(false);const action=confirmAction.current;confirmAction.current=null;action?.()}}>{L('Descartar cambios','Discard changes')}</button></div></section>}
 </dialog>;
}
