// Exact presentation values from native VibrantSurfaceTokens.swift.
// Owner's attached visual reference selects this vibrant profile over the older catalog colors.
const values={
 fitness:['Fitness','00734C','2AE9AB','009B6A','2AE9AB','D8FAEB','123F34'],
 learning:['Learning','7436C9','C197FF','8C44E8','B77CFF','F0E4FF','3C285C'],
 career:['Career','005EC9','65B4FF','0079F2','48A8FF','E0EFFF','163D64'],
 social:['Personal / Social','B52C4E','FF8AA0','E44365','FF6C89','FFE5EB','512936'],
 finance:['Finance','805300','FFD447','AE7900','F6C638','FFF0C6','473B20'],
 wellbeing:['Wellbeing','A1480A','FFAC66','C96812','FF9D47','FFEAD8','4B3326']
};
export const approvedCategories=Object.freeze(Object.fromEntries(Object.entries(values).map(([id,[name,li,di,lg,dg,lt,dt]])=>[id,Object.freeze({id,name,light:Object.freeze({ink:'#'+li,graphic:'#'+lg,tile:'#'+lt}),dark:Object.freeze({ink:'#'+di,graphic:'#'+dg,tile:'#'+dt})})])));
export const rgb=hex=>hex.match(/[0-9a-f]{2}/gi).map(x=>parseInt(x,16));
export function mix(a,b,amount){return '#'+rgb(a).map((x,i)=>Math.round(x*(1-amount)+rgb(b)[i]*amount).toString(16).padStart(2,'0')).join('').toUpperCase()}
export function luminance(hex){const [r,g,b]=rgb(hex).map(x=>{x/=255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4});return .2126*r+.7152*g+.0722*b}
export function contrast(a,b){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)}
export function categoryTokens(appearance,neutral){
 const dark=appearance==='dark',v={};
 for(const [id,category] of Object.entries(approvedCategories)){
  const {ink,graphic,tile}=category[appearance];
  const roles={ink,accent:graphic,edge:ink,tint:tile,'tile-start':dark?mix(tile,graphic,.06):tile,'tile-end':dark?tile:mix(tile,'#FFFFFF',.35),
   'parent-start':dark?mix(neutral.card,graphic,.045):'#FFFFFF','parent-end':dark?neutral.cardEnd:mix('#FFFFFF',tile,.32),
   'child-start':dark?mix(neutral.child,graphic,.025):'#FFFFFF','child-end':dark?neutral.childEnd:mix('#FFFFFF',tile,.22)};
  for(const [role,value] of Object.entries(roles))v[`--${id}-${role}`]=value;
 }
 // Today already uses the wellbeing treatment in the approved web prototype.
 for(const [key,value] of Object.entries(v))if(key.startsWith('--wellbeing-'))v[key.replace('--wellbeing-','--warm-')]=value;
 return v;
}
