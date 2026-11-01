// Isolated Web presentation state; never derives interests from project activity.
export const INTEREST_KEY='milestoner-vision-v2-interest-universe-v1';
export const AFFINITIES=['love','like','curious','not-really'];
const fixture=(id,es,en,affinity)=>({id,name:{es,en},affinity,note:''});
export function initialInterests(){return {version:1,confirmed:[fixture('photography','Fotografía','Photography','love'),fixture('science-fiction','Ciencia ficción','Science fiction','love'),fixture('languages','Idiomas','Languages','like'),fixture('japanese-food','Comida japonesa','Japanese food','like'),fixture('hiking','Senderismo','Hiking','love'),fixture('design','Diseño','Design','curious'),fixture('reading','Lectura','Reading','love'),fixture('technology','Tecnología','Technology','like'),fixture('music','Música','Music','love'),fixture('travel-experiences','Experiencias de viaje','Travel experiences','curious'),fixture('cinema','Cine','Cinema','like'),fixture('cooking','Cocina','Cooking','curious')],suggestions:[{...fixture('suggest-astronomy','Astronomía','Astronomy','curious'),status:'pending'},{...fixture('suggest-ceramics','Cerámica','Ceramics','curious'),status:'pending'}]}}
export function interestLabel(interest,language='es'){return typeof interest.name==='string'?interest.name:interest.name[language]||interest.name.es}
const normalized=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/\s+/g,' ');
function names(i){return typeof i.name==='string'?[i.name]:Object.values(i.name)}
function matches(a,b){return a.id===b.id||names(a).some(x=>names(b).some(y=>normalized(x)===normalized(y)))}
export function changeInterest(state,action,makeId){
 if(action.type==='add'){
  const name=action.name?.trim();if(!name||!AFFINITIES.includes(action.affinity))return {error:'invalid'};
  const item={id:makeId(),name,affinity:action.affinity,note:action.note||''};
  if(state.confirmed.some(i=>matches(i,item)))return {error:'duplicate'};
  return {state:{...state,confirmed:[...state.confirmed,item],suggestions:state.suggestions.map(i=>matches(i,item)?{...i,status:'accepted'}:i)}};
 }
 if(action.type==='edit'){
  if(!AFFINITIES.includes(action.affinity)||!state.confirmed.some(i=>i.id===action.id))return {error:'invalid'};
  return {state:{...state,confirmed:state.confirmed.map(i=>i.id===action.id?{...i,affinity:action.affinity,note:action.note||''}:i)}};
 }
 if(action.type==='remove')return {state:{...state,confirmed:state.confirmed.filter(i=>i.id!==action.id)}};
 const suggestion=state.suggestions.find(i=>i.id===action.id&&i.status==='pending');
 if(!suggestion)return {error:'missing'};
 if(action.type==='decline')return {state:{...state,suggestions:state.suggestions.map(i=>i.id===action.id?{...i,status:'declined',affinity:'not-really'}:i)}};
 if(action.type==='confirm'){
  if(!AFFINITIES.includes(action.affinity))return {error:'invalid'};
  const {status,...item}=suggestion;
  return {state:{...state,confirmed:state.confirmed.some(i=>matches(i,item))?state.confirmed:[...state.confirmed,{...item,affinity:action.affinity,note:action.note||''}],suggestions:state.suggestions.map(i=>i.id===action.id?{...i,status:'accepted'}:i)}};
 }
 return {error:'invalid'};
}
function validInterest(i){return i&&typeof i.id==='string'&&i.id&&AFFINITIES.includes(i.affinity)&&typeof i.note==='string'&&(typeof i.name==='string'&&!!i.name.trim()||i.name&&typeof i.name.es==='string'&&typeof i.name.en==='string')}
let memoryFallback;
export function readInterests(storage){try{const s=JSON.parse(storage.getItem(INTEREST_KEY));if(s?.version===1&&Array.isArray(s.confirmed)&&Array.isArray(s.suggestions)&&s.confirmed.every(validInterest)&&s.suggestions.every(i=>validInterest(i)&&['pending','declined','accepted'].includes(i.status))&&new Set(s.confirmed.map(i=>i.id)).size===s.confirmed.length)return s}catch{return memoryFallback||initialInterests()}return initialInterests()}
export function saveInterests(storage,state){memoryFallback=state;try{storage.setItem(INTEREST_KEY,JSON.stringify(state));return true}catch{return false}}
// Stable authored slots. Affinity edits never move or resize a node.
export const UNIVERSE_SLOTS=[[50,12,112],[68,18,122],[82,31,116],[87,51,122],[81,73,120],[67,85,112],[47,88,106],[29,82,114],[16,68,118],[12,47,118],[20,27,122],[34,16,112]];
