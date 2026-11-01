import {TODAY} from './model.js';
import {projectEntries,detailMetric} from './project-detail-model.js';
import {shiftDate} from './agenda-model.js';
export const PERIOD_STARTS={week:'2026-10-24',month:'2026-10-01',year:'2026-01-01'};
export function progressReport(state,scope='all',period='month'){
 const start=PERIOD_STARTS[period]||PERIOD_STARTS.month,projects=state.projects.filter(p=>!p.private),project=projects.find(p=>p.id===scope);
 const eligible=projects.flatMap(p=>projectEntries(state,p));
 const rows=eligible.filter(r=>(scope==='all'||r.project===scope)&&r.date>=start).sort((a,b)=>b.date.localeCompare(a.date));
 const distribution=projects.map(p=>({project:p,count:rows.filter(r=>r.project===p.id).length}));
 const days=new Set(rows.map(r=>r.date)).size,lifetime=project?detailMetric(state,project):null;
 const periodMetric=project?detailMetric({...state,logs:rows},project):null;
 const travel=project?.domain==='travel'&&project.unit==='preparativos';
 // No aggregation for unsupported/generic units; every recorded value stays in history.
 const value=periodMetric?.value??(travel?rows.reduce((n,r)=>n+r.value,0):null);
 const ascending=rows.slice().reverse(),first=ascending[0],last=ascending.at(-1);
 const distanceChange=periodMetric?.kind==='fitness'&&first&&last&&first.date!==last.date?{from:first,to:last,delta:last.value-first.value}:null;
 return {start,end:TODAY,rows,project,projects,distribution,activeProjects:distribution.filter(r=>r.count>0).length,days,lifetime,periodMetric,value,distanceChange,
 remaining:lifetime?.kind==='finance'&&lifetime.target?Math.max(0,lifetime.target-lifetime.value):null};
}
export function activityBuckets(rows,period='month'){
 const start=PERIOD_STARTS[period]||PERIOD_STARTS.month,bins=[];
 if(period==='year'){
  for(let month=1;month<=10;month++){const from=`2026-${String(month).padStart(2,'0')}-01`,to=month===10?TODAY:shiftDate(`2026-${String(month+1).padStart(2,'0')}-01`,-1);bins.push({from,to})}
 }else for(let from=start;from<=TODAY;){const to=period==='week'?from:[shiftDate(from,6),TODAY].sort()[0];bins.push({from,to});from=shiftDate(to,1)}
 return bins.map(bin=>({...bin,count:rows.filter(r=>r.date>=bin.from&&r.date<=bin.to).length}));
}
