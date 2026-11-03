import React from 'react';
import {ChevronRight,Pencil} from 'lucide-react';
import {useLanguage} from './language';
import IllustratedAvatar from './IllustratedAvatar';

// One saved identity, with a smaller presentation for collection screens.
export default function ProfileIdentity({profile,compact=false}){
 const {language}=useLanguage(),L=(es,en)=>language==='en'?en:es;
 const identity=<div className="profile-identity-copy"><h2>{profile.displayName}</h2>{profile.username&&<p className="profile-handle">@{profile.username}</p>}</div>;
 if(compact)return <a className="profile-identity-summary" href="#you/profile" aria-label={L(`Ver el perfil de ${profile.displayName}`,`View ${profile.displayName}'s Profile`)+(profile.username?` · @${profile.username}`:'')}><span className="profile-summary-portrait"><IllustratedAvatar appearance={profile.avatar}/></span>{identity}<ChevronRight size={18} aria-hidden="true"/></a>;
 return <section className="profile-hero" aria-label={L('Identidad ficticia','Fictional identity')}>
  <div className="profile-portrait"><IllustratedAvatar appearance={profile.avatar}/></div>{identity}
  {profile.bio&&<p className="profile-bio">{profile.bio}</p>}
  <a className="profile-edit-link" href="#you/profile/edit"><Pencil size={16} aria-hidden="true"/>{L('Editar perfil','Edit Profile')}</a>
  <p className="profile-private">{L('Perfil privado · identidad ficticia','Private profile · fictional identity')}</p>
 </section>;
}
