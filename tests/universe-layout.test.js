import test from 'node:test';import assert from 'node:assert/strict';
import {universeLayout,affinityDiameter} from '../src/universe-layout.js';
import {initialInterests,changeInterest} from '../src/interest-model.js';
test('single universe reserves maximum bubbles and one profile for normal and expanded collection sizes',()=>{for(const w of [273,328,343,381,689,721,1137,1280])for(const count of [0,1,8,9,12,16,24])for(const expanded of [false,true]){const l=universeLayout(w,count,expanded);assert.equal(l.nodes.length,expanded?count:Math.min(count,8));assert.equal(new Set(l.nodes.map(n=>`${n.x},${n.y}`)).size,l.nodes.length);const nodes=[...l.nodes.map(n=>({...n,r:l.max/2})),{x:l.cx,y:l.cy,r:l.profile/2+8}];for(const [i,a] of nodes.entries()){assert.ok(a.x-a.r>=0&&a.x+a.r<=w);assert.ok(a.y-a.r>=0&&a.y+a.r<=l.height);for(const b of nodes.slice(i+1))assert.ok(Math.hypot(a.x-b.x,a.y-b.y)>=a.r+b.r+3,`collision ${w}/${count}/${expanded}`)}assert.deepEqual(l,universeLayout(w,count,expanded));if(w<700&&!expanded)assert.ok(l.height<720)}});
test('four affinity tiers fit reserved slots without growing long-name bubbles or changing saved order',()=>{for(const w of [273,343,700,1280]){let s=initialInterests();const before=s.confirmed.map(i=>i.id),l=universeLayout(w,s.confirmed.length,true);const sizes=['love','like','curious','not-really'].map(a=>{s=changeInterest(s,{type:'edit',id:'photography',affinity:a,note:''}).state;assert.deepEqual(s.confirmed.map(i=>i.id),before);assert.deepEqual(l,universeLayout(w,s.confirmed.length,true));return affinityDiameter(a,l.max,l.compact)});assert.ok(sizes.every(s=>s>=44&&s<=l.max));assert.ok(sizes.every((s,i)=>!i||s<sizes[i-1]))}});

test('compact mobile keeps a smaller profile and staggered stable slots within a bounded stage',()=>{
 for(let width=273;width<=449;width++){
  const layout=universeLayout(width,8),r=layout.max/2;
  assert.ok(layout.profile>=104&&layout.profile<=122);
  assert.ok(layout.height<480);
  assert.equal(new Set(layout.nodes.map(n=>n.y)).size,8,'no paired horizontal rows');
  for(const [i,a] of layout.nodes.entries()){
   assert.ok(a.x-r>=0&&a.x+r<=width&&a.y-r>=0&&a.y+r<=layout.height);
   assert.ok(Math.hypot(a.x-layout.cx,a.y-layout.cy)>=r+layout.profile/2+11);
   for(const b of layout.nodes.slice(i+1))assert.ok(Math.hypot(a.x-b.x,a.y-b.y)>=layout.max+3);
  }
  const tiers=['love','like','curious','not-really'].map(a=>affinityDiameter(a,layout.max,layout.compact));
  assert.ok(tiers.every((size,i)=>size>=56&&(!i||size<tiers[i-1])));
 }
});
