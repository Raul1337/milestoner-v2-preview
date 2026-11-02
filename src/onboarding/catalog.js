import {initialInterests} from '../interest-model.js';

// Discovery themes only, not canonical Milestoner Domains. Preserve the original twelve
// identities, labels, roles and ordering so existing drafts keep the same reveal order.
const originalGroups=['create','enjoy','learn','taste','move','create','learn','learn','create','explore','enjoy','taste'];
const originalTones=['learning','travel','learning','finance','fitness','learning','finance','travel','learning','travel','finance','fitness'];
export const LEGACY_IDS=Object.freeze(initialInterests().confirmed.map(i=>i.id));
export const DISCOVERY_GROUPS=Object.freeze([
 ['move','Salud y movimiento','Health & movement'],['learn','Ciencia y aprendizaje','Science & learning'],
 ['create','Arte y creatividad','Arts & creativity'],['enjoy','Entretenimiento','Entertainment'],
 ['explore','Naturaleza y viajes','Nature & travel'],['taste','Cocina y cultura','Food & culture'],
 ['everyday','Vida y vínculos','Life & connections'],['build','Finanzas e iniciativas','Finance & enterprise']
].map(([id,es,en])=>Object.freeze({id,name:Object.freeze({es,en})})));
const additions=[
 ['health','Salud','Health','move','fitness'],['wellbeing','Bienestar','Wellbeing','move','warm'],
 ['physical-activity','Actividad física','Physical activity','move','fitness'],['sports','Deportes','Sports','move','fitness'],
 ['science','Ciencia','Science','learn','travel'],['learning','Aprendizaje','Learning','learn','learning'],['history','Historia','History','learn','finance'],
 ['arts','Arte','Art','create','learning'],['writing','Escritura','Writing','create','learning'],['creativity','Creatividad','Creativity','create','learning'],
 ['series','Series','TV series','enjoy','travel'],['gaming','Videojuegos','Gaming','enjoy','learning'],
 ['nature','Naturaleza','Nature','explore','fitness'],['outdoors','Aire libre','Outdoors','explore','fitness'],
 ['gastronomy','Gastronomía','Gastronomy','taste','warm'],['culture','Cultura','Culture','taste','finance'],
 ['pets','Mascotas','Pets','everyday','warm'],['gardening','Jardinería','Gardening','everyday','fitness'],
 ['home','Hogar','Home','everyday','travel'],['relationships','Relaciones','Relationships','everyday','warm'],
 ['personal-projects','Proyectos personales','Personal projects','everyday','learning'],
 ['personal-finance','Finanzas personales','Personal finance','build','finance'],['entrepreneurship','Emprendimiento','Entrepreneurship','build','travel']
];
export const INTEREST_CATALOG=Object.freeze([
 ...initialInterests().confirmed.map((i,index)=>({id:i.id,name:{...i.name},tone:originalTones[index],group:originalGroups[index]})),
 ...additions.map(([id,es,en,group,tone])=>({id,name:{es,en},group,tone}))
].map(i=>Object.freeze({...i,name:Object.freeze(i.name)})));
export function interestLabel(interest,language='es'){return typeof interest.name==='string'?interest.name:interest.name[language]}
export function normalizeInterest(value){return value.normalize('NFKD').replace(/\p{M}/gu,'').toLowerCase().trim().replace(/\s+/gu,' ')}
export function matchesInterest(interest,query){const words=normalizeInterest(query).split(' ').filter(Boolean),names=typeof interest.name==='string'?[interest.name]:Object.values(interest.name);return words.every(word=>names.some(name=>normalizeInterest(name).includes(word)))}

export function discoveryResults(options,selected,{query='',group='all',selectedOnly=false}={}){return options.filter(i=>(!selectedOnly||selected.includes(i.id))&&(group==='all'||i.group===group||(group==='custom'&&i.custom))&&matchesInterest(i,query))}
