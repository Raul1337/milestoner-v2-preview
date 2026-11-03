import test from 'node:test';
import assert from 'node:assert/strict';
import {contextualInfoPosition,protectedInfoPosition,rectanglesOverlap,observeInfoPopover,observeInlineInfo} from '../src/contextual-info.js';

test('info panels stay within mobile, desktop, zoomed and offset visual viewports',()=>{
 for(const width of [320,375,390,428,768,1440])for(const height of [180,320,600,844])for(const scale of [1,1.5,2]){
  const v={left:16,top:40,width:width/scale,height:height/scale};
  for(const x of [16,40,v.width-28])for(const y of [40,v.height/2,v.height+20]){
   const anchor={left:x,top:y,bottom:y+44},p=contextualInfoPosition(anchor,v,180*scale),actualHeight=Math.min(180*scale,p.maxHeight);
   assert.ok(p.left>=v.left+12);assert.ok(p.left+p.width<=v.left+v.width-12+.001);
   assert.ok(p.top>=v.top+12);assert.ok(p.top+actualHeight<=v.top+v.height-12+.001);
   assert.equal(p.maxHeight,v.height-24);
  }
 }
});
test('info panels prefer a connected position below their trigger and flip above near the bottom',()=>{
 const viewport={left:0,top:0,width:390,height:600};
 assert.equal(contextualInfoPosition({left:180,top:80,bottom:124},viewport,150).top,132);
 assert.equal(contextualInfoPosition({left:180,top:500,bottom:544},viewport,150).top,342);
});

function fixture(){
 const view=new EventTarget(),viewport=new EventTarget(),panel=new EventTarget(),trigger={isConnected:true,getBoundingClientRect:()=>({left:275,top:100,bottom:144}),focus(){view.document.activeElement=trigger}};
 const close={focus(){view.document.activeElement=close}};
 Object.assign(view,{innerWidth:390,innerHeight:600,visualViewport:viewport,document:Object.assign(new EventTarget(),{documentElement:{clientWidth:390},activeElement:trigger})});
 Object.assign(viewport,{width:390,height:600,offsetLeft:0,offsetTop:0});
 Object.assign(panel,{isConnected:true,open:false,style:{},matches:()=>panel.open,contains:node=>node===close,getBoundingClientRect:()=>({height:170}),querySelector:()=>close});
 const states=[],dispose=observeInfoPopover(panel,trigger,view,open=>states.push(open));
 function toggle(open){panel.open=open;panel.dispatchEvent(new Event('toggle'))}
 panel.hidePopover=()=>toggle(false);
 return {view,viewport,panel,trigger,close,states,dispose,toggle};
}
test('native opening updates the presentation and closing restores focus without reading or writing any store',()=>{
 const f=fixture();f.toggle(true);
 assert.deepEqual(f.states,[true]);assert.equal(f.view.document.activeElement,f.close);assert.equal(f.panel.style.left,'38px');
 f.toggle(false);assert.deepEqual(f.states,[true,false]);assert.equal(f.view.document.activeElement,f.trigger);
 f.dispose();
});
test('outside focus is respected; only open info observes viewport changes, and unmount cleans listeners',()=>{
 const f=fixture();f.toggle(true);f.viewport.width=320;f.view.document.documentElement.clientWidth=320;f.viewport.dispatchEvent(new Event('resize'));
 assert.equal(f.panel.style.width,'296px');assert.equal(f.panel.style.left,'12px');
 const outside={};f.view.document.activeElement=outside;f.toggle(false);assert.equal(f.view.document.activeElement,outside);
 const prior={...f.panel.style};f.viewport.height=200;f.viewport.dispatchEvent(new Event('resize'));assert.deepEqual(f.panel.style,prior);
 f.dispose();f.toggle(true);assert.deepEqual(f.states,[true,false]);
});
test('a keyboard-sized visual viewport adjusts the open panel rather than changing application geometry',()=>{
 const f=fixture();f.toggle(true);f.viewport.height=180;f.viewport.offsetTop=100;f.viewport.dispatchEvent(new Event('resize'));
 assert.equal(f.panel.style.maxHeight,'156px');assert.equal(f.panel.style.top,'112px');
 f.dispose();
});
test('Escape closes only the information surface before an outer dialog or account guard receives it',()=>{
 const f=fixture();f.toggle(true);
 const event=new Event('keydown',{cancelable:true});Object.defineProperty(event,'key',{value:'Escape'});f.view.document.dispatchEvent(event);
 assert.equal(event.defaultPrevented,true);assert.deepEqual(f.states,[true,false]);assert.equal(f.view.document.activeElement,f.trigger);
 f.dispose();
});

test('Welcome visual regression: measured 390px primary CTA stays fully clear of open help',()=>{
 // Actual a3aa9c3 rendered rectangles (390x844, ES Light/Dark). The old
 // panel at y=470.453125 intersected the primary action at y=514.453125.
 const action={left:16,right:193.9453125,top:514.453125,bottom:562.453125};
 const anchor={left:204,top:418.453125,bottom:462.453125};
 const viewport={left:0,top:0,width:390,height:844},height=164.78125;
 const old=contextualInfoPosition(anchor,viewport,height);
 assert.equal(rectanglesOverlap({...old,right:old.left+old.width,bottom:old.top+height},action),true);
 const next=protectedInfoPosition(anchor,viewport,height,action);
 assert.ok(next);assert.equal(next.top+height,anchor.top-8);
 assert.equal(rectanglesOverlap({...next,right:next.left+next.width,bottom:next.top+height},action),false);
});
test('Welcome chooses document-flow help when enlarged content cannot fit without covering the action',()=>{
 const action={left:16,right:250,top:450,bottom:510},anchor={left:270,top:360,bottom:404};
 assert.equal(protectedInfoPosition(anchor,{left:0,top:0,width:320,height:480},430,action),null);
 assert.equal(protectedInfoPosition(anchor,{left:0,top:0,width:390,height:844},600,action),null);
});
test('protected floating placement never intersects an action or leaves the visual viewport',()=>{
 for(const width of [320,375,390,428])for(const height of [360,480,600,844])for(const textHeight of [165,300,525]){
  const viewport={left:0,top:30,width,height},anchor={left:width-64,top:height/2,bottom:height/2+44};
  const action={left:16,right:width-16,top:anchor.bottom+52,bottom:anchor.bottom+100},p=protectedInfoPosition(anchor,viewport,textHeight,action);
  if(p){assert.ok(p.top>=42);assert.ok(p.top+textHeight<=30+height-12);assert.equal(rectanglesOverlap({...p,right:p.left+p.width,bottom:p.top+textHeight},action),false)}
 }
});
test('inline help keeps Escape/outside dismissal local and removes its listeners on close',()=>{
 const doc=Object.assign(new EventTarget(),{querySelector:()=>null,querySelectorAll:()=>[]}),view={document:doc};
 const target={},trigger={contains:x=>x===target},panel={contains:()=>false},closed=[];
 const dispose=observeInlineInfo(panel,trigger,view,restore=>closed.push(restore));
 const inside=new Event('click');Object.defineProperty(inside,'target',{value:target});doc.dispatchEvent(inside);assert.deepEqual(closed,[]);
 const escape=new Event('keydown',{cancelable:true});Object.defineProperty(escape,'key',{value:'Escape'});doc.dispatchEvent(escape);assert.equal(escape.defaultPrevented,true);assert.deepEqual(closed,[true]);
 const otherControl=new Event('click');Object.defineProperty(otherControl,'target',{value:{closest:()=>({})}});doc.dispatchEvent(otherControl);assert.deepEqual(closed,[true,false]);
 doc.dispatchEvent(new Event('click'));assert.deepEqual(closed,[true,false,true]);dispose();doc.dispatchEvent(new Event('click'));assert.deepEqual(closed,[true,false,true]);
});
test('inline help never captures Escape intended for a native modal above it',()=>{
 const doc=Object.assign(new EventTarget(),{querySelector:()=>({contains:()=>false}),querySelectorAll:()=>[]}),closed=[];
 const dispose=observeInlineInfo({contains:()=>false},{contains:()=>false},{document:doc},restore=>closed.push(restore));
 const escape=new Event('keydown',{cancelable:true});Object.defineProperty(escape,'key',{value:'Escape'});doc.dispatchEvent(escape);
 assert.equal(escape.defaultPrevented,false);assert.deepEqual(closed,[false]);dispose();
});
test('a queued native resize callback cannot reposition or reopen help after close or inline handoff',()=>{
 const f=fixture();let queued;
 f.view.ResizeObserver=class{constructor(callback){queued=callback}observe(){}disconnect(){}};
 f.toggle(true);assert.equal(typeof queued,'function');f.toggle(false);
 const before={...f.panel.style};f.viewport.width=280;queued();assert.deepEqual(f.panel.style,before);
 f.dispose();f.panel.open=true;queued();assert.deepEqual(f.panel.style,before);assert.deepEqual(f.states,[true,false]);
});
