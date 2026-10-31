import React,{useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {ArrowUpRight,Columns3,Expand,Monitor,Smartphone} from 'lucide-react';
import {themes,normalizeSettings,contrastReport} from './themes.js';
import './playground.css';
const screenNames={home:'Inicio / Hoy / Tu vida',project:'Resumen de proyecto',miles:'Miles · creación'};
const hashes={home:'home',project:'project/japan',miles:'miles'};
function frameURL(theme,settings){
 const params=new URLSearchParams({...settings,theme:theme.id,lang:'es'});
 return `${import.meta.env.BASE_URL}frame.html?${params}#${hashes[settings.screen]}`;
}
function Scene({theme,settings,onExplore}){
 const frame=useRef(),holder=useRef();
 const viewport=settings.device==='desktop'?1280:390;
 const height=settings.device==='desktop'?960:1000;
 // Color-only updates keep the live example and its scroll position intact.
 const source=frameURL(theme,settings);
 const initialSource=useRef(source);
 useEffect(()=>{
  const observer=new ResizeObserver(([entry])=>holder.current?.style.setProperty('--preview-scale',entry.contentRect.width/viewport));
  observer.observe(holder.current);return()=>observer.disconnect();
 },[viewport]);
 useEffect(()=>{frame.current?.contentWindow?.postMessage({type:'milestoner-theme-preview',settings:{...settings,theme:theme.id}},location.origin)},[theme.id,settings.intensity,settings.appearance,settings.contrast,settings.motion]);
 const ratio=contrastReport(theme,settings.intensity,settings.contrast==='more');
 return <article className="theme-scene" style={{'--scene-ink':theme.action,'--scene-base':theme.base}}>
  <header className="scene-heading"><div><h2>{theme.name}</h2><p>{theme.caption}</p></div><button onClick={()=>onExplore(theme.id)} aria-label={`Explorar ${theme.name}`} title={`Explorar ${theme.name}`}><Expand size={18}/></button></header>
  <div className="screen-window" ref={holder} style={{aspectRatio:`${viewport}/${height}`}}>
   <iframe key={`${theme.id}-${settings.screen}-${settings.device}`} ref={frame} title={`${theme.name} · ${screenNames[settings.screen]}`} src={initialSource.current} style={{width:viewport,height,colorScheme:settings.appearance}} onLoad={()=>frame.current?.contentWindow?.postMessage({type:'milestoner-theme-preview',settings:{...settings,theme:theme.id}},location.origin)}/>
  </div>
  <footer className="scene-footer"><div className="source-swatches" aria-label={`Colores de ${theme.name}`}>{theme.colors.map(([name,hex,palette])=><span key={hex} style={{background:hex}} title={`${name} · ${hex} · No.${palette}`} aria-label={`${name}, ${hex}, paleta ${palette}`}/>)}</div><span className="contrast-note">{settings.appearance==='dark'?`${ratio.minimumText.toFixed(1)}:1 texto mín.*`:'Light V2.1.2 original'}</span><a href={source} target="_blank" rel="noreferrer">Abrir pantalla <ArrowUpRight size={13}/></a></footer>
 </article>;
}
function Playground(){
 const [settings,setSettings]=useState(()=>normalizeSettings(Object.fromEntries(new URLSearchParams(location.search))));
 const theme=themes.find(t=>t.id===settings.theme);
 function change(patch){setSettings(s=>({...s,...patch}))}
 useEffect(()=>{const params=new URLSearchParams(settings);history.replaceState(null,'',`${location.pathname}?${params}`)},[settings]);
 return <><header className="lab-header"><a className="lab-brand" href="../" aria-label="Volver a la preview principal"><img src={`${import.meta.env.BASE_URL}brand-dark.svg`} alt="Milestoner"/></a><span>VISION V2.2 <i/> EXPLORACIÓN DE COLOR</span><a className="return-link" href="../">App actual <ArrowUpRight size={15}/></a></header>
 <main className="lab-main"><div className="lab-intro"><div><p className="eyebrow">CINCO ATMÓSFERAS. UN MISMO MILESTONER.</p><h1>La noche tiene más de un color.</h1><p>Cinco mundos distintos. Las mismas pantallas, el mismo Milestoner.</p></div><span className="lab-status">Exploración · sin aplicar a tu app</span></div>
 <section className="lab-controls" aria-label="Controles de exploración"><div className="control-row">
  <label>Pantalla<select aria-label="Pantalla" value={settings.screen} onChange={e=>change({screen:e.target.value})}>{Object.entries(screenNames).map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label>
  <div className="segmented" role="group" aria-label="Vista"><button aria-pressed={settings.view==='compare'} onClick={()=>change({view:'compare'})}><Columns3 size={16}/>Comparar cinco</button><button aria-pressed={settings.view==='focus'} onClick={()=>change({view:'focus'})}><Expand size={16}/>Explorar uno</button></div>
  <div className="segmented" role="group" aria-label="Tamaño"><button aria-pressed={settings.device==='mobile'} onClick={()=>change({device:'mobile'})}><Smartphone size={16}/>Móvil</button><button aria-pressed={settings.device==='desktop'} onClick={()=>change({device:'desktop'})}><Monitor size={16}/>Escritorio</button></div>
  <label>Apariencia<select aria-label="Apariencia" value={settings.appearance} onChange={e=>change({appearance:e.target.value})}><option value="dark">Dark · exploración</option><option value="light">Light · original</option></select></label>
 </div><div className="control-row secondary-controls"><label className="intensity"><span>Intensidad visual <output>{settings.intensity}%</output></span><input type="range" min="0" max="100" step="5" aria-label="Intensidad visual" value={settings.intensity} disabled={settings.appearance==='light'} onChange={e=>change({intensity:Number(e.target.value)})}/><span className="range-labels"><span>Sutil</span><span>Expresiva</span></span></label><label className="check-label"><input type="checkbox" checked={settings.contrast==='more'} onChange={e=>change({contrast:e.target.checked?'more':'normal'})}/>Contraste aumentado</label><label className="check-label"><input type="checkbox" checked={settings.motion==='reduce'} onChange={e=>change({motion:e.target.checked?'reduce':'system'})}/>Movimiento reducido</label><p className="temporary-note">Ejemplos temporales. La app principal conserva tus preferencias.</p></div></section>
 <div className="theme-selector" role="group" aria-label="Elegir atmósfera">{themes.map((t,index)=><button key={t.id} aria-pressed={settings.theme===t.id} onClick={()=>change({theme:t.id,view:'focus'})} style={{'--chip':t.action}}><span className="theme-number">0{index+1}</span><span>{t.name}</span><i style={{background:`linear-gradient(125deg,${t.hero.join(',')})`}}/></button>)}</div>
 {settings.view==='focus'&&<div className="focus-intro"><h2>{theme.name}</h2><p>{theme.description}</p><button onClick={()=>change({view:'compare'})}>Volver a las cinco</button></div>}
 <div className={`scene-grid ${settings.view} ${settings.device}`}>{(settings.view==='compare'?themes:[theme]).map(t=><Scene key={`${t.id}-${settings.screen}-${settings.device}`} theme={t} settings={settings} onExplore={id=>change({theme:id,view:'focus'})}/>)}</div>
 <div className="lab-footnote"><p>* Mínimo calculado para los colores de texto semánticos sobre superficies, extremos de gradientes y una combinación conservadora de halos. No sustituye una certificación completa de accesibilidad.</p><details><summary>Colores de referencia y alcance</summary><p>Colores seleccionados de The Color Bears Dictionary, combinando paletas numeradas. Las superficies y sombras se derivan para uso en interfaz; no reproducen páginas o paletas completas del libro.</p><div className="provenance">{themes.map(t=><section key={t.id}><h3>{t.name}</h3>{t.colors.map(([name,hex,palette])=><p key={hex}><i style={{background:hex}}/>{name} <code>{hex}</code><small>No.{palette}</small></p>)}</section>)}</div><p>El Playground reutiliza los componentes, rutas y fixtures de V2.1.2. Los ejemplos viven sólo en memoria; cambiar de pantalla o recargar vuelve al escenario inicial. Light muestra la apariencia aprobada, sin aplicar las nuevas paletas. Ninguna selección publica un tema global.</p></details></div>
 </main></>;
}
createRoot(document.getElementById('playground')).render(<Playground/>);
