import React,{useLayoutEffect,useId,useRef,useState} from 'react';
import {Info,X} from 'lucide-react';
import {useLanguage} from './language';
import {observeInfoPopover,observeInlineInfo} from './contextual-info';
import './contextual-info.css';

export default function ContextualInfo({title,children,avoidSelector}){
 const {language}=useLanguage(),en=language==='en',id=useId(),trigger=useRef(),panel=useRef();
 const [open,setOpen]=useState(false),[supported,setSupported]=useState(true),[inline,setInline]=useState(false),inlineRef=useRef(false);
 inlineRef.current=inline;
 const label=(en?'Information: ':'Información: ')+title;
 function closeInline(restore=true){
  setOpen(false);setInline(false);inlineRef.current=false;
  if(restore){trigger.current?.focus({preventScroll:true});const r=trigger.current?.getBoundingClientRect(),v=window.visualViewport;if(r&&(r.top<(v?.offsetTop||0)||r.bottom>(v?.offsetTop||0)+(v?.height||innerHeight)))trigger.current.scrollIntoView({block:'nearest',behavior:'instant'})}
 }
 useLayoutEffect(()=>{
  if(inline){if(open){trigger.current?.focus({preventScroll:true});return observeInlineInfo(panel.current,trigger.current,window,closeInline)}return}
  if(typeof panel.current?.showPopover!=='function'){setSupported(false);return}
  return observeInfoPopover(panel.current,trigger.current,window,value=>{if(!inlineRef.current)setOpen(value)},{avoidSelector,onNoSpace:()=>{inlineRef.current=true;setInline(true);setOpen(true)}});
 },[inline,avoidSelector]);
 // Older engines retain readable, keyboard-operable inline disclosure content.
 if(!supported)return <details className="contextual-info-fallback" name="milestoner-contextual-info"><summary aria-label={label}><Info size={19} aria-hidden="true"/></summary><div><strong>{title}</strong><div>{children}</div></div></details>;
 return <div className="contextual-info" data-presentation={inline?'inline':'floating'}>
  <button type="button" ref={trigger} className="contextual-info-trigger" popoverTarget={inline?undefined:id} onClick={inline?()=>closeInline():undefined} aria-label={label} aria-haspopup={inline?undefined:'dialog'} aria-expanded={open} aria-controls={id}><Info size={19} aria-hidden="true"/></button>
  <div ref={panel} id={id} popover={inline?undefined:'auto'} hidden={inline&&!open} role={inline?'region':'dialog'} aria-modal={inline?undefined:'false'} aria-labelledby={id+'-title'} aria-describedby={id+'-body'} className="contextual-info-panel" style={inline?{position:'static',width:'auto',maxHeight:'none',left:'auto',top:'auto'}:undefined}>
   <div className="contextual-info-heading"><h2 id={id+'-title'}>{title}</h2><button type="button" className="contextual-info-close" popoverTarget={inline?undefined:id} popoverTargetAction={inline?undefined:'hide'} onClick={inline?()=>closeInline():undefined} autoFocus={!inline} aria-label={en?'Close information':'Cerrar información'}><X size={19} aria-hidden="true"/></button></div>
   <div id={id+'-body'} className="contextual-info-body">{children}</div>
  </div>
 </div>;
}
