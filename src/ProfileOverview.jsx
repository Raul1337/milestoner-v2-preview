import React from 'react';
import {ArrowLeft,Settings,ChevronRight,ChartNoAxesColumnIncreasing,Compass,Award,Plane,BookOpen,Footprints,Wallet} from 'lucide-react';
import {useLanguage} from './language';
import ProfileIdentity from './ProfileIdentity';
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
    <ProfileIdentity profile={profile}/>
   </div>
   <div className="profile-sections">
    <section className="profile-section" aria-labelledby="profile-activity-title"><h2 id="profile-activity-title">{L('Actividad reciente','Recent Activity')}</h2>
     {rows.length?<ul className="profile-activity">{rows.map(({entry,project})=>{const Icon=activityIcons[project.domain]||BookOpen;return <li key={entry.id}><button className="profile-activity-row" style={domainStyle(project.domain)} onClick={()=>onOpenProject(project)}><span className="profile-activity-icon"><Icon size={22} aria-hidden="true"/></span><span className="profile-activity-copy"><strong>{content(entry,'label')}</strong><small>{content(project,'title')} · <time dateTime={entry.date}>{dateLabel(entry.date)}</time></small></span><ChevronRight size={17} aria-hidden="true"/></button></li>})}</ul>:<p className="profile-unavailable">{L('Todavía no hay registros de actividad disponibles.','No activity records are available yet.')}</p>}
    </section>
    <nav className="profile-actions" aria-label={L('Explorar tu actividad','Explore your activity')}>
     <a href="#progress"><ChartNoAxesColumnIncreasing size={20} aria-hidden="true"/><span>{L('Ver todo mi progreso','View Full Progress')}</span><ChevronRight size={16} aria-hidden="true"/></a>
     <a href="#you/badges"><Award size={20} aria-hidden="true"/><span>{L('Explorar insignias','Explore Badges')}<small>{L('Ejemplos ilustrativos · sin destacadas','Illustrative examples · none featured')}</small></span><ChevronRight size={16} aria-hidden="true"/></a>
     <a href="#you"><Compass size={20} aria-hidden="true"/><span>{L('Ver mi Universo de intereses','View my Interest Universe')}</span><ChevronRight size={16} aria-hidden="true"/></a>
    </nav>
    <ProfileStatistics/>
   </div>
  </div>
  <p className="profile-membership">{L('En Milestoner desde el 1 de octubre de 2026 · fecha ficticia','Milestoner since October 1, 2026 · fictional date')}</p>
 </div>;
}
