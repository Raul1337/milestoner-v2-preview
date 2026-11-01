import React,{useEffect,useRef,useState} from 'react';
import {Palette,LockKeyhole,Award,Compass,ChevronRight} from 'lucide-react';
import {useLanguage} from './language';
import {useDemoProfile,ProfileSaveStatus} from './DemoProfile';
import {AVATAR_OPTIONS,PROFILE_LIMITS} from './profile-model';
import IllustratedAvatar from './IllustratedAvatar';
import CompactDialog from './CompactDialog';
import './profile-edit.css';

export default function EditProfile({headingRef,navigationGuard}){
 const {language}=useLanguage(),L=(es,en)=>language==='en'?en:es;
 const {profile,save,clearStatus}=useDemoProfile();
 const [draft,setDraft]=useState(()=>({...profile})),[errors,setErrors]=useState({}),[customizing,setCustomizing]=useState(false),[discard,setDiscard]=useState(false);
 const dirty=useRef(false),pending=useRef(),form=useRef(),customizeButton=useRef(),waitingDialog=useRef();
 dirty.current=JSON.stringify(draft)!==JSON.stringify(profile);
 useEffect(()=>{
  function request(action){pending.current=action;const other=document.querySelector('dialog[open]');if(other){const open=()=>{waitingDialog.current=null;setDiscard(true)};waitingDialog.current={other,open};other.addEventListener('close',open,{once:true})}else setDiscard(true)}
  const guard={isDirty:()=>dirty.current,request};navigationGuard.current=guard;
  function unload(e){if(dirty.current){e.preventDefault();e.returnValue=''}}
  window.addEventListener('beforeunload',unload);
  return()=>{if(navigationGuard.current===guard)navigationGuard.current=null;window.removeEventListener('beforeunload',unload);if(waitingDialog.current){const {other,open}=waitingDialog.current;other.removeEventListener('close',open)}};
 },[navigationGuard]);
 function change(field,value){setDraft(d=>({...d,[field]:value}));setErrors(e=>({...e,[field]:undefined}));clearStatus()}
 function submit(e){
  e.preventDefault();const result=save(draft);
  if(!result.ok){setErrors(result.errors);const field=Object.keys(result.errors)[0];form.current?.elements.namedItem(field)?.focus();return}
  dirty.current=false;setDraft(result.profile);setErrors({});if(result.persisted)location.hash='you/profile';
 }
 function keepEditing(){pending.current=null;setDiscard(false)}
 function leave(){const action=pending.current;pending.current=null;dirty.current=false;setDraft({...profile});setDiscard(false);action?.()}
 return <article className="profile-editor">
  <header className="profile-editor-header"><a href="#you/profile">{L('Cancelar','Cancel')}</a><h1 ref={headingRef} tabIndex={-1}>{L('Editar perfil','Edit Profile')}</h1><button type="submit" form="profile-edit-form" className="primary">{L('Guardar','Save')}</button></header>
  <ProfileSaveStatus/>
  <form id="profile-edit-form" ref={form} noValidate onSubmit={submit}>
   <div className="profile-editor-layout">
    <section className="profile-editor-avatar" aria-label={L('Avatar ilustrado','Illustrated avatar')}>
     <div className="profile-portrait"><IllustratedAvatar appearance={draft.avatar}/></div>
     <button ref={customizeButton} type="button" className="profile-edit-link" aria-expanded={customizing} aria-controls="profile-avatar-options" onClick={()=>setCustomizing(v=>!v)}><Palette size={17} aria-hidden="true"/>{L('Personalizar avatar','Customize avatar')}</button>
     {customizing&&<fieldset id="profile-avatar-options" className="profile-avatar-options" onKeyDown={e=>{if(e.key==='Escape'){e.preventDefault();setCustomizing(false);customizeButton.current?.focus()}}}><legend>{L('Apariencia','Appearance')}</legend><div>{AVATAR_OPTIONS.map(a=><label key={a.id} className={draft.avatar===a.id?'selected':''}><input type="radio" name="avatar" value={a.id} checked={draft.avatar===a.id} onChange={()=>change('avatar',a.id)}/><IllustratedAvatar appearance={a.id}/><span>{language==='en'?a.en:a.es}</span></label>)}</div></fieldset>}
     <p className="profile-editor-hint">{L('Ilustraciones de demo. Sin fotos ni procesamiento de imágenes.','Demo illustrations. No photos or image processing.')}</p>
    </section>
    <div className="profile-editor-cards">
     <section className="profile-editor-card" aria-labelledby="profile-basic-title"><h2 id="profile-basic-title">{L('Información básica','Basic Information')}</h2>
      <label htmlFor="profile-display-name">{L('Nombre','Name')}</label><input id="profile-display-name" name="displayName" autoComplete="off" maxLength={PROFILE_LIMITS.displayName} value={draft.displayName} onChange={e=>change('displayName',e.target.value)} aria-invalid={!!errors.displayName} aria-describedby={errors.displayName?'profile-name-error':undefined}/>
      {errors.displayName&&<p id="profile-name-error" className="profile-field-error" role="alert">{L('Escribe un nombre de 1 a 50 caracteres.','Enter a name from 1 to 50 characters.')}</p>}
      <label htmlFor="profile-username">{L('Alias (opcional)','Username (optional)')}</label><input id="profile-username" name="username" autoComplete="off" autoCapitalize="none" spellCheck={false} maxLength={PROFILE_LIMITS.username+1} value={draft.username} onChange={e=>change('username',e.target.value)} aria-invalid={!!errors.username} aria-describedby={'profile-username-hint'+(errors.username?' profile-username-error':'')}/>
      <p id="profile-username-hint" className="profile-editor-hint">{L('Alias local de demo; no es una cuenta pública.','Local demo alias; not a public account.')}</p>
      {errors.username&&<p id="profile-username-error" className="profile-field-error" role="alert">{L('Usa hasta 24 letras A–Z, números, guiones, puntos o guion bajo; empieza con letra, número o guion bajo.','Use up to 24 A–Z letters, numbers, hyphens, dots or underscores; start with a letter, number or underscore.')}</p>}
      <label htmlFor="profile-bio">{L('Biografía (opcional)','Bio (optional)')}</label><textarea id="profile-bio" name="bio" rows={4} maxLength={PROFILE_LIMITS.bio} value={draft.bio} onChange={e=>change('bio',e.target.value)} aria-invalid={!!errors.bio} aria-describedby={'profile-bio-counter'+(errors.bio?' profile-bio-error':'')}/><p id="profile-bio-counter" className="profile-bio-counter">{draft.bio.length}/{PROFILE_LIMITS.bio}</p>
      {errors.bio&&<p id="profile-bio-error" className="profile-field-error" role="alert">{L('La biografía admite hasta 160 caracteres.','Bio supports up to 160 characters.')}</p>}
      <p className="profile-editor-hint">{L('Usa solo datos ficticios. Los cambios se aplican al guardar.','Use fictional data only. Changes apply when you save.')}</p>
     </section>
     <section className="profile-editor-card profile-editor-info" aria-labelledby="profile-privacy-title"><LockKeyhole size={22} aria-hidden="true"/><div><h2 id="profile-privacy-title">{L('Privacidad del perfil','Profile Privacy')}</h2><p>{L('Perfil local de demo, sin publicación ni control de acceso real.','Local demo profile, with no publishing or real access control.')}</p></div><span>{L('Privado','Private')}</span></section>
     <section className="profile-editor-card profile-editor-info" aria-labelledby="profile-edit-badges-title"><Award size={22} aria-hidden="true"/><div><h2 id="profile-edit-badges-title">{L('Insignias destacadas','Featured Badges')}</h2><p>{L('Las insignias obtenidas aún no están disponibles en esta demo.','Earned badges are not yet available in this demo.')}</p></div></section>
     <section className="profile-editor-card"><h2>{L('Acceso rápido','Quick Link')}</h2><a className="profile-editor-universe" href="#you"><Compass size={22} aria-hidden="true"/><span>{L('Abrir Universo de intereses','Open Interest Universe')}<small>{L('Ver o gestionar tus intereses','View or manage your interests')}</small></span><ChevronRight size={17} aria-hidden="true"/></a></section>
    </div>
   </div>
  </form>
  {discard&&<CompactDialog title={L('¿Descartar los cambios del perfil?','Discard profile changes?')} onClose={keepEditing}><p>{L('Los cambios sin guardar se perderán. Tu perfil guardado y tu actividad se conservarán.','Unsaved changes will be lost. Your saved profile and activity will be kept.')}</p><div className="compact-dialog-actions"><button type="button" className="primary" onClick={leave}>{L('Descartar y salir','Discard and leave')}</button><button type="button" className="text-button" onClick={keepEditing}>{L('Seguir editando','Keep editing')}</button></div></CompactDialog>}
 </article>;
}
