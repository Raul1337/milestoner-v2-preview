import {draftStep} from './model.js';

// Independent review history. No application route, Miles history entry or domain state is changed.
export function createOnboardingNavigation(win,fallback,onChange,resolve=step=>step){
 let current=resolve(draftStep(win.location.hash.slice(1),fallback));
 const url=step=>win.location.pathname+win.location.search+'#'+step;
 if(win.location.hash!=='#'+current)win.history.replaceState(null,'',url(current));
 function changed(){const next=resolve(draftStep(win.location.hash.slice(1)));if(win.location.hash!=='#'+next)win.history.replaceState(null,'',url(next));if(next!==current){current=next;onChange(current)}}
 win.addEventListener('popstate',changed);win.addEventListener('hashchange',changed);
 return {go(value){const next=resolve(draftStep(value));if(next===current)return;win.history.pushState(null,'',url(next));current=next;onChange(next)},destroy(){win.removeEventListener('popstate',changed);win.removeEventListener('hashchange',changed)}};
}
