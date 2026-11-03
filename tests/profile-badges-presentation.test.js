import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {createRequire} from 'node:module';
import {BADGE_CATALOG,badgeText} from '../src/badges-model.js';
import {initialProfile,PROFILE_KEY} from '../src/profile-model.js';

const DEFAULT_PROFILE=initialProfile();

// Render actual components: preserve hooks/providers, but never run browser effects.
const bundled=await build({stdin:{resolveDir:process.cwd(),loader:'jsx',contents:`
 import React from 'react';
 import {renderToStaticMarkup} from 'react-dom/server';
 import {LanguageProvider} from './src/language.jsx';
 import {DemoProfileProvider} from './src/DemoProfile.jsx';
 import ProfileOverview from './src/ProfileOverview.jsx';
 import Badges from './src/Badges.jsx';
 import {initial} from './src/model.js';
 import {PROFILE_KEY} from './src/profile-model.js';
 export function render(screen,language,profile,empty){
  const keys=['location','localStorage','matchMedia'],saved=keys.map(k=>Object.getOwnPropertyDescriptor(globalThis,k));
  const state=initial();if(empty)state.logs=[];const before=JSON.stringify(state),writes=[];
  Object.defineProperty(globalThis,'location',{configurable:true,value:{search:'?lang='+language}});
  Object.defineProperty(globalThis,'matchMedia',{configurable:true,value:()=>({matches:false})});
  Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem:k=>k===PROFILE_KEY?JSON.stringify(profile):null,setItem:(...args)=>writes.push(args)}});
  try{
   const html=renderToStaticMarkup(<LanguageProvider><DemoProfileProvider>{screen==='profile'?<ProfileOverview state={state} onOpenProject={()=>{}}/>:<Badges route={screen==='featured'?'you/badges/featured':'you/badges'}/>}</DemoProfileProvider></LanguageProvider>);
   if(before!==JSON.stringify(state)||writes.length)throw Error('Presentation changed saved data');return html;
  }finally{keys.forEach((k,i)=>{if(saved[i])Object.defineProperty(globalThis,k,saved[i]);else delete globalThis[k]})}
 }
`},bundle:true,platform:'node',format:'cjs',packages:'external',write:false,plugins:[{name:'styles-only',setup(b){b.onLoad({filter:/\.css$/},()=>({contents:'',loader:'text'}))}}]});
const mod={exports:{}};new Function('require','module','exports',bundled.outputFiles[0].text)(createRequire(import.meta.url),mod,mod.exports);
const render=(screen,lang='en',profile=DEFAULT_PROFILE,empty=false)=>mod.exports.render(screen,lang,profile,empty);

test('Profile presents eligible activity immediately after identity, without consecutive achievement placeholders',()=>{
 for(const lang of ['en','es']){
  const html=render('profile',lang),activity=html.indexOf('id="profile-activity-title"');
  assert.ok(activity>html.indexOf('class="profile-hero"'));
  assert.ok(activity<html.indexOf('href="#you/badges"'));
  assert.ok(activity<html.indexOf('class="profile-information'));
  assert.equal((html.match(/class="profile-activity-row"/g)||[]).length,3);
  assert.doesNotMatch(html,/<dl|<dd|profile-statistics|profile-domains-title|profile-badges-title/);
  assert.match(html,lang==='en'?/Illustrative examples · none featured/:/Ejemplos ilustrativos · sin destacadas/);
  for(const href of ['#you/profile/edit','#you/badges','#progress','#you','#you/settings'])assert.ok(html.includes('href="'+href+'"'));
 }
});

test('empty Profile activity is truthful, without metrics, awards or invented highlights',()=>{
 for(const lang of ['en','es']){
  const html=render('profile',lang,DEFAULT_PROFILE,true);
  assert.match(html,lang==='en'?/No activity records are available yet\./:/Todavía no hay registros de actividad disponibles\./);
  assert.doesNotMatch(html,/class="profile-activity-row"|<dl|<dd/);
  assert.equal((html.match(/class="profile-unavailable"/g)||[]).length,1);
  assert.match(html,lang==='en'?/does not calculate consistency, XP, levels/:/no calcula consistencia, XP, niveles/);
 }
});

test('Badges puts one illustrative notice and working filters before the unchanged eight-card collection',()=>{
 for(const lang of ['en','es']){
  const html=render('badges',lang),notice=html.indexOf('class="badges-notice'),filters=html.indexOf('class="badges-filters"'),grid=html.indexOf('class="badge-grid"');
  assert.ok(html.indexOf('class="profile-identity-summary"')<notice&&notice<filters&&filters<grid);
  assert.equal((html.match(/class="badge-card"/g)||[]).length,8);
  for(const badge of BADGE_CATALOG){assert.ok(html.includes(badgeText(badge,'name',lang)));assert.ok(html.includes(badgeText(badge,'description',lang)))}
  assert.match(html,/<a href="#you\/badges" aria-current="page">/);
  assert.match(html,/<a href="#you\/badges\/featured">/);
  assert.match(html,lang==='en'?/Illustrative catalog · not earned badges/:/Catálogo ilustrativo · no son insignias obtenidas/);
  assert.doesNotMatch(html,/<dl|<dd|badges-intro|badges-summary|badge-example|Small symbols|Pequeños símbolos|href="#you\/badges\/milestones"/);
 }
});

test('Featured remains empty with explicit explanation and navigation, never a selectable catalog',()=>{
 for(const lang of ['en','es']){
  const html=render('featured',lang);
  assert.doesNotMatch(html,/class="badge-card"|class="badge-grid"|aria-pressed|checkbox/);
  assert.match(html,/<a href="#you\/badges\/featured" aria-current="page">/);
  assert.match(html,lang==='en'?/No Featured Badges/:/Sin insignias destacadas/);
  assert.match(html,lang==='en'?/Catalog examples cannot be selected/:/Los ejemplos del catálogo no se pueden seleccionar/);
  for(const href of ['#you/badges','#you/profile','#you'])assert.ok(html.includes('href="'+href+'"'));
 }
});

test('shared identity preserves saved avatar, full names, optional alias and bio without a data write',()=>{
 const profile={...DEFAULT_PROFILE,displayName:'A fictional long name '.repeat(2).trim(),username:'example.local',bio:'A private fictional bio.',avatar:'lagoon'};
 for(const screen of ['profile','badges','featured']){
  const html=render(screen,'en',profile);
  assert.equal((html.match(/class="illustrated-avatar"/g)||[]).length,1);
  assert.ok(html.includes(profile.displayName));assert.ok(html.includes('@'+profile.username));
  assert.match(html,/fill="#b6e3da"/);
  assert.equal(html.includes(profile.bio),screen==='profile');
  const noAlias=render(screen,'en',{...profile,username:'',bio:''});assert.doesNotMatch(noAlias,/class="profile-handle"|class="profile-bio"/);
 }
 assert.equal(typeof PROFILE_KEY,'string');
});

test('collection sections, help relationships and links have semantic accessible names',()=>{
 for(const screen of ['profile','badges','featured'])for(const lang of ['en','es']){
  const html=render(screen,lang);
  assert.equal((html.match(/<h1\b/g)||[]).length,1);
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);
  for(const match of html.matchAll(/aria-(?:labelledby|describedby|controls)="([^"]+)"/g))for(const id of match[1].split(' '))assert.ok(ids.includes(id),id);
  assert.match(html,/popover="auto" role="dialog" aria-modal="false"/);
  assert.match(html,/<button[^>]+aria-expanded="false"[^>]+aria-controls="[^"]+"/);
  assert.match(html,lang==='en'?/aria-label="Information:/:/aria-label="Información:/);
  assert.doesNotMatch(html,/<button[^>]*><\/button>|<a[^>]*><\/a>/);
 }
});
