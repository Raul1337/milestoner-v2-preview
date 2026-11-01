export function insightPosition(anchor,viewport){
 const margin=12,width=Math.min(360,Math.max(0,viewport.width-2*margin));
 const left=viewport.left+viewport.width-width-margin,bottom=viewport.top+viewport.height;
 const top=Math.max(viewport.top+8,Math.min(anchor.bottom+8,bottom-120));
 return {left,top,width,maxHeight:Math.max(0,bottom-top-margin)};
}
