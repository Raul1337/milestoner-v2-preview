import React from 'react';
import {ArrowLeft,Settings,Pencil,ChevronRight,ChartNoAxesColumnIncreasing,Compass,Award,Plane,BookOpen,Footprints,Wallet} from 'lucide-react';
import {useLanguage} from './language';
import IllustratedAvatar from './IllustratedAvatar';
import {profileActivity} from './profile-overview-model';
import {domainStyle} from './PlanSummary';
import './profile-overview.css';
import {useDemoProfile,ProfileSaveStatus} from './DemoProfile';
import ProfileStatistics from './ProfileStatistics';

const activityIcons={travel:Plane,learning:BookOpen,fitness:Footprints,finance:Wallet};
export default function ProfileOverview({state,headingRef,onOpenProject}){
 const {profile}=useDemoProfile();
 const {language,content,dateLabel}=useLanguage(),L=(es,en)=>language==='en'?en:es,rows=profileActivity(state);
 return <div className="profile-overview">
  <header className="profile-screen-header">
   <a href="#you" className="profile-icon-link" aria-label={L('Volver al Universo','Back to Universe')}><ArrowLeft size={20}/></a>
   <h1 ref={headingRef} tabIndex={-1}>{L('Perfil','Profile')}</h1>
   <a href="#you/settings" className="profile-icon-link" aria-label={L('Ajustes generales','General Settings')}><Settings size={20}/></a>
  </header>
  <ProfileSaveStatus/><div className="profile-layout">
   <div className="profile-identity">
    <section className="profile-hero" aria-label={L('Identidad ficticia','Fictional identity')}>
     <div className="profile-portrait"><IllustratedAvatar appearance={profile.avatar}/></div>
     <h2>{profile.displayName}</h2>{profile.username&&<p className="profile-handle">@{profile.username}</p>}{profile.bio&&<p className="profile-bio">{profile.bio}</p>}
     <a className="profile-edit-link" href="#you/profile/edit"><Pencil size={16} aria-hidden="true"/>{L('Editar perfil','Edit Profile')}</a>
     <p className="profile-private">{L('Perfil privado · identidad ficticia','Private profile · fictional identity')}</p>
    </section>
    <ProfileStatistics/>
   </div>
   <div className="profile-sections">
    <section className="profile-section" aria-labelledby="profile-domains-title"><h2 id="profile-domains-title">{L('Dominios principales','Top Domains')}</h2><div className="profile-unavailable"><span className="profile-empty-icon"><Compass size={23} aria-hidden="true"/></span><p>{L('Aún no hay una clasificación de dominios disponible.','No domain ranking is available yet.')}</p></div></section>
    <section className="profile-section" aria-labelledby="profile-badges-title"><h2 id="profile-badges-title">{L('Insignias destacadas','Featured Badges')}</h2><div className="profile-unavailable profile-unavailable--badges"><span className="profile-empty-icon"><Award size={23} aria-hidden="true"/></span><p>{L('Las insignias obtenidas aún no están disponibles en esta demo.','Earned badges are not yet available in this demo.')}</p></div><a className="profile-edit-link" href="#you/badges">{L('Explorar ejemplos de insignias','Explore badge examples')}<ChevronRight size={16} aria-hidden="true"/></a></section>
    <section className="profile-section" aria-labelledby="profile-activity-title"><h2 id="profile-activity-title">{L('Actividad reciente','Recent Activity')}</h2>
     {rows.length?<ul className="profile-activity">{rows.map(({entry,project})=>{const Icon=activityIcons[project.domain]||BookOpen;return <li key={entry.id}><button className="profile-activity-row" style={domainStyle(project.domain)} onClick={()=>onOpenProject(project)}><span className="profile-activity-icon"><Icon size={22} aria-hidden="true"/></span><span className="profile-activity-copy"><strong>{content(entry,'label')}</strong><small>{content(project,'title')} · <time dateTime={entry.date}>{dateLabel(entry.date)}</time></small></span><ChevronRight size={17} aria-hidden="true"/></button></li>})}</ul>:<p className="profile-unavailable">{L('Todavía no hay registros de actividad disponibles.','No activity records are available yet.')}</p>}
    </section>
    <nav className="profile-actions" aria-label={L('Explorar tu actividad','Explore your activity')}>
     <a href="#progress"><ChartNoAxesColumnIncreasing size={20} aria-hidden="true"/><span>{L('Ver todo mi progreso','View Full Progress')}</span><ChevronRight size={16} aria-hidden="true"/></a>
     <a href="#you"><Compass size={20} aria-hidden="true"/><span>{L('Ver mi Universo de intereses','View my Interest Universe')}</span><ChevronRight size={16} aria-hidden="true"/></a>
    </nav>
   </div>
  </div>
  <p className="profile-membership">{L('En Milestoner desde el 1 de octubre de 2026 · fecha ficticia','Milestoner since October 1, 2026 · fictional date')}</p>
 </div>;
}
