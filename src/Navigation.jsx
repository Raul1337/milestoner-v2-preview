import React, {useEffect, useRef, useState} from 'react';
import {Home, Compass, ChartNoAxesCombined, User, X} from 'lucide-react';
import {useLanguage} from './language';

export function Brand() {
  return <picture className="brand-art"><source media="(prefers-color-scheme: dark)" srcSet={`${import.meta.env.BASE_URL}brand-dark.svg`}/><img src={`${import.meta.env.BASE_URL}brand.svg`} alt="Milestoner"/></picture>;
}
export function MPlus() {
  return <span className="mplus-button"><img src={`${import.meta.env.BASE_URL}m-plus-white.svg`} alt=""/></span>;
}
function Links({active, onNavigate}) {
  const {t}=useLanguage();
  return <nav aria-label={t('Navegación principal')}>{[['home','Home',Home],['discover','Discover',Compass],['miles','M+ · Miles',null],['progress','Progress',ChartNoAxesCombined],['you','You',User]].map(([id,label,Icon])=><a key={id} href={`#${id}`} onClick={onNavigate} className={`${active===id?'selected':''} ${id==='miles'?'miles-nav':''}`} aria-current={active===id?'page':undefined}>{Icon?<Icon size={22} aria-hidden="true"/>:<MPlus/>}<span>{t(label)}</span></a>)}</nav>;
}
export function Navigation({active,open,setOpen,menuRef}) {
  const {t}=useLanguage();
  const dialog=useRef(),timer=useRef(),destination=useRef('menu');
  const [visible,setVisible]=useState(false);
  function finish() {
    dialog.current?.close();setOpen(false);
    const target=destination.current==='content'?document.getElementById('main'):menuRef.current;
    target?.focus({preventScroll:true});
  }
  function close(to='menu') {
    if(timer.current)return;
    destination.current=to;setVisible(false);
    timer.current=setTimeout(()=>{timer.current=null;finish()},matchMedia('(prefers-reduced-motion: reduce)').matches?0:180);
  }
  useEffect(()=>{
    if(!open)return;
    const el=dialog.current,previous=document.body.style.overflow;
    el.showModal();document.body.style.overflow='hidden';
    const frame=requestAnimationFrame(()=>setVisible(true));
    const media=matchMedia('(min-width: 901px)');
    const resize=()=>{if(media.matches)close('content')};
    const navigate=()=>close('content');
    media.addEventListener('change',resize);window.addEventListener('hashchange',navigate);
    return()=>{cancelAnimationFrame(frame);clearTimeout(timer.current);timer.current=null;document.body.style.overflow=previous;media.removeEventListener('change',resize);window.removeEventListener('hashchange',navigate);el.close()};
  },[open]);
  return <><aside className="sidebar desktop-sidebar"><a href="#home" className="brand" aria-label={t('Home')}><Brand/></a><Links active={active}/><p className="sidebar-caption">Vision V2 · {t('Solo datos ficticios')}</p></aside>
    <dialog ref={dialog} id="mobile-navigation" className={`navigation-drawer ${visible?'is-visible':''}`} aria-label={t('Menú de navegación')} onKeyDown={e=>{
        if(e.key!=='Tab')return;
        const items=[...e.currentTarget.querySelectorAll('a[href],button:not(:disabled)')];
        const first=items[0],last=items[items.length-1];
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}
        else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}
      }} onCancel={e=>{e.preventDefault();close()}} onClick={e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close()}}}>
      <div className="drawer-heading"><Brand/><button className="icon-button" autoFocus aria-label={t('Cerrar menú')} onClick={()=>close()}><X/></button></div>
      <Links active={active} onNavigate={()=>close('content')}/><p className="sidebar-caption">Vision V2 · {t('Solo datos ficticios')}</p>
    </dialog></>;
}
