import React from 'react';
import {ArrowLeft,Settings,Pencil,ChevronRight,Compass,Award,LockKeyhole,Mountain,BookOpen,Zap,Dumbbell,Camera,ChefHat,Sprout} from 'lucide-react';
import {useLanguage} from './language';
import {useDemoProfile} from './DemoProfile';
import IllustratedAvatar from './IllustratedAvatar';
import ProfileStatistics from './ProfileStatistics';
import {badgeCatalog,badgeView,badgeText} from './badges-model';
import {domainStyle} from './PlanSummary';
import './profile-overview.css';
import './badges.css';

const icons={mountain:Mountain,book:BookOpen,bolt:Zap,compass:Compass,dumbbell:Dumbbell,camera:Camera,chef:ChefHat,sprout:Sprout};
export default function Badges({route,headingRef}){
 const {profile}=useDemoProfile(),{language}=useLanguage(),L=(es,en)=>language==='en'?en:es,content=(badge,field)=>badgeText(badge,field,language);
 const view=badgeView(route==='you/badges/featured'?'featured':'all'),catalog=badgeCatalog(view);
 return <div className="badges-page">
  <header className="profile-screen-header">
   <a href="#you/profile" className="profile-icon-link" aria-label={L('Volver al perfil','Back to Profile')}><ArrowLeft size={20}/></a>
   <h1 ref={headingRef} tabIndex={-1}>{L('Insignias','Badges')}</h1>
   <a href="#you/settings" className="profile-icon-link" aria-label={L('Ajustes generales','General Settings')}><Settings size={20}/></a>
  </header>
  <div className="badges-summary">
   <div className="badges-identity"><div className="badges-portrait"><IllustratedAvatar appearance={profile.avatar}/></div><div className="badges-name"><h2>{profile.displayName}</h2>{profile.username&&<p>@{profile.username}</p>}</div><a className="profile-edit-link" href="#you/profile/edit"><Pencil size={15} aria-hidden="true"/>{L('Editar perfil','Edit Profile')}</a></div>
   <ProfileStatistics id="badges-statistics-note"/>
  </div>
  <div className="badges-intro"><span className="badges-eyebrow">{L('Colección ilustrativa','Illustrative collection')}</span><h2>{L('Pequeños símbolos de lo que importa.','Small symbols of what matters.')}</h2><p>{L('Ejemplos de diseño, no insignias obtenidas. Esta demo no calcula ni concede logros.','Design examples, not earned badges. This demo does not calculate or award achievements.')}</p></div>
  <nav className="badges-filters" aria-label={L('Vista de insignias','Badge view')}>
   <a href="#you/badges" aria-current={view==='all'?'page':undefined}>{L('Todas','All')}<span className="sr-only"> · {L('ejemplos del catálogo','catalog examples')}</span></a>
   <a href="#you/badges/featured" aria-current={view==='featured'?'page':undefined}>{L('Destacadas','Featured')}</a>
  </nav>
  <section aria-labelledby="badge-collection-title">
   <div className="badges-collection-heading"><h2 id="badge-collection-title">{view==='all'?L('Ejemplos del catálogo','Catalog examples'):L('Insignias destacadas','Featured Badges')}</h2>{view==='all'&&<span>{catalog.length} {L('ilustraciones','illustrations')}</span>}</div>
   {catalog.length?<ul className="badge-grid">{catalog.map(b=>{const Icon=icons[b.icon];return <li key={b.id}><article className="badge-card" style={domainStyle(b.tone)}><div className="badge-medallion" aria-hidden="true"><Icon size={42} strokeWidth={1.7}/></div><h3>{content(b,'name')}</h3><p>{content(b,'description')}</p><span className="badge-example">{L('Ejemplo','Example')}</span></article></li>})}</ul>:<div className="badges-empty"><Award size={32} aria-hidden="true"/><h3>{L('Sin insignias destacadas','No Featured Badges')}</h3><p>{L('No hay insignias obtenidas disponibles ni destacadas seleccionadas. Los ejemplos del catálogo no se pueden seleccionar.','No earned badges are available and no Featured Badges are selected. Catalog examples cannot be selected.')}</p><a href="#you/badges" className="text-button">{L('Explorar los ejemplos','Explore the examples')}<ChevronRight size={16} aria-hidden="true"/></a></div>}
  </section>
  <details className="badges-boundaries"><summary>{L('Sobre las insignias de esta demo','About badges in this demo')}</summary><p>{L('Obtenidas: no disponibles. Destacadas: ninguna seleccionada. Las ilustraciones no tienen fechas, requisitos ni reglas de obtención.','Earned: unavailable. Featured: none selected. Illustrations have no dates, requirements or award rules.')}</p><p>{L('El filtro «Hitos» y la gestión de destacadas quedan pendientes de definir su clasificación, elegibilidad y límite de selección. No se deducen de tus proyectos ni registros.','The “Milestones” filter and featured management await classification, eligibility and selection-limit decisions. They are not inferred from your projects or records.')}</p></details>
  <nav className="profile-actions badges-actions" aria-label={L('Volver a tu espacio','Return to your space')}><a href="#you/profile"><Award size={20} aria-hidden="true"/><span>{L('Ver mi perfil','View my Profile')}</span><ChevronRight size={16} aria-hidden="true"/></a><a href="#you"><Compass size={20} aria-hidden="true"/><span>{L('Ver mi Universo de intereses','View my Interest Universe')}</span><ChevronRight size={16} aria-hidden="true"/></a></nav>
  <p className="badges-private"><LockKeyhole size={13} aria-hidden="true"/>{L('Perfil privado · datos ficticios en este navegador','Private profile · fictional data in this browser')}</p>
 </div>;
}
