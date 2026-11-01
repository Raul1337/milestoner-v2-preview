import {initial, TODAY} from '../src/model.js';

const examples=initial().projects;
export function nextProjectTask(project) {
 return project.tasks?.find(task=>task.done===false && typeof task.text==='string' && task.text.trim()) || null;
}
// Read-only presentation metrics. Travel preparations do not establish an overall percentage.
export function projectCardMetric(state,project) {
 const example=examples.find(p=>p.id===project.id && p.domain===project.domain && p.unit===project.unit);
 if(!example || project.vision || !Number.isFinite(project.target) || project.target<=0 || project.domain==='travel')return null;
 const rows=state.logs.filter(l=>l.project===project.id && l.date<=TODAY && Number.isFinite(l.value) && l.value>0);
 if(!rows.length)return null;
 return {kind:project.domain,value:project.domain==='fitness'?Math.max(...rows.map(l=>l.value)):rows.reduce((n,l)=>n+l.value,0),target:project.target,unit:project.unit};
}
export function hasExampleArtwork(project) {
 return examples.some(p=>p.id===project.id && p.domain===project.domain && p.title===project.title);
}
export function stressProjectTitle(project,en) {
 return en ? `${project.title} · A thoughtful project with a very long title, room for changes and small steps along the way` : `${project.title} · Un proyecto con un título muy largo, espacio para cambios y pequeños pasos a lo largo del camino`;
}
