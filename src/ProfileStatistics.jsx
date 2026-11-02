import React from 'react';
import {Zap,ChartNoAxesColumnIncreasing,Flag,Clock} from 'lucide-react';
import {useLanguage} from './language';

// Shared unavailable snapshot. Activity records are not achievement calculations.
export default function ProfileStatistics({id='profile-statistics-note'}){
 const {language}=useLanguage(),L=(es,en)=>language==='en'?en:es;
 const statistics=[{Icon:Zap,label:L('Consistencia','Consistency'),tone:'fitness'},{Icon:ChartNoAxesColumnIncreasing,label:L('Nivel','Level'),tone:'learning'},{Icon:Flag,label:L('Hitos completados','Completed milestones'),tone:'travel'},{Icon:Clock,label:L('Hitos activos','Active milestones'),tone:'warm'}];
 return <><dl className="profile-statistics" aria-label={L('Estadísticas del perfil','Profile statistics')} aria-describedby={id}>
  {statistics.map(({Icon,label,tone})=><div key={tone} style={{'--stat-ink':`var(--${tone}-accent)`}}><Icon size={19} aria-hidden="true"/><dt>{label}</dt><dd><span aria-hidden="true">—</span><span className="sr-only">{L('No disponible en esta demo','Not available in this demo')}</span></dd></div>)}
 </dl><p id={id} className="profile-statistics-note">{L('Estas métricas aún no están disponibles en esta demo.','These metrics are not yet available in this demo.')}</p></>;
}
