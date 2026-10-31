// Viewport-only policy: creation content/stages never participate in sizing.
export function stableOverlayHeight(visualHeight,{mobile,expanded=false,safeTop=0}){
 const height=Number.isFinite(visualHeight)?Math.max(0,visualHeight):0;
 const inset=Number.isFinite(safeTop)?Math.max(0,safeTop):0;
 const usable=Math.max(0,height-(mobile?inset:32));
 if(!mobile)return Math.min(680,usable);
 // Short viewports may use more than 78% to keep header/actions usable.
 return expanded?usable:Math.min(usable,Math.max(280,usable*.78));
}
