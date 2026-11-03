import React from 'react';
import {useLanguage} from './language';
import ContextualInfo from './ContextualInfo';

// Explain unavailable achievements on demand, without placeholder metrics.
export default function ProfileStatistics(){
 const {language}=useLanguage(),L=(es,en)=>language==='en'?en:es;
 return <div className="profile-information contextual-info-line"><p>{L('Sobre este perfil','About this profile')}</p><ContextualInfo title={L('Datos del perfil','Profile data')}>
  <p>{L('La actividad reciente muestra hasta tres registros guardados elegibles. No representa logros obtenidos.','Recent Activity shows up to three eligible saved records. It does not represent earned achievements.')}</p>
  <p>{L('Esta demo no calcula consistencia, XP, niveles, hitos completados o activos ni clasificaciones de dominios. Las insignias obtenidas aún no están disponibles.','This demo does not calculate consistency, XP, levels, completed or active milestones, or domain rankings. Earned badges are not yet available.')}</p>
 </ContextualInfo></div>;
}
