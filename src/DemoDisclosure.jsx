import React from 'react';
import {useLanguage} from './language';
import ContextualInfo from './ContextualInfo';

// Each entry describes a different store. Never substitute a universal disclaimer.
export const demoDisclosures={
 app:{es:{title:'Sobre esta demo local',label:'Demo local · sin IA',text:'Sólo usa datos de ejemplo y no conecta servicios. Los proyectos se guardan en este navegador al confirmarlos. No hay sincronización entre dispositivos.'},en:{title:'About this local demo',label:'Local demo · no AI',text:'It uses example data only and does not connect services. Projects are saved in this browser when you confirm them. There is no synchronization between devices.'}},
 onboarding:{es:{title:'Tu borrador de exploración',label:'Borrador temporal · sin cuenta',text:'Este prototipo aislado conserva el borrador en la sesión de esta pestaña. No se aplica a tu perfil, intereses ni proyectos guardados. No usa IA ni servicios conectados.'},en:{title:'Your exploration draft',label:'Temporary draft · no account',text:'This isolated prototype keeps the draft in this tab’s session. It is not applied to your saved profile, interests or projects. It uses no AI or connected services.'}},
 account:{es:{title:'Sobre esta simulación de Cuenta',label:'Cuenta simulada · sin Sync',text:'Usa identidades ficticias, sin abrir Apple o Google ni pedir credenciales. La sesión es ficticia; la asociación debe comprobarse de nuevo al recargar. No hay conexión real, respaldo ni Sync.'},en:{title:'About this Account simulation',label:'Simulated account · no Sync',text:'It uses fictional identities without opening Apple or Google or requesting credentials. The session is fictional; association must be checked again after reload. There is no real connection, backup or Sync.'}}
};
export default function DemoDisclosure({scope}){
 const {language}=useLanguage(),temporary=scope==='app'&&import.meta.env.BASE_URL.endsWith('/theme-playground/');
 const copy=temporary?(language==='en'?{title:'About this visual exploration',label:'Visual exploration · temporary',text:'Example changes last only during this exploration. They are not saved to the regular app and do not connect services. No AI or synchronization.'}:{title:'Sobre esta exploración visual',label:'Exploración visual · temporal',text:'Los cambios de ejemplo sólo duran durante esta exploración. No se guardan en la app habitual ni conectan servicios. Sin IA ni sincronización.'}):demoDisclosures[scope][language];
 return <div className="contextual-info-line contextual-demo-note" data-demo-scope={scope}><span>{copy.label}</span><ContextualInfo title={copy.title}><p>{copy.text}</p></ContextualInfo></div>;
}
