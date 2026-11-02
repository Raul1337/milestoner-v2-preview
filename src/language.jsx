import React,{createContext,useContext,useState,useEffect} from 'react';
import {translate,resolveLanguage,displayContent} from './translations';
import {initial} from './model';
import {formatDateLabel} from './date-presentation';
const original=initial();
const fixtures=new Map([...original.projects,...original.projects.flatMap(p=>p.tasks),...original.events,...original.reminders,...original.logs].map(record=>[record.id,record]));
const LanguageContext=createContext(null);
export function LanguageProvider({children}) {
  const [language,updateLanguage]=useState(()=>resolveLanguage(location.search,navigator.language));
  useEffect(()=>{document.documentElement.lang=language},[language]);
  function setLanguage(value) {
    if(!['es','en'].includes(value))return;
    updateLanguage(value);
    const url=new URL(location.href);url.searchParams.set('lang',value);history.replaceState(null,'',url);
  }
  const locale=language==='en'?'en-US':'es-MX';
  const t=(value,args)=>translate(language,value,args);
  const number=value=>new Intl.NumberFormat(locale,{maximumFractionDigits:1}).format(value);
  const dateLabel=(value,includeYear=false)=>formatDateLabel(value,locale,includeYear);
  return <LanguageContext.Provider value={{language,setLanguage,t,content:(record,field)=>displayContent(language,record,field,fixtures),number,dateLabel}}>{children}</LanguageContext.Provider>;
}
export const useLanguage=()=>useContext(LanguageContext);
