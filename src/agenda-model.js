import {TODAY} from './model.js';
export function validDate(value){return typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value+'T12:00:00Z'))&&new Date(value+'T12:00:00Z').toISOString().slice(0,10)===value}
export function shiftDate(date,days){return new Date(Date.parse(date+'T12:00:00Z')+days*86400000).toISOString().slice(0,10)}
export function weekDates(date){const day=new Date(date+'T12:00:00Z').getUTCDay(),start=shiftDate(date,-((day+6)%7));return Array.from({length:7},(_,i)=>shiftDate(start,i))}
export function agendaSelection(route){const [,date,project]=route.split('/');return {date:validDate(date)?date:TODAY,project:project||''}}
export function agendaRoute(date=TODAY,project=''){return `agenda/${validDate(date)?date:TODAY}${project?'/'+project:''}`}
// Projection only: each item references its original record. Undated legacy Today
// tasks, itinerary text and calendar ideas never acquire a date through display.
export function agendaItems(state,date,project=''){
 const items=[];
 for(const p of state.projects.filter(p=>!project||p.id===project))for(const task of p.tasks||[])if(validDate(task.date)&&task.date===date)items.push({kind:'activity',key:`activity:${p.id}:${task.id}`,record:task,project:p,time:task.time||''});
 if(!project)for(const r of state.reminders)if(r.date===date)items.push({kind:'reminder',key:'reminder:'+r.id,record:r,time:r.time||''});
 for(const event of state.events)if(event.date===date&&(!project||event.project===project))items.push({kind:'event',key:'event:'+event.id,record:event,project:state.projects.find(p=>p.id===event.project),time:event.time||''});
 return items.sort((a,b)=>(a.time||'\uffff').localeCompare(b.time||'\uffff'));
}
export function confirmedEvent(events,draft,makeId){
 const title=draft.title?.trim();
 if(!title||!validDate(draft.date)||!draft.project||!['Apple Calendar','Google Calendar'].includes(draft.calendar)|| (draft.time&&!/^([01]\d|2[0-3]):[0-5]\d$/.test(draft.time)))return {error:'invalid'};
 if(draft.id&&!events.some(e=>e.id===draft.id))return {error:'missing'};
 if(events.some(e=>e.id!==draft.id&&e.project===draft.project&&e.title.trim()===title&&e.date===draft.date&&(e.time||'')===(draft.time||'')))return {error:'duplicate'};
 const old=events.find(e=>e.id===draft.id),record={...old,...draft,title,time:draft.time||'',location:draft.location||'',id:old?.id||makeId()};
 return {events:old?events.map(e=>e.id===old.id?record:e):[...events,record],record};
}
