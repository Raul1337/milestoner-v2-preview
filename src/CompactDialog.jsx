import React,{useEffect,useLayoutEffect,useId,useRef,useState} from 'react';
import {X} from 'lucide-react';
import {useLanguage} from './language';
import {useOverlay} from './OverlayContext';
import {ArrowLeft} from 'lucide-react';
import {formSnapshot,bindUnsavedNavigation,dismissOnEscape} from './unsaved-changes';
function InlineEditor({title,onClose,children,overlay,backLabel}){
 const {language}=useLanguage(),ref=useRef(),dirty=useRef(false);
 useEffect(()=>{ref.current?.querySelector('input,textarea,select,button')?.focus({preventScroll:true})},[]);
 function cancel(){if(dirty.current)overlay.requestDiscard(onClose,true);else onClose()}
 return <section className="compact-editor" ref={ref} onInputCapture={()=>dirty.current=true} aria-label={title}><div className="compact-editor-heading"><button type="button" className="icon-button" aria-label={backLabel||(language==='en'?'Back to proposal':'Volver a la propuesta')} onClick={cancel}><ArrowLeft size={20}/></button><h2>{title}</h2></div>{React.Children.map(children,child=>React.cloneElement(child,{onClickCapture:e=>{if(e.target.closest('button[type="button"]')){e.preventDefault();e.stopPropagation();cancel()}}}))}</section>;
}
export default function CompactDialog(props){const overlay=useOverlay();return overlay?<InlineEditor {...props} overlay={overlay}/>:<NativeCompactDialog {...props}/>}
function NativeCompactDialog({title,onClose,children,protectChanges=false,navigationGuard,className='compact-dialog',closeLabel}){
 const ref=useRef(),id=useId(),{language}=useLanguage(),L=(es,en)=>language==='en'?en:es;
 const baseline=useRef(null),pending=useRef(),returnTo=useRef(),actions=useRef(),[discard,setDiscard]=useState(false);
 useLayoutEffect(()=>{if(protectChanges&&baseline.current===null&&ref.current?.querySelector('input,textarea,select'))baseline.current=formSnapshot(ref.current)},[children,protectChanges]);
 function isDirty(){return protectChanges&&!!ref.current&&baseline.current!==null&&formSnapshot(ref.current)!==baseline.current}
 function request(action=onClose){if(isDirty()){pending.current=action;returnTo.current=document.activeElement;setDiscard(true)}else action()}
 actions.current={isDirty,request};
 useEffect(()=>{if(!protectChanges)return;return bindUnsavedNavigation(window,navigationGuard,()=>actions.current.isDirty(),action=>actions.current.request(()=>{onClose();action()}),onClose)},[protectChanges,navigationGuard]);
 useEffect(()=>{if(discard)ref.current?.querySelector('.dialog-recovery button')?.focus({preventScroll:true})},[discard]);
 function keep(){pending.current=null;setDiscard(false);requestAnimationFrame(()=>returnTo.current?.isConnected&&returnTo.current.focus({preventScroll:true}))}
 function dismiss(){if(discard)keep();else request()}
 useEffect(()=>{const previous=document.activeElement,el=ref.current;el.showModal();return()=>{el.close();if(previous?.isConnected)previous.focus({preventScroll:true});else document.getElementById('main')?.focus({preventScroll:true})}},[]);
 return <dialog className={className} ref={ref} aria-labelledby={discard?id+'-discard':id} onCancel={e=>{e.preventDefault();dismiss()}} onClick={e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dismiss()}}} onKeyDown={e=>{
  if(e.defaultPrevented)return;
  if(dismissOnEscape(e,dismiss))return;
  if(e.key!=='Tab')return;
  const items=[...e.currentTarget.querySelectorAll('button,input,textarea,select,a[href],summary,[tabindex="0"]')].filter(x=>!x.disabled&&x.getClientRects().length),first=items[0],last=items.at(-1);
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}
 }}><div className={className?'compact-dialog-heading':'modal-heading'}><h2 id={id}>{title}</h2><button className="icon-button" aria-label={closeLabel||L('Cerrar editor','Close editor')} onClick={dismiss}><X size={20}/></button></div><div hidden={discard}>{children}</div>{discard&&<section className="dialog-recovery" aria-labelledby={id+'-discard'}><h3 id={id+'-discard'}>{L('¿Descartar los cambios sin guardar?','Discard unsaved changes?')}</h3><p>{L('Tu borrador sigue aquí. Los datos guardados no cambiarán si lo descartas.','Your draft is still here. Discarding it will not change saved data.')}</p><div className="compact-dialog-actions"><button className="primary" onClick={keep}>{L('Seguir editando','Keep editing')}</button><button className="text-button" onClick={()=>{const action=pending.current;pending.current=null;action?.()}}>{L('Descartar cambios','Discard changes')}</button></div></section>}</dialog>;
}
