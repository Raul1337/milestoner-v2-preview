// Selected color facts only. No PDF, page imagery, descriptions or complete palettes are distributed.
export const themes=[
 {id:'electric',name:'Electric Night',caption:'Cobalto intenso · luz de hielo',description:'Azul profundo con un halo cian elevado y un horizonte violeta. Superficies nítidas y hero de tres temperaturas frías.',base:'#131F2F',surface:'#172C55',raised:'#263A64',hero:['#123A75','#42275F','#174754'],glow:['#0038BD','#9C52FF','#82DDF0'],positions:['5% 0%','95% 100%','75% 5%'],action:'#94ADFF',text:'#F1F4FF',secondary:'#CDD8F3',muted:'#B4C5E7',angle:125,
  colors:[['Submerged Obsidian','#131F2F','096'],['Neon Maritime','#0038BD','039'],['Submerged Indigo','#42478B','082'],['Digital Violet','#9C52FF','096'],['Ionized Cyan','#82DDF0','071']]},
 {id:'ember',name:'Ember Glow',caption:'Ciruela cálida · brasas de coral',description:'Una noche de ciruela con resplandor coral a media altura y oro en el horizonte. El hero concentra el calor; las tarjetas respiran en tonos vino.',base:'#4B262F',surface:'#51243B',raised:'#63354B',hero:['#6C293A','#713A25','#534020'],glow:['#F2626B','#F65000','#EF8E01'],positions:['0% 40%','100% 90%','60% 0%'],action:'#FFBE9D',text:'#FFF3EA',secondary:'#F3D6CA',muted:'#DDBCAF',angle:145,
  colors:[['Velvet Curfew','#4B262F','002'],['Living Coral','#F2626B','025'],['Kinetic Flare','#F65000','094'],['Amber Ignite','#EF8E01','039'],['Almond Hearth','#EED3BA','002']]},
 {id:'emerald',name:'Emerald Night',caption:'Jade botánico · claridad de menta',description:'Profundidad teal con luz botánica lateral. Jade en las superficies, menta en las acciones y un acento lima contenido en el hero.',base:'#013936',surface:'#103C35',raised:'#245044',hero:['#12534A','#244B36','#424C25'],glow:['#018989','#479C73','#E8FD94'],positions:['100% 0%','0% 75%','85% 80%'],action:'#A8F5D8',text:'#EFFCF4',secondary:'#D0E9DD',muted:'#B4D1C4',angle:110,
  colors:[['Botanical Obsidian','#013936','069'],['Jade Botanical','#479C73','017'],['Abyssal Teal','#018989','063'],['Mint Neon','#74F9CF','016'],['Lime Spark','#E8FD94','014']]},
 {id:'copper',name:'Copper Night',caption:'Espresso · cobre · crema',description:'Una atmósfera terrosa y acogedora, con reflejos de cobre bajos y luz de miel. Superficies tostadas, texto crema y un hero de cerámica cálida.',base:'#3E2723',surface:'#402D23',raised:'#574130',hero:['#633329','#674629','#51442D'],glow:['#80240F','#DA5E5E','#FFF7AE'],positions:['0% 100%','100% 45%','60% 0%'],action:'#E9CE89',text:'#F5F0E6',secondary:'#EBD8BE',muted:'#D6BEA0',angle:75,
  colors:[['Deep Espresso','#3E2723','021'],['Copper Hearth','#80240F','040'],['Terracotta Blush','#DA5E5E','035'],['Honey Silk','#FFF7AE','005'],['Ivory Hearth','#F5F0E6','021']]},
 {id:'velvet',name:'Velvet Dusk',caption:'Berenjena · lavanda · rosa empolvado',description:'El más suave y luminoso: una bruma rosa alta, superficies berenjena y reflejos periwinkle. El hero combina lavanda, rosa y azul crepuscular.',base:'#43123F',surface:'#3F2B4D',raised:'#543B61',hero:['#5B3556','#4D3A68','#383B6A'],glow:['#F4C9D6','#8A3E99','#94ADFF'],positions:['15% 0%','100% 65%','10% 100%'],action:'#E9D4FD',text:'#FFF2FC',secondary:'#EAD6EF',muted:'#D5BDD9',angle:115,
  colors:[['Tectonic Velvet','#43123F','079'],['Vapor Lavender','#E9D4FD','070'],['Petal Reverie','#F4C9D6','021'],['Stellar Periwinkle','#94ADFF','014'],['Digital Mulberry','#8A3E99','071']]}
];
export const rgb=hex=>hex.match(/[0-9a-f]{2}/gi).map(x=>parseInt(x,16));
export function mix(a,b,amount){return '#'+rgb(a).map((x,i)=>Math.round(x*(1-amount)+rgb(b)[i]*amount).toString(16).padStart(2,'0')).join('').toUpperCase()}
export function luminance(hex){const [r,g,b]=rgb(hex).map(x=>{x/=255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4});return .2126*r+.7152*g+.0722*b}
export function contrast(a,b){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)}
export function normalizeSettings(input={}){
 const intensity=Number(input.intensity??60);
 return {theme:themes.some(t=>t.id===input.theme)?input.theme:'electric',intensity:Number.isFinite(intensity)?Math.max(0,Math.min(100,intensity)):60,appearance:input.appearance==='light'?'light':'dark',contrast:input.contrast==='more'?'more':'normal',motion:input.motion==='reduce'?'reduce':'system',screen:['home','project','miles'].includes(input.screen)?input.screen:'home',device:input.device==='desktop'?'desktop':'mobile',view:input.view==='focus'?'focus':'compare'};
}
export function themeTokens(theme,intensity=60,more=false){
 const i=Math.max(0,Math.min(100,intensity))/100;
 const canvas=mix(theme.base,'#000000',theme.id==='electric'?.44:.55);
 const surface=mix(theme.surface,theme.base,.12*(1-i));
 const raised=theme.raised;
 const hero=theme.hero.map(c=>mix(surface,c,.40+i*.60));
 const action=theme.action;
 const v={'--canvas-flat':canvas,'--canvas-top':canvas,'--canvas-mid':canvas,'--canvas-bottom':canvas,'--surface':surface,'--surface-elevated':raised,'--surface-subtle':mix(surface,canvas,.25),'--inline':raised,'--interactive':raised,'--pill':mix(surface,raised,.5),'--text':theme.text,'--text-secondary':more?theme.text:theme.secondary,'--text-tertiary':more?theme.text:theme.muted,'--action':action,'--on-action':canvas,'--success':'#86EDBD','--warning':'#F5DD8C','--error':'#FFB0BF','--disabled':'#B7C4D9','--disabled-bg':raised,'--secondary-action':action,'--information':theme.secondary,'--focus':theme.text,'--border':mix(surface,theme.secondary,more?.8:.60),'--glass':mix(canvas,surface,.4),'--overlay':'#00000099','--shadow':'0 5px 20px #00000030','--parent-edge-a':more?'85%':'55%','--parent-edge-b':more?'85%':'28%','--child-edge-a':more?'85%':'45%','--child-edge-b':more?'85%':'28%','--lab-hero-a':hero[0],'--lab-hero-b':hero[1],'--lab-hero-c':hero[2],'--lab-angle':theme.angle+'deg'};
 const domains={travel:'#8CE4E8',learning:'#D7B5FF',fitness:'#86EDBD',finance:'#F5DD8C',warm:action,brand:action};
 for(const [domain,ink] of Object.entries(domains)){
  const tint=mix(surface,ink,.13),start=mix(surface,ink,.04+i*.045),end=mix(surface,canvas,.12);
  Object.assign(v,{[`--${domain}-ink`]:ink,[`--${domain}-accent`]:ink,[`--${domain}-edge`]:ink,[`--${domain}-tint`]:tint,[`--${domain}-parent-start`]:start,[`--${domain}-parent-end`]:end,[`--${domain}-child-start`]:mix(raised,ink,.035),[`--${domain}-child-end`]:raised,[`--${domain}-tile-start`]:tint,[`--${domain}-tile-end`]:mix(tint,surface,.25)});
 }
 const glows=more?[0,0,0]:[.06+i*.16,.05+i*.12,.02+i*.055];
 v['--lab-atmosphere']=theme.glow.map((c,n)=>`radial-gradient(ellipse ${n===2?'45% 55%':'80% 75%'} at ${theme.positions[n]}, ${c}${Math.round(glows[n]*255).toString(16).padStart(2,'0')}, transparent 75%)`).join(',')+`, linear-gradient(${theme.angle}deg, ${canvas}, ${mix(canvas,theme.base,.20)})`;
 if(more){v['--lab-hero-a']=surface;v['--lab-hero-b']=surface;v['--lab-hero-c']=surface}
 return v;
}
// Conservative text/control checks cover opaque surfaces and possible glow composites.
export function contrastReport(theme,intensity=60,more=false){
 const v=themeTokens(theme,intensity,more),surfaces=Object.entries(v).filter(([k])=>/surface|inline|interactive|pill|glass$|parent-start|parent-end|child-start|child-end|tile-start|tile-end|lab-hero-[abc]/.test(k)).map(([,x])=>x).filter(x=>/^#[0-9A-F]{6}$/i.test(x));
 let glow=v['--canvas-flat'];theme.glow.forEach((c,n)=>{glow=mix(glow,c,more?0:[.06+intensity/100*.16,.05+intensity/100*.12,.02+intensity/100*.055][n])});surfaces.push(glow,v['--canvas-flat']);
 const text=['--text','--text-secondary','--text-tertiary'].flatMap(role=>surfaces.map(bg=>({role,fg:v[role],bg,ratio:contrast(v[role],bg)})));
 const action=contrast(v['--on-action'],v['--action']);
 const focus=Math.min(...surfaces.map(bg=>contrast(v['--focus'],bg)));
 const boundary=Math.min(contrast(v['--border'],v['--surface']),contrast(v['--border'],v['--surface-elevated']));
 return {boundary,minimumText:Math.min(...text.map(x=>x.ratio)),action,focus,failures:text.filter(x=>x.ratio<4.5)};
}
