import {themes,normalizeSettings,themeTokens} from './themes.js';
import baselineLight from 'virtual:baseline-light';
import '../src/main.jsx';
import './theme-overrides.css';
const query=new URLSearchParams(location.search);
let settings=normalizeSettings(Object.fromEntries(query));
let applied=[];
function apply(next){
 settings=normalizeSettings({...settings,...next});
 const root=document.documentElement;
 const more=settings.contrast==='more'||matchMedia('(prefers-contrast: more)').matches;
 applied.forEach(key=>root.style.removeProperty(key));applied=[];
 root.style.colorScheme=settings.appearance;
 root.dataset.labContrast=settings.contrast;
 root.dataset.labMotion=settings.motion;
 if(settings.appearance==='dark'){
  root.dataset.labTheme=settings.theme;
  const values=themeTokens(themes.find(t=>t.id===settings.theme),settings.intensity,more);
  Object.entries(values).forEach(([key,value])=>root.style.setProperty(key,value));applied=Object.keys(values);
 }else {delete root.dataset.labTheme;const values={...baselineLight,...(more?{'--text-secondary':'#2A3851','--text-tertiary':'#3D4C65','--border':'#75829A','--action':'#2445CE','--focus':'#2445CE'}:{})};Object.entries(values).forEach(([key,value])=>root.style.setProperty(key,value));applied=Object.keys(values)}
 syncArtwork();
}
function syncArtwork(){
 document.querySelectorAll('picture source').forEach(source=>{source.media=settings.appearance==='dark'?'all':'not all'});
}
new MutationObserver(syncArtwork).observe(document.getElementById('root'),{childList:true,subtree:true});
apply(settings);
matchMedia('(prefers-contrast: more)').addEventListener('change',()=>apply(settings));
window.addEventListener('message',event=>{
 if(event.origin!==location.origin||event.source!==parent||event.data?.type!=='milestoner-theme-preview')return;
 apply(event.data.settings);
});
// A deterministic scene invokes the existing example proposal, using its unchanged handler.
if(settings.screen==='miles'){
 const observer=new MutationObserver(()=>{
  const button=[...document.querySelectorAll('.conversation button')].find(el=>['Aprender francés','Learn French'].includes(el.textContent.trim()));
  if(button){observer.disconnect();button.click();requestAnimationFrame(()=>requestAnimationFrame(()=>window.scrollTo(0,0)))}
 });
 observer.observe(document.getElementById('root'),{childList:true,subtree:true});
 setTimeout(()=>observer.disconnect(),5000);
}
