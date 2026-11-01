import {TODAY} from './model.js';
import {validDate} from './agenda-model.js';

export function projectEntries(state,project){
 return state.logs.filter(r=>r.project===project.id&&!r.private&&validDate(r.date)&&r.date<=TODAY&&Number.isFinite(r.value)&&r.value>0).slice().sort((a,b)=>b.date.localeCompare(a.date));
}
export function detailMetric(state,project){
 const kind=({learning:'sesiones',fitness:'km',finance:'MXN'})[project.domain];
 if(!kind||project.unit!==kind)return null;
 const rows=projectEntries(state,project);
 return {kind:project.domain,value:project.domain==='fitness'?Math.max(0,...rows.map(r=>r.value)):rows.reduce((n,r)=>n+r.value,0),count:rows.length,target:Number.isFinite(project.target)&&project.target>0?project.target:null,unit:project.unit};
}
export function activityPatch(project,{id,text,date},makeId){
 const old=project.tasks.find(t=>t.id===id);
 const task={...(old||{}),id:old?.id||makeId(),text:text.trim(),done:old?.done??false};
 if(project.vision)task.date=date||'';
 return {tasks:old?project.tasks.map(t=>t.id===id?task:t):[...project.tasks,task]};
}
export function detailsPatch(project,values){
 const patch={};
 for(const key of ['title','date'])if(key in values)patch[key]=values[key].trim();
 if(project.vision){
  const keys=['budget','preferences','milestone','itinerary','calendar'].filter(k=>k in values);
  if(keys.length)patch.vision={...project.vision,...Object.fromEntries(keys.map(k=>[k,values[k]]))};
 }else{
  for(const key of ['target','budget'])if(key in values&&values[key]!==''&&Number.isFinite(Number(values[key]))&&Number(values[key])>=(key==='target'?0.1:0))patch[key]=Number(values[key]);
 }
 return patch;
}

// Read-only context: never infer bookings, proficiency or completion from tasks.
export function detailContext(state,project){
 return {latest:projectEntries(state,project)[0]||null,eventCount:state.events.filter(e=>e.project===project.id).length,hasIdeas:!!project.vision?.calendar?.trim()};
}
