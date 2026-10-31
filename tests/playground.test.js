import test from 'node:test';
import assert from 'node:assert/strict';
import {themes,themeTokens,contrastReport,contrast,normalizeSettings,rgb} from '../theme-playground/themes.js';

test('contrast calculation uses WCAG relative luminance reference pairs',()=>{
 assert.equal(contrast('#000000','#FFFFFF'),21);
 assert.equal(contrast('#FFFFFF','#FFFFFF'),1);
 assert.ok(Math.abs(contrast('#777777','#FFFFFF')-4.478)<.002);
});
test('all five atmospheres keep readable semantic text and controls across the intensity range',()=>{
 for(const theme of themes)for(let intensity=0;intensity<=100;intensity+=5)for(const more of [false,true]){
  const r=contrastReport(theme,intensity,more);
  assert.ok(r.minimumText>=4.5,`${theme.id} ${intensity}: text ${r.minimumText}`);
  assert.ok(r.action>=4.5,`${theme.id}: action text`);
  assert.ok(r.focus>=3,`${theme.id}: focus`);
  assert.ok(r.boundary>=3,`${theme.id}: input boundary`);
 }
});
test('directions differ in canvas and surfaces, not only in accents, and mix numbered sources',()=>{
 assert.deepEqual(themes.map(t=>t.name),['Electric Night','Ember Glow','Emerald Night','Copper Night','Velvet Dusk']);
 for(const theme of themes)assert.ok(new Set(theme.colors.map(c=>c[2])).size>=3);
 for(let a=0;a<themes.length;a++)for(let b=a+1;b<themes.length;b++){
  const ta=themeTokens(themes[a]),tb=themeTokens(themes[b]);
  assert.notEqual(ta['--lab-atmosphere'],tb['--lab-atmosphere']);
  const va=rgb(ta['--surface']),vb=rgb(tb['--surface']);
  assert.ok(Math.hypot(...va.map((v,i)=>v-vb[i]))>20,`${themes[a].id}/${themes[b].id}: surface separation`);
 }
});
test('preview URLs accept only known settings and clamp intensity',()=>{
 assert.deepEqual(normalizeSettings({theme:'unknown',screen:'<script>',appearance:'system',intensity:'bad'}),normalizeSettings());
 assert.equal(normalizeSettings({intensity:500}).intensity,100);
 assert.equal(normalizeSettings({intensity:-40}).intensity,0);
 assert.equal(normalizeSettings({appearance:'light',contrast:'more',motion:'reduce'}).appearance,'light');
});
