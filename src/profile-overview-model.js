import {progressReport} from './progress-model.js';

// Fictional default identity; not a real account. Profile editing is stored separately.
export const DEMO_PROFILE={name:'Alex Rivera',handle:'@alex.demo'};
// Keep the existing Profile period/eligibility and original record/project identities.
export function profileActivity(state){
 return progressReport(state,'all','year').rows.slice(0,3).map(entry=>({entry,project:state.projects.find(p=>p.id===entry.project)}));
}
