import {discoveryResults} from './catalog.js';

// Authored browsing order only, never a recommendation or a saved-interest ranking.
export const INITIAL_DISCOVERY_IDS=Object.freeze([
 'health','physical-activity','technology','learning','reading','music','photography',
 'cinema','travel-experiences','nature','cooking','pets','personal-finance','relationships','creativity'
]);
export function capsuleView(options,selected,{query='',selectedOnly=false,expanded=false}={}){
 const first=INITIAL_DISCOVERY_IDS.map(id=>options.find(i=>i.id===id)).filter(Boolean);
 const ordered=[...first,...options.filter(i=>!INITIAL_DISCOVERY_IDS.includes(i.id))];
 const filtered=discoveryResults(ordered,selected,{query,selectedOnly});
 const browsing=!query.trim()&&!selectedOnly;
 const visible=browsing&&!expanded?filtered.filter(i=>INITIAL_DISCOVERY_IDS.includes(i.id)||i.custom):filtered;
 return {visible,browsing,total:filtered.length,catalogVisible:visible.filter(i=>!i.custom).length};
}
