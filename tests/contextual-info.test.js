import test from 'node:test';
import assert from 'node:assert/strict';
import {contextualInfoPosition,observeInfoPopover} from '../src/contextual-info.js';

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
