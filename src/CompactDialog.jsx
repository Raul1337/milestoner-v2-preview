import React,{useEffect,useId,useRef} from 'react';
import {X} from 'lucide-react';
import {useLanguage} from './language';
import {useOverlay} from './OverlayContext';
import {ArrowLeft} from 'lucide-react';
function InlineEditor({title,onClose,children,overlay,backLabel}){
 const {language}=useLanguage(),ref=useRef(),dirty=useRef(false);
 useEffect(()=>{ref.current?.querySelector('input,textarea,select,button')?.focus({preventScroll:true})},[]);
 function cancel(){if(dirty.current)overlay.requestDiscard(onClose,true);else onClose()}
 return <section className="compact-editor" ref={ref} onInputCapture={()=>dirty.current=true} aria-label={title}><div className="compact-editor-heading"><button type="button" className="icon-button" aria-label={backLabel||(language==='en'?'Back to proposal':'Volver a la propuesta')} onClick={cancel}><ArrowLeft size={20}/></button><h2>{title}</h2></div>{React.Children.map(children,child=>React.cloneElement(child,{onClickCapture:e=>{if(e.target.closest('button[type="button"]')){e.preventDefault();e.stopPropagation();cancel()}}}))}</section>;
}
export default function CompactDialog(props){const overlay=useOverlay();return overlay?<InlineEditor {...props} overlay={overlay}/>:<NativeCompactDialog {...props}/>}
function NativeCompactDialog({title,onClose,children}){
 const ref=useRef(),id=useId(),{language}=useLanguage();
 useEffect(()=>{const previous=document.activeElement,el=ref.current;el.showModal();return()=>{el.close();if(previous?.isConnected)previous.focus({preventScroll:true});else document.getElementById('main')?.focus({preventScroll:true})}},[]);
 return <dialog className="compact-dialog" ref={ref} aria-labelledby={id} onCancel={e=>{e.preventDefault();onClose()}} onClick={e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)onClose()}}} onKeyDown={e=>{
  if(e.key!=='Tab')return;
  const items=[...e.currentTarget.querySelectorAll('button,input,textarea,select,a[href]')].filter(x=>!x.disabled&&x.getClientRects().length),first=items[0],last=items.at(-1);
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}
 }}><div className="compact-dialog-heading"><h2 id={id}>{title}</h2><button className="icon-button" aria-label={language==='en'?'Close editor':'Cerrar editor'} onClick={onClose}><X size={20}/></button></div>{children}</dialog>;
}
