// Presentation only: count and container width determine slots, never affinity or data order.
function arcSlots(count,rx,ry){
 const samples=1024,points=[],lengths=[0];
 for(let i=0;i<=samples;i++){const a=-Math.PI/2+i*2*Math.PI/samples;points.push({x:rx*Math.cos(a),y:ry*Math.sin(a)});if(i)lengths.push(lengths[i-1]+Math.hypot(points[i].x-points[i-1].x,points[i].y-points[i-1].y))}
 return Array.from({length:count},(_,i)=>{const target=(i+.5)*lengths[samples]/count;let j=1;while(lengths[j]<target)j++;const t=(target-lengths[j-1])/(lengths[j]-lengths[j-1]);return {x:points[j-1].x+(points[j].x-points[j-1].x)*t,y:points[j-1].y+(points[j].y-points[j-1].y)*t}});
}
export function universeLayout(width,count=8,expanded=false){
 const w=Math.max(240,width),n=expanded?count:Math.min(count,8),wide=w>=700,gap=12,max=wide?160:Math.min(112,Math.max(92,w*96/273)),profile=wide?208:Math.min(140,Math.max(120,w*.47)),pad=max/2+gap;
 if(!wide){
  const outer=w/2-pad,inner=(max+gap)/2,rows=expanded&&n>8?Math.ceil(n/2):4,split=Math.floor(rows/2),step=max+gap,centerGap=max/2+profile/2+20;
  const cy=pad+(split-1)*step+centerGap,height=pad*2+(rows-2)*step+centerGap*2;
  const nodes=Array.from({length:n},(_,i)=>{const row=Math.floor(i/2),side=i%2?1:-1;const spread=rows===4?(row===0||row===3?inner:outer):inner+(outer-inner)*Math.sin(Math.PI*(row+.5)/rows);return {x:w/2+side*spread,y:pad+row*step+(row>=split?centerGap*2-step:0)}});
  return {width:w,height,max,profile,nodes,cx:w/2,cy,rx:outer,ry:height/2-pad};
 }
 const rx=w/2-pad;let ry=180,nodes=[];
 // Expanded collections may grow vertically; normal desktop stays a compact ellipse.
 for(let attempt=0;attempt<400;attempt++){
  nodes=arcSlots(n,rx,ry);
  const collision=nodes.some((a,i)=>Math.hypot(a.x,a.y)<max/2+profile/2+gap+8||nodes.slice(i+1).some(b=>Math.hypot(a.x-b.x,a.y-b.y)<max+gap));
  if(!collision)break;ry+=8;
 }
 const height=2*(ry+pad),cy=height/2;
 return {width:w,height,max,profile,nodes:nodes.map(p=>({x:p.x+w/2,y:p.y+cy})),cx:w/2,cy,rx,ry};
}
export function affinityDiameter(affinity,max){return Math.max(56,max*({love:1,like:.84,curious:.70,'not-really':.60}[affinity]??.70))}
