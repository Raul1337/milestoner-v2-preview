import {allowedAccountRoute} from './model.js';
export function accountReviewLinks(base,language,appearance){
 const lang=language==='en'?'en':'es',query='?lang='+lang+(['light','dark'].includes(appearance)?'&appearance='+appearance:'');
 return {account:base+'review/account/'+query,onboarding:base+'review/onboarding/'+query,local:base+'?lang='+lang+'#home'};
}
export function createAccountNavigation(win,getState,onChange,onLeave=()=>{}){
 const read=()=>win.location.hash.slice(1)||'account',url=route=>win.location.pathname+win.location.search+'#'+route;
 let current=allowedAccountRoute(read(),getState());if(win.location.hash!=='#'+current)win.history.replaceState(null,'',url(current));
 function change(requested,push=false){
  if(requested!==current)onLeave(current,requested);
  const next=allowedAccountRoute(requested,getState());
  if(push&&next!==current)win.history.pushState(null,'',url(next));else if(win.location.hash!=='#'+next)win.history.replaceState(null,'',url(next));
  if(next!==current){const previous=current;current=next;onChange(next,previous)}
 }
 const changed=()=>change(read());win.addEventListener('hashchange',changed);win.addEventListener('popstate',changed);
 return {go:route=>change(route,true),reconcile:()=>change(read()),destroy(){win.removeEventListener('hashchange',changed);win.removeEventListener('popstate',changed)}};
}
