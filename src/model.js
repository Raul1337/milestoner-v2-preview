export const TODAY = '2026-10-30';
export const KEY = 'milestoner-vision-v2-demo-v1';
export const domains = {
 travel: {name:'Travel',color:'#006978',accent:'#008D9F',tint:'#DDF7FA',icon:'plane'},
 learning:{name:'Learning',color:'#7436C9',accent:'#8C44E8',tint:'#F0E4FF',icon:'book'},
 fitness:{name:'Fitness',color:'#00734C',accent:'#009B6A',tint:'#D8FAEB',icon:'run'},
 finance:{name:'Finance',color:'#805300',accent:'#AE7900',tint:'#FFF0C6',icon:'wallet'}
};
export const initial = () => ({version:1,mode:'Balanced',context:null,projects:[
 {id:'japan',title:'Viaje a Japón',domain:'travel',subtitle:'Un viaje que empieza mucho antes de despegar.',target:8,unit:'preparativos',date:'2027-04-10',budget:60000,tasks:[{id:'jp1',text:'Definir ruta Tokio → Kioto',done:true},{id:'jp2',text:'Revisar vigencia del pasaporte',done:true},{id:'jp3',text:'Comparar alojamiento en Kioto',done:false},{id:'jp4',text:'Preparar lista de equipaje',done:false}]},
 {id:'french',title:'Aprender francés',domain:'learning',subtitle:'Un poco cada día. Una nueva forma de ver el mundo.',target:24,unit:'sesiones',date:'2026-12-31',tasks:[{id:'fr1',text:'Practicar conversación · 15 min',done:false},{id:'fr2',text:'Repasar vocabulario de viajes',done:false}]},
 {id:'run',title:'Correr 5 km',domain:'fitness',subtitle:'A tu ritmo, un kilómetro más cerca.',target:5,unit:'km',date:'2026-12-15',tasks:[{id:'ru1',text:'Salir a correr · sesión suave',done:false},{id:'ru2',text:'Preparar la ruta del fin de semana',done:false}]},
 {id:'save',title:'Ahorrar $30,000 MXN',domain:'finance',subtitle:'Más tranquilidad para tus próximos planes.',target:30000,unit:'MXN',date:'2027-03-31',tasks:[{id:'sa1',text:'Revisar mi aportación del mes',done:false}]}
],events:[{id:'ev1',project:'japan',title:'Paseo por Higashiyama',date:'2027-04-14',time:'10:00',location:'Kioto',calendar:'Apple Calendar'}],reminders:[{id:'med',title:'Medicamento de ejemplo',date:TODAY,time:'21:00',private:true,repeat:'Diario',done:false},{id:'ticket',title:'Revisar fechas del pasaporte',date:TODAY,time:'18:00',private:false,repeat:'Una vez',done:false}],logs:[
 {id:'l1',project:'japan',date:'2026-10-05',value:1,label:'Ruta inicial definida'}, {id:'l2',project:'japan',date:'2026-10-27',value:1,label:'Pasaporte revisado'},
 {id:'l3',project:'french',date:'2026-09-20',value:1,label:'Práctica de conversación'}, {id:'l4',project:'french',date:'2026-10-12',value:1,label:'Vocabulario de viajes'}, {id:'l5',project:'french',date:'2026-10-28',value:1,label:'Sesión de escucha'},
 {id:'l6',project:'run',date:'2026-10-03',value:2,label:'Carrera suave'}, {id:'l7',project:'run',date:'2026-10-26',value:3.2,label:'Carrera en el parque'},
 {id:'l8',project:'save',date:'2026-09-15',value:6000,label:'Aportación de septiembre'}, {id:'l9',project:'save',date:'2026-10-15',value:3000,label:'Aportación de octubre'}, {id:'l10',project:'save',date:'2026-10-29',value:1500,label:'Aportación adicional'}]});
export function total(state,p){const rows=state.logs.filter(l=>l.project===p.id); return p.domain==='fitness'?Math.max(0,...rows.map(l=>l.value)):rows.reduce((n,l)=>n+l.value,0)}
export function filterLogs(state,project,period){const start=period==='week'?'2026-10-24':period==='month'?'2026-10-01':'2026-01-01';return state.logs.filter(l=>(project==='all'||l.project===project)&&l.date>=start&&l.date<=TODAY).sort((a,b)=>b.date.localeCompare(a.date))}
export function readDemo(){try{const s=JSON.parse(localStorage.getItem(KEY));if(s?.version===1&&Array.isArray(s.projects)&&Array.isArray(s.logs)&&Array.isArray(s.events)&&Array.isArray(s.reminders))return s}catch{}return initial()}
export function saveDemo(s){try{localStorage.setItem(KEY,JSON.stringify(s));return true}catch{return false}}
export const uid=()=>crypto.randomUUID();
export const number=n=>new Intl.NumberFormat('es-MX',{maximumFractionDigits:1}).format(n);
export const dateLabel=d=>new Date(d+'T12:00:00').toLocaleDateString('es-MX',{day:'numeric',month:'short'});
