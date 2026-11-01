// Presentation geometry only. Never changes saved interest order or affinity.
export function universeLayout(width){
 const w=Math.max(240,width),wide=w>=700,max=wide?160:120,profile=wide?208:148,gap=12;
 const fractions=wide?[-145,-100,-55,-10,35,80,125,170].map(a=>{const r=a*Math.PI/180;return [.5+(.5-(max/2+gap)/w)*Math.cos(r),.5+.34*Math.sin(r)]}):[[.38,.12],[.79,.23],[.85,.39],[.84,.73],[.76,.92],[.36,.85],[.17,.66],[.17,.35]];
 const nodes=fractions.map(([x,y])=>({x:Math.max(max/2+gap,Math.min(w-max/2-gap,w*x)),y}));
 const all=[...nodes,{x:w/2,y:.52}],radii=[...nodes.map(()=>max/2),profile/2+8];let height=wide?510:720;
 for(let i=0;i<all.length;i++)for(let j=i+1;j<all.length;j++){
  const dx=all[i].x-all[j].x,dy=Math.abs(all[i].y-all[j].y),distance=radii[i]+radii[j]+gap;
  if(Math.abs(dx)<distance&&dy)height=Math.max(height,Math.sqrt(distance*distance-dx*dx)/dy);
 }
 height=Math.ceil(height);return {width:w,height,max,profile,nodes:nodes.map(n=>({x:n.x,y:n.y*height})),cx:w/2,cy:height*.52,rx:w/2-max/2-gap,ry:height*.34};
}
export function affinityDiameter(affinity,max,longName=false){
 const scale={love:1,like:.84,curious:.70,'not-really':.60}[affinity]??.70;
 // Localized names retain a readable floor; tiers remain distinct at narrow widths.
 return longName?max-({love:0,like:1,curious:2,'not-really':3}[affinity]??2)*4:Math.max(max*scale,84+({love:3,like:2,curious:1,'not-really':0}[affinity]??1)*4);
}
