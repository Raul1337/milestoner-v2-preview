import React,{createContext,useContext,useState} from 'react';
import {createProfileStore} from './profile-model';
import {useLanguage} from './language';
const Context=createContext(null);
export function DemoProfileProvider({children}){
 const [store]=useState(()=>{let storage;try{storage=localStorage}catch{}return createProfileStore(storage)});
 const [profile,setProfile]=useState(()=>store.read()),[status,setStatus]=useState(null);
 function save(input){const result=store.save(input);if(result.ok){setProfile(result.profile);setStatus(result.persisted?'saved':'session')}return result}
 return <Context.Provider value={{profile,save,status,clearStatus:()=>setStatus(null)}}>{children}</Context.Provider>;
}
export const useDemoProfile=()=>useContext(Context);
export function ProfileSaveStatus(){
 const {status}=useDemoProfile(),{language}=useLanguage();if(!status)return null;
 const session=status==='session';
 return <p className={'profile-save-status'+(session?' is-session':'')} role={session?'alert':'status'}>{language==='en'?(session?'Applied for this visit only. This browser could not save your profile; reloading may lose these changes. You can retry Save.':'Demo profile saved in this browser.'):(session?'Aplicado solo a esta visita. Este navegador no pudo guardar el perfil; al recargar puedes perder estos cambios. Puedes volver a intentar Guardar.':'Perfil de demo guardado en este navegador.')}</p>;
}
