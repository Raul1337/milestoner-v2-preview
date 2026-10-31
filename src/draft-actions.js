// Index-aligned arrays are the accepted demo draft shape. Always move them together.
export function addActivity(d,text,date=''){
 return {...d,tasks:[...d.tasks,text],taskDates:[...d.tasks.map((_,i)=>d.taskDates[i]||''),date],_taskIds:[...d.tasks.map((_,i)=>d._taskIds?.[i]??null),null],_done:[...d.tasks.map((_,i)=>d._done?.[i]??false),false]};
}
export function editActivity(d,index,text,date=''){
 return {...d,tasks:d.tasks.map((t,i)=>i===index?text:t),taskDates:d.tasks.map((_,i)=>i===index?date:d.taskDates[i]||'')};
}
export function removeActivity(d,index){
 return {...d,tasks:d.tasks.filter((_,i)=>i!==index),taskDates:d.tasks.flatMap((_,i)=>i===index?[]:[d.taskDates[i]||'']),_taskIds:d.tasks.flatMap((_,i)=>i===index?[]:[d._taskIds?.[i]??null]),_done:d.tasks.flatMap((_,i)=>i===index?[]:[d._done?.[i]??false])};
}
export function planDraft(p){return {kind:p.vision.kind,title:p.title,domain:p.domain,date:p.date||'',budget:p.vision.budget||'',preferences:p.vision.preferences||'',milestone:p.vision.milestone||'',itinerary:p.vision.itinerary||'',calendar:p.vision.calendar||'',tasks:p.tasks.map(t=>t.text),taskDates:p.tasks.map(t=>t.date||''),_taskIds:p.tasks.map(t=>t.id),_done:p.tasks.map(t=>t.done)}}
export function planPatch(p,d,makeId){return {title:d.title.trim(),date:d.date,vision:{...p.vision,budget:d.budget,preferences:d.preferences,milestone:d.milestone,itinerary:d.itinerary,calendar:d.calendar},tasks:d.tasks.map((text,i)=>({...(p.tasks.find(t=>t.id===d._taskIds?.[i])||{}),id:d._taskIds?.[i]||makeId(),text:text.trim(),date:d.taskDates[i]||'',done:d._done?.[i]??false}))}}
