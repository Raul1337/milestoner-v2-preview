import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {backgrounds,backgroundTokens,normalizeSettings,resolveAppearance,contrastReport} from '../theme-playground/themes.js';
import {approvedCategories,contrast} from '../theme-playground/native-palette.js';
const css=readFileSync(new URL('../src/tokens.css',import.meta.url),'utf8');
const parse=s=>Object.fromEntries([...s.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map(m=>[m[1],m[2]]));
const light=parse(css.split('@media')[0]),dark={...light,...parse(css.split('@media (prefers-color-scheme: dark) {')[1].split('/* Re-evaluate')[0])};
const baseline={light,dark};
test('approved native inks, graphics and tiles remain frozen in Light/Dark',()=>{
 const expected={fitness:['#00734C','#2AE9AB','#009B6A','#2AE9AB','#D8FAEB','#123F34'],learning:['#7436C9','#C197FF','#8C44E8','#B77CFF','#F0E4FF','#3C285C'],career:['#005EC9','#65B4FF','#0079F2','#48A8FF','#E0EFFF','#163D64'],social:['#B52C4E','#FF8AA0','#E44365','#FF6C89','#FFE5EB','#512936'],finance:['#805300','#FFD447','#AE7900','#F6C638','#FFF0C6','#473B20'],wellbeing:['#A1480A','#FFAC66','#C96812','#FF9D47','#FFEAD8','#4B3326']};
 for(const [id,p] of Object.entries(expected)){const c=approvedCategories[id];assert.deepEqual([c.light.ink,c.dark.ink,c.light.graphic,c.dark.graphic,c.light.tile,c.dark.tile],p)}
});
test('all backgrounds and accessibility fallbacks preserve category identities and existing travel tokens',()=>{
 for(const appearance of ['light','dark'])for(const background of backgrounds.filter(b=>b.appearance===appearance))for(const more of [false,true])for(const opaque of [false,true]){
  const v=backgroundTokens(background,baseline[appearance],more,opaque);
  for(const [id,c] of Object.entries(approvedCategories))for(const [role,key] of [['ink','ink'],['accent','graphic'],['edge','ink'],['tint','tile']])assert.equal(v[`--${id}-${role}`],c[appearance][key]);
  for(const key of Object.keys(baseline[appearance]).filter(k=>k.startsWith('--travel-')))assert.equal(v[key],baseline[appearance][key]);
 }
});
test('neutral text, actions and native icons meet their contrast thresholds',()=>{
 assert.equal(contrast('#000000','#FFFFFF'),21);
 for(const b of backgrounds)for(const more of [false,true]){
  const v=backgroundTokens(b,baseline[b.appearance],more),r=contrastReport(v);assert.ok(r.minimumText>=4.5,`${b.id}: text ${r.minimumText}`);assert.ok(r.action>=4.5,`${b.id}: action ${r.action}`);
  for(const bg of b.colors)assert.ok(contrast(v['--action'],bg)>=4.5,`${b.id}: action on canvas`);
  for(const c of Object.values(approvedCategories)){const p=c[b.appearance];assert.ok(contrast(p.graphic,p.tile)>=3,c.id);assert.ok(contrast(p.ink,p.tile)>=4.5,c.id)}
 }
});
test('system appearance resolves both branches and invalid URLs fall back safely',()=>{
 assert.equal(resolveAppearance('system',true),'dark');assert.equal(resolveAppearance('system',false),'light');assert.equal(resolveAppearance('light',true),'light');assert.equal(resolveAppearance('dark',false),'dark');
 assert.deepEqual(normalizeSettings({appearance:'unknown',lightBackground:'electric',darkBackground:'ember',screen:'<script>'}),normalizeSettings());
 assert.equal(backgrounds.filter(b=>b.appearance==='light').length,5);assert.equal(backgrounds.filter(b=>b.appearance==='dark').length,2);
 assert.equal(new Set(backgrounds.map(b=>b.colors.join())).size,7);
});
