import React,{useLayoutEffect,useRef,useState} from 'react';
import {usesReadableUniverse} from './universe-presentation.js';
import './readable-universe.css';

// Measure an actual rem, including text-size changes after the screen has mounted.
// This is presentation state only; neither interests nor profile data are written.
export function useUniverseText(key){
 const probe=useRef(),[readable,setReadable]=useState(false);
 useLayoutEffect(()=>{
  const element=probe.current;if(!element)return;
  const measure=()=>setReadable(usesReadableUniverse(element.getBoundingClientRect().width));
  measure();const observer=new ResizeObserver(measure);observer.observe(element);
  return()=>observer.disconnect();
 },[key]);
 return {readable,probe:<span ref={probe} className="universe-text-probe" aria-hidden="true"/>};
}

export default function ReadableUniverse({identity,items,renderItem,label}){
 return <section className="readable-universe" aria-label={label}>
  <div className="readable-universe-identity">{identity}</div>
  <ul className="readable-universe-interests">{items.map((item,index)=><li key={item.id}>{renderItem(item,index)}</li>)}</ul>
 </section>;
}

export function ReadableInterest({label,affinity,affinityLabel,Icon,style,onClick,accessibleLabel}){
 return <button className="readable-interest" style={style} data-affinity={affinity} onClick={onClick} aria-label={accessibleLabel}>
  <span className="readable-interest-medallion" aria-hidden="true"><Icon/></span>
  <span className="readable-interest-copy"><strong>{label}</strong><small>{affinityLabel}</small></span>
 </button>;
}
