import test from 'node:test';
import assert from 'node:assert/strict';
import {stableOverlayHeight} from '../src/overlay-geometry.js';
test('standard mobile sheet uses 78 percent of the usable visual viewport',()=>{
 assert.equal(stableOverlayHeight(844,{mobile:true}),658.32);
 assert.equal(stableOverlayHeight(844,{mobile:true,safeTop:44}),624);
});
test('only explicit expansion requests the full mobile height',()=>{
 assert.equal(stableOverlayHeight(844,{mobile:true,expanded:true}),844);
 assert.equal(stableOverlayHeight(844,{mobile:true,expanded:true,safeTop:44}),800);
 assert.equal(stableOverlayHeight(844,{mobile:true,expanded:false}),658.32);
});
test('desktop height is 680 with a viewport-only cap and ignores mobile expansion',()=>{
 assert.equal(stableOverlayHeight(1000,{mobile:false}),680);
 assert.equal(stableOverlayHeight(520,{mobile:false}),488);
 assert.equal(stableOverlayHeight(520,{mobile:false,expanded:true}),488);
});
test('keyboard-sized viewports adapt and restore the same user-selected geometry',()=>{
 assert.ok(Math.abs(stableOverlayHeight(430,{mobile:true})-335.4)<1e-9);
 assert.equal(stableOverlayHeight(844,{mobile:true}),658.32);
 for(const h of [430,844])assert.equal(stableOverlayHeight(h,{mobile:true,expanded:true}),h);
});
test('very short viewports prioritize usable chrome without exceeding available space',()=>{
 assert.equal(stableOverlayHeight(300,{mobile:true}),280);
 assert.equal(stableOverlayHeight(200,{mobile:true}),200);
 assert.equal(stableOverlayHeight(200,{mobile:false}),168);
});
test('invalid or temporarily unavailable viewport values never create negative geometry',()=>{
 assert.equal(stableOverlayHeight(0,{mobile:true}),0);
 assert.equal(stableOverlayHeight(NaN,{mobile:false}),0);
 assert.equal(stableOverlayHeight(100,{mobile:true,safeTop:120}),0);
});
