// URL/history state only. Demo records and localStorage are deliberately not involved.
export const MILES_ENTRY='milestonerMilesOverlay';
export function backgroundRoute(value){return /^(home|discover|progress|you(?:\/(?:profile(?:\/edit)?|badges(?:\/featured)?|settings|edit|expanded|interest\/[A-Za-z0-9-]+))?|agenda(?:\/\d{4}-\d{2}-\d{2}(?:\/[A-Za-z0-9-]+)?)?|project\/[A-Za-z0-9-]+)$/.test(value||'')?value:'home'}
export function navigationView(location,history){const hash=location.hash.slice(1);return hash==='miles'?{route:backgroundRoute(history.state?.[MILES_ENTRY]?.background),open:true}:{route:hash||'home',open:false}}
export function createMilesNavigation(win,onChange,requestDiscard,profileGuard=()=>null){
 let view=navigationView(win.location,win.history),closing=false,afterClose=null;
 function url(hash){return win.location.pathname+win.location.search+'#'+hash}
 function push(){win.history.pushState({...win.history.state,[MILES_ENTRY]:{background:view.route}},'',url('miles'))}
 // A bookmark gets a safe Home entry to close back to. Refresh reuses its existing entry.
 if(view.open&&!win.history.state?.[MILES_ENTRY]){win.history.replaceState(win.history.state,'',url('home'));push()}
 function publish(next){view=next;onChange(next)}
 function close(after){if(!view.open){after?.();return}if(closing)return;closing=true;afterClose=after;win.history.back()}
 function changed(){
  const next=navigationView(win.location,win.history);
  if(next.open&&!view.open&&!win.history.state?.[MILES_ENTRY]){next.route=backgroundRoute(view.route);win.history.replaceState({...win.history.state,[MILES_ENTRY]:{background:next.route}},'',url('miles'))}
  if(view.open&&!next.open&&!closing){push();requestDiscard(()=>close());return}
  // One active editor guard. Profile permits Miles over its intact draft;
  // modal editors prevent a second modal and protect route departures.
  const guard=profileGuard();
  if(!view.open&&guard?.blockMiles&&(next.route!==view.route||next.open)&&!guard.isDirty())guard.leave?.();
  if(!view.open&&(view.route==='you/profile/edit'||guard?.blockMiles)&&(next.route!==view.route||next.open&&guard?.blockMiles)&&guard?.isDirty()){
   const destination=win.location.hash.slice(1),destinationState=win.history.state;
   win.history.pushState(null,'',url(view.route));
   guard.request(()=>{win.history.pushState(destinationState,'',url(destination));publish(next)});
   return;
  }
  if(next.open===view.open&&next.route===view.route)return;
  const done=closing&&!next.open;closing=false;publish(next);
  if(done){const action=afterClose;afterClose=null;action?.()}
 }
 win.addEventListener('popstate',changed);win.addEventListener('hashchange',changed);
 return {open(){if(view.open)return;push();publish({...view,open:true})},close,destroy(){win.removeEventListener('popstate',changed);win.removeEventListener('hashchange',changed)}};
}
