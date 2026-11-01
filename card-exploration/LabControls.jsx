import React,{useState,useEffect,useRef} from 'react';
import {useLanguage} from '../src/language';
import tokenCSS from '../src/tokens.css?raw';
export const cardLabEnabled=import.meta.env.VITE_PROJECT_CARD_LAB==='true';
export const currentHomeEnabled=cardLabEnabled||import.meta.env.VITE_CURRENT_HOME==='true';
const roots=[...tokenCSS.matchAll(/:root\s*\{([^}]+)\}/g)];
const parse=text=>Object.fromEntries([...text.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map(m=>[m[1],m[2]]));
const light=parse(roots[0][1]),dark={...light,...parse(roots[1][1])};
export function useCardLab() {
 const [view,setView]=useState(()=>new URLSearchParams(location.search).get('view')==='previous'?'previous':'refined'),[scenario,setScenario]=useState('normal'),[appearance,setAppearance]=useState(()=>new URLSearchParams(location.search).get('appearance')==='light'?'light':'dark');
 useEffect(()=>{
  if(!cardLabEnabled&&!(currentHomeEnabled&&['light','dark'].includes(new URLSearchParams(location.search).get('appearance'))))return;
  Object.entries(appearance==='dark'?dark:light).forEach(([key,value])=>document.documentElement.style.setProperty(key,value));
  document.documentElement.style.colorScheme=appearance;
  const artwork=()=>document.querySelectorAll('picture source').forEach(s=>s.media=appearance==='dark'?'all':'not all');
  artwork();const observer=new MutationObserver(artwork);observer.observe(document.getElementById('root'),{childList:true,subtree:true});return()=>observer.disconnect();
 },[appearance]);
 return {view,setView,scenario,setScenario,appearance,setAppearance};
}
export default function ProjectCardLabControls({settings}) {
 const {language}=useLanguage(),en=language==='en',details=useRef();
 return <details className="card-lab-controls" ref={details}>
  <summary>{en?'Your Life · interaction exploration':'Tu vida · exploración de interacción'}</summary>
  <div className="card-lab-options"><p>{en?'Local comparison. The active Home stays unchanged.':'Comparación local. El Home activo sigue intacto.'}</p>
  <label>{en?'Presentation':'Presentación'}<select value={settings.view} onChange={e=>settings.setView(e.target.value)}><option value="previous">{en?'Previous interaction':'Interacción anterior'}</option><option value="refined">{en?'Refined interaction':'Interacción refinada'}</option></select></label>
  <label>{en?'Appearance':'Apariencia'}<select value={settings.appearance} onChange={e=>settings.setAppearance(e.target.value)}><option value="light">Light</option><option value="dark">Dark</option></select></label>
  <label>{en?'Display test':'Prueba visual'}<select value={settings.scenario} onChange={e=>settings.setScenario(e.target.value)}>{[['normal',en?'Same sample projects':'Mismos proyectos de ejemplo'],['long-titles',en?'Long titles':'Títulos largos'],['no-images',en?'No images':'Sin imágenes'],['broken-image',en?'Unavailable image':'Imagen no disponible'],['empty',en?'Empty view':'Vista vacía']].map(([v,label])=><option key={v} value={v}>{label}</option>)}</select></label>
  <button className="secondary" onClick={()=>{try{localStorage.removeItem("milestoner-demo-insight-review-v1")}catch{}location.reload()}}>{en?"Reset suggestion review (demo)":"Reiniciar revisión de sugerencias (demo)"}</button><button className="secondary" onClick={()=>{details.current.open=false;requestAnimationFrame(()=>{const section=document.querySelector('.your-life');section?.querySelector('h2')?.focus({preventScroll:true});section?.scrollIntoView({block:'start',behavior:'instant'})})}}>{en?'View Your Life':'Ver Tu vida'}</button>
  </div></details>;
}
