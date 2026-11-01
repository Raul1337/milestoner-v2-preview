import {progressReport} from './progress-model.js';

// Fixed fictional identity, not an account or a new persistence contract.
export const DEMO_PROFILE={name:'Alex Rivera',handle:'@alex.demo'};
// Keep the existing Profile period/eligibility and original record/project identities.
export function profileActivity(state){
 return progressReport(state,'all','year').rows.slice(0,3).map(entry=>({entry,project:state.projects.find(p=>p.id===entry.project)}));
}
