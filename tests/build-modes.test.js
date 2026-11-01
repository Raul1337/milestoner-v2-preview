import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../vite.config.js';
import playground from '../playground.vite.config.js';
import lab from '../card-exploration.vite.config.js';

test('public build ships accepted Home without lab controls; Theme Playground stays isolated',()=>{
 assert.equal(app.define['import.meta.env.VITE_CURRENT_HOME'],'"true"');
 assert.equal(app.define['import.meta.env.VITE_PROJECT_CARD_LAB'],'"false"');
 assert.equal(playground.define['import.meta.env.VITE_CURRENT_HOME'],'"false"');
 assert.equal(playground.define['import.meta.env.VITE_PROJECT_CARD_LAB'],'"false"');
 assert.equal(lab.define['import.meta.env.VITE_PROJECT_CARD_LAB'],'"true"');
 assert.equal(app.base,'/milestoner-v2-preview/');
 assert.equal(playground.base,'/milestoner-v2-preview/theme-playground/');
});
