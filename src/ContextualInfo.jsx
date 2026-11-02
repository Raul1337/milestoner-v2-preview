import React,{useEffect,useId,useRef,useState} from 'react';
import {Info,X} from 'lucide-react';
import {useLanguage} from './language';
import {observeInfoPopover} from './contextual-info';
import './contextual-info.css';

export default function ContextualInfo({title,children}){
 const {language}=useLanguage(),en=language==='en',id=useId(),trigger=useRef(),panel=useRef();
 const [open,setOpen]=useState(false),[supported,setSupported]=useState(true);
 const label=(en?'Information: ':'Información: ')+title;
 useEffect(()=>{
  if(typeof panel.current?.showPopover!=='function'){setSupported(false);return}
  return observeInfoPopover(panel.current,trigger.current,window,setOpen);
 },[]);
 // Older engines retain readable, keyboard-operable inline disclosure content.
 if(!supported)return <details className="contextual-info-fallback" name="milestoner-contextual-info"><summary aria-label={label}><Info size={19} aria-hidden="true"/></summary><div><strong>{title}</strong><div>{children}</div></div></details>;
 return <div className="contextual-info">
  <button type="button" ref={trigger} className="contextual-info-trigger" popoverTarget={id} aria-label={label} aria-haspopup="dialog" aria-expanded={open} aria-controls={id}><Info size={19} aria-hidden="true"/></button>
  <div ref={panel} id={id} popover="auto" role="dialog" aria-modal="false" aria-labelledby={id+'-title'} aria-describedby={id+'-body'} className="contextual-info-panel">
   <div className="contextual-info-heading"><h2 id={id+'-title'}>{title}</h2><button type="button" className="contextual-info-close" popoverTarget={id} popoverTargetAction="hide" autoFocus aria-label={en?'Close information':'Cerrar información'}><X size={19} aria-hidden="true"/></button></div>
   <div id={id+'-body'} className="contextual-info-body">{children}</div>
  </div>
 </div>;
}
