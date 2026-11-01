import {initial, TODAY} from './model.js';

// Presentation rules for confirmed, unchanged demo examples only. No new records.
const examples = initial();
function exampleProject(state, id) {
 const original = examples.projects.find(p => p.id === id);
 return state.projects?.find(p => p.id === id && !p.vision && p.domain === original.domain && p.title === original.title);
}
function exampleTask(project, id) {
 const original = examples.projects.flatMap(p => p.tasks).find(t => t.id === id);
 return project?.tasks?.find(t => t.id === id && t.text === original.text);
}
export function selectHomeInsight(state, dismissed = []) {
 if (!['Balanced', 'Proactive'].includes(state.mode)) return null;
 const japan = exampleProject(state, 'japan');
 if (!dismissed.includes('japan-accommodation') &&
     exampleTask(japan, 'jp1')?.done === true && exampleTask(japan, 'jp2')?.done === true &&
     exampleTask(japan, 'jp3')?.done === false) {
  return {id:'japan-accommodation', project:japan,
   reason:'Te falta comparar alojamientos en Kioto.',
   action:'Revisar preparativo'};
 }
 if (state.mode !== 'Proactive' || dismissed.includes('french-practice')) return null;
 const french = exampleProject(state, 'french');
 const hasExamplePractice = state.logs?.some(log => log.project === 'french' && log.date <= TODAY &&
  examples.logs.some(original => original.id === log.id && original.date === log.date &&
   original.value === log.value && original.label === log.label));
 if (exampleTask(french, 'fr1')?.done === false && hasExamplePractice) {
  return {id:'french-practice', project:french,
   reason:'Te queda una práctica de conversación pendiente.',
   action:'Revisar práctica'};
 }
 return null;
}
