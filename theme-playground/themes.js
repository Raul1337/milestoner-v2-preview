import {categoryTokens,contrast} from './native-palette.js';
export {contrast,luminance,mix,rgb} from './native-palette.js';
export const backgrounds=Object.freeze([
 {id:'white',appearance:'light',name:'Clean White',caption:'Blanco limpio · luz neutra',colors:['#FFFFFF','#FAFBFE','#F5F7FB'],glow:['#E9EEFF','#FFFFFF']},
 {id:'sky',appearance:'light',name:'Soft Sky Blue',caption:'Azul cielo · atmósfera nativa',colors:['#EDF6FF','#D6E8FF','#C8DFFF'],glow:['#D4E7FF','#E4DDFF']},
 {id:'blush',appearance:'light',name:'Soft Blush Pink',caption:'Rosa suave · luz difusa',colors:['#FFF5F8','#F9E1EC','#FCECF3'],glow:['#FFE5ED','#F1E4FA']},
 {id:'lavender',appearance:'light',name:'Pastel Lavender',caption:'Lavanda pastel · calma',colors:['#F7F3FF','#E9E0FC','#EEEAFF'],glow:['#E3D7FF','#E8EEFF']},
 {id:'peach',appearance:'light',name:'Warm Pastel Peach',caption:'Durazno cálido · luz suave',colors:['#FFF6EF','#FFE7D7','#FFF0DF'],glow:['#FFE3D0','#FFF1DA']},
 {id:'gray',appearance:'dark',name:'Dark Gray',caption:'Grafito neutro · superficies carbón',colors:['#1C1C20','#18181B','#101012'],glow:['#34343C','#25252B']},
 {id:'blue',appearance:'dark',name:'Dark Blue',caption:'Azul profundo · atmósfera nativa',colors:['#0B1830','#10162B','#06111F'],glow:['#153773','#302052']}
]);
export function normalizeSettings(input={}){
 return {appearance:['system','light','dark'].includes(input.appearance)?input.appearance:'system',
 lightBackground:backgrounds.some(b=>b.appearance==='light'&&b.id===input.lightBackground)?input.lightBackground:'sky',
 darkBackground:['gray','blue'].includes(input.darkBackground)?input.darkBackground:'blue',
 contrast:input.contrast==='more'?'more':'normal',motion:input.motion==='reduce'?'reduce':'system',transparency:input.transparency==='reduce'?'reduce':'system',
 screen:['home','project','miles'].includes(input.screen)?input.screen:'home',device:input.device==='desktop'?'desktop':'mobile',view:input.view==='focus'?'focus':'compare'};
}
export const resolveAppearance=(appearance,systemDark)=>appearance==='system'?(systemDark?'dark':'light'):appearance;
export function backgroundTokens(background,baseline,more=false,opaque=false){
 const dark=background.appearance==='dark',gray=background.id==='gray';
 const neutral=dark?{card:gray?'#28282C':'#282F3B',cardEnd:gray?'#1B1B1F':'#161E2C',child:gray?'#333338':'#303B4B',childEnd:gray?'#2A2A30':'#253140'}:{card:'#FFFFFF',cardEnd:'#FFFFFF',child:'#FFFFFF',childEnd:'#FFFFFF'};
 const v={...baseline,'--canvas-flat':background.colors[1],'--canvas-top':background.colors[0],'--canvas-mid':background.colors[1],'--canvas-bottom':background.colors[2]};
 if(!dark)Object.assign(v,{'--text-secondary':'#40516E','--text-tertiary':'#4E5E78','--action':'#2445CE'});
 if(gray)Object.assign(v,{'--surface':'#202024','--surface-elevated':'#2B2B30','--surface-subtle':'#242429','--inline':'#29292F','--interactive':'#303037','--pill':'#25252B','--glass':'#25252BF0','--border':'#62626F','--brand-parent-start':'#2A2A30','--brand-parent-end':'#1B1B1F','--brand-child-start':'#333338','--brand-child-end':'#2A2A30'});
 Object.assign(v,categoryTokens(background.appearance,neutral));
 // All other approved category tokens and the brand remain exactly those of the web baseline.
 const alpha=dark?['26','18']:['70','50'];
 v['--lab-atmosphere']=(more||opaque?'':`radial-gradient(ellipse 80% 65% at 0% 0%,${background.glow[0]}${alpha[0]},transparent 80%),radial-gradient(ellipse 70% 60% at 100% 100%,${background.glow[1]}${alpha[1]},transparent 80%),`)+`linear-gradient(155deg,${background.colors.join(',')})`;
 if(more)Object.assign(v,{'--text-secondary':dark?'#D6DEEF':'#2A3851','--text-tertiary':dark?'#C7D2E9':'#3D4C65','--border':dark?'#8D9FBD':'#75829A','--action':dark?'#BECDFE':'#2445CE','--focus':dark?'#D2DCFF':'#2445CE'});
 if(opaque||more)v['--glass']=v['--surface'];
 return v;
}
export function contrastReport(v){
 const surfaces=['--surface','--surface-elevated','--surface-subtle','--inline','--interactive','--pill','--canvas-top','--canvas-mid','--canvas-bottom'].map(k=>v[k]);
 return {minimumText:Math.min(...['--text','--text-secondary','--text-tertiary'].flatMap(key=>surfaces.map(bg=>contrast(v[key],bg)))),action:contrast(v['--action'],v['--on-action'])};
}
