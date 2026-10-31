import {backgrounds,normalizeSettings,resolveAppearance,backgroundTokens} from './themes.js';
import baseline from 'virtual:baseline';
import '../src/main.jsx';
import './theme-overrides.css';
let settings=normalizeSettings(Object.fromEntries(new URLSearchParams(location.search)));
const scheme=matchMedia('(prefers-color-scheme: dark)'),high=matchMedia('(prefers-contrast: more)'),opaque=matchMedia('(prefers-reduced-transparency: reduce)');
let applied=[];
function artwork(){document.querySelectorAll('picture source').forEach(source=>{source.media=document.documentElement.dataset.labAppearance==='dark'?'all':'not all'})}
function apply(next){
 settings=normalizeSettings({...settings,...next});
 const appearance=resolveAppearance(settings.appearance,scheme.matches),root=document.documentElement;
 const background=backgrounds.find(b=>b.id===(appearance==='dark'?settings.darkBackground:settings.lightBackground));
 applied.forEach(key=>root.style.removeProperty(key));
 const more=settings.contrast==='more'||high.matches,solid=settings.transparency==='reduce'||opaque.matches;
 const values=backgroundTokens(background,baseline[appearance],more,solid);
 Object.entries(values).forEach(([key,value])=>root.style.setProperty(key,value));applied=Object.keys(values);
 root.style.colorScheme=appearance;
 Object.assign(root.dataset,{labAppearance:appearance,labBackground:background.id,labContrast:more?'more':'normal',labMotion:settings.motion,labTransparency:solid?'reduce':'system'});
 artwork();
}
new MutationObserver(artwork).observe(document.getElementById('root'),{childList:true,subtree:true});
apply(settings);
[scheme,high,opaque].forEach(media=>media.addEventListener('change',()=>apply(settings)));
window.addEventListener('message',event=>{
 if(event.origin===location.origin&&event.source===parent&&event.data?.type==='milestoner-background-preview')apply(event.data.settings);
});
// Same existing example/handler; no auto-confirmation and no persistence.
if(settings.screen==='miles'){
 let started=false;
 const observer=new MutationObserver(()=>{
  const skip=[...document.querySelectorAll('.clarification button')].find(el=>['Omitir detalles desconocidos','Skip unknown details'].includes(el.textContent.trim()));
  if(started&&skip){observer.disconnect();skip.click();requestAnimationFrame(()=>requestAnimationFrame(()=>window.scrollTo(0,0)));return}
  const button=[...document.querySelectorAll('.conversation button')].find(el=>['Aprender francés','Learn French'].includes(el.textContent.trim()));
  if(button&&!started){started=true;button.click()}
 });
 observer.observe(document.getElementById('root'),{childList:true,subtree:true});setTimeout(()=>observer.disconnect(),5000);
}
