import React, {cloneElement, useEffect, useId, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {Home, Compass, ChartNoAxesCombined, User, X, PanelLeftOpen, PanelLeftClose} from 'lucide-react';
import {useLanguage} from './language';

export function Brand() {
  return <picture className="brand-art"><source media="(prefers-color-scheme: dark)" srcSet={`${import.meta.env.BASE_URL}brand-dark.svg`}/><img src={`${import.meta.env.BASE_URL}brand.svg`} alt="Milestoner"/></picture>;
}
export function MPlus() {
  return <span className="mplus-button"><img src={`${import.meta.env.BASE_URL}m-plus-white.svg`} alt=""/></span>;
}
// Portals keep hints readable outside the narrow, scrollable sidebar.
function Hint({label, enabled, children}) {
  const id=useId(),hideTimer=useRef(),focused=useRef(false);
  const [position,setPosition]=useState(null);
  function dismiss(){clearTimeout(hideTimer.current);setPosition(null)}
  function show(event){
    if(!enabled)return;
    clearTimeout(hideTimer.current);
    const rect=event.currentTarget.getBoundingClientRect();
    setPosition({left:rect.right+12,top:Math.max(28,Math.min(innerHeight-28,rect.top+rect.height/2))});
  }
  function leave(){if(!focused.current)hideTimer.current=setTimeout(()=>setPosition(null),120)}
  useEffect(()=>{
    if(!position)return;
    const key=e=>{if(e.key==='Escape')dismiss()};
    window.addEventListener('keydown',key);
    window.addEventListener('resize',dismiss);
    window.addEventListener('scroll',dismiss,true);
    return()=>{window.removeEventListener('keydown',key);window.removeEventListener('resize',dismiss);window.removeEventListener('scroll',dismiss,true)};
  },[position]);
  useEffect(()=>()=>clearTimeout(hideTimer.current),[]);
  return <>{cloneElement(children,{
    'aria-describedby':enabled&&position?id:undefined,
    onMouseEnter:show,onMouseLeave:leave,
    onFocus:e=>{focused.current=true;show(e)},
    onBlur:()=>{focused.current=false;dismiss()},
    onClick:e=>{dismiss();children.props.onClick?.(e)}
  })}{enabled&&position&&createPortal(<span id={id} role="tooltip" className="navigation-tooltip" style={position} onMouseEnter={()=>clearTimeout(hideTimer.current)} onMouseLeave={leave}>{label}</span>,document.body)}</>;
}
function Links({active, onNavigate, onMiles, collapsed=false, id}) {
  const {t}=useLanguage();
  return <nav id={id} aria-label={t('Navegación principal')}>{[['home','Home',Home],['discover','Discover',Compass],['miles','M+ · Miles',null],['progress','Progress',ChartNoAxesCombined],['you','You',User]].map(([route,label,Icon])=><Hint key={route} label={t(label)} enabled={collapsed}><a href={`#${route}`} onClick={e=>{if(route==='miles'&&onMiles){e.preventDefault();onMiles()}else onNavigate?.(e)}} aria-label={t(label)} className={`${active===route?'selected':''} ${route==='miles'?'miles-nav':''}`} aria-current={active===route?'page':undefined}>{Icon?<Icon size={22} aria-hidden="true"/>:<MPlus/>}<span className="nav-label">{t(label)}</span></a></Hint>)}</nav>;
}
export function Navigation({active,open,setOpen,menuRef,expanded,onToggle,onMiles}) {
  const {t}=useLanguage();
  const dialog=useRef(),timer=useRef(),destination=useRef('menu'),afterClose=useRef();
  const [visible,setVisible]=useState(false);
  function finish() {
    dialog.current?.close();setOpen(false);
    const target=afterClose.current?document.querySelector('.header-miles'):destination.current==='content'?document.getElementById('main'):menuRef.current;
    target?.focus({preventScroll:true});const done=afterClose.current;afterClose.current=null;done?.();
  }
  function close(to='menu',after) {
    if(timer.current)return;
    destination.current=to;afterClose.current=after;setVisible(false);
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
  return <><aside className="sidebar desktop-sidebar" aria-label={t('Navegación de escritorio')}>
      <a href="#home" className="brand" aria-label={`Milestoner · ${t('Home')}`}>{expanded?<Brand/>:<picture className="compact-brand"><source media="(prefers-color-scheme: dark)" srcSet={`${import.meta.env.BASE_URL}m-plus-dark.svg`}/><img src={`${import.meta.env.BASE_URL}m-plus.svg`} alt="Milestoner"/></picture>}</a>
      <Hint label={t(expanded?'Contraer navegación':'Expandir navegación')} enabled={!expanded}><button className="sidebar-toggle" aria-label={t(expanded?'Contraer navegación':'Expandir navegación')} aria-expanded={expanded} aria-controls="desktop-navigation" onClick={onToggle}>{expanded?<PanelLeftClose size={22} aria-hidden="true"/>:<PanelLeftOpen size={22} aria-hidden="true"/>}<span className="nav-label">{t('Contraer navegación')}</span></button></Hint>
      <Links onMiles={onMiles} id="desktop-navigation" active={active} collapsed={!expanded}/>
      {expanded&&<p className="sidebar-caption">Vision V2 · {t('Solo datos ficticios')}</p>}
    </aside>
    <dialog ref={dialog} id="mobile-navigation" className={`navigation-drawer ${visible?'is-visible':''}`} aria-label={t('Menú de navegación')} onKeyDown={e=>{
        if(e.key!=='Tab')return;
        const items=[...e.currentTarget.querySelectorAll('a[href],button:not(:disabled)')];
        const first=items[0],last=items[items.length-1];
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}
        else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}
      }} onCancel={e=>{e.preventDefault();close()}} onClick={e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close()}}}>
      <div className="drawer-heading"><Brand/><button className="icon-button" autoFocus aria-label={t('Cerrar menú')} onClick={()=>close()}><X/></button></div>
      <Links active={active} onNavigate={()=>close('content')} onMiles={()=>close('content',onMiles)}/><p className="sidebar-caption">Vision V2 · {t('Solo datos ficticios')}</p>
    </dialog></>;
}
