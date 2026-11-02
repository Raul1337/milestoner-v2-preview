// Presentation geometry only. Coordinates include the browser's visual viewport.
export function contextualInfoPosition(anchor,viewport,height=240){
 const margin=12,gap=8,width=Math.min(340,Math.max(0,viewport.width-2*margin));
 const start=viewport.left+margin,end=viewport.top+viewport.height-margin;
 const maxHeight=Math.max(0,viewport.height-2*margin),panelHeight=Math.min(height,maxHeight);
 const left=Math.max(start,Math.min(anchor.left,start+viewport.width-2*margin-width));
 const below=anchor.bottom+gap,above=anchor.top-gap-panelHeight;
 const top=below+panelHeight<=end?below:above>=viewport.top+margin?above:Math.max(viewport.top+margin,end-panelHeight);
 return {left,top,width,maxHeight};
}

// Native auto popovers provide light dismissal, Escape, invoker focus and one-open
// behavior, including inside a native dialog. No document-wide overlay manager.
export function observeInfoPopover(panel,trigger,view,onChange){
 let listening=false,observer;
 function position(){
  const v=view.visualViewport,viewport={left:v?.offsetLeft||0,top:v?.offsetTop||0,width:Math.min(v?.width||view.innerWidth,view.document.documentElement.clientWidth),height:v?.height||view.innerHeight};
  panel.style.width=Math.min(340,Math.max(0,viewport.width-24))+'px';
  panel.style.maxHeight=Math.max(0,viewport.height-24)+'px';
  const rect=trigger.getBoundingClientRect(),result=contextualInfoPosition(rect,viewport,panel.getBoundingClientRect().height||240);
  for(const [key,value] of Object.entries(result))panel.style[key]=value+'px';
 }
 function stop(){
  view.document.removeEventListener('keydown',escape,true);
  view.removeEventListener('resize',position);view.removeEventListener('scroll',position,true);
  view.visualViewport?.removeEventListener('resize',position);view.visualViewport?.removeEventListener('scroll',position);
  observer?.disconnect();observer=undefined;listening=false;
 }
 function escape(event){
  if(event.key==='Escape'&&panel.matches(':popover-open')){event.preventDefault();event.stopPropagation();panel.hidePopover()}
 }
 function sync(){
  const open=panel.matches(':popover-open');onChange(open);
  if(!open){stop();if(panel.contains(view.document.activeElement)&&trigger.isConnected)trigger.focus({preventScroll:true});return}
  position();if(listening)return;listening=true;
  panel.querySelector('.contextual-info-close')?.focus({preventScroll:true});
  view.document.addEventListener('keydown',escape,true);
  view.addEventListener('resize',position);view.addEventListener('scroll',position,true);
  view.visualViewport?.addEventListener('resize',position);view.visualViewport?.addEventListener('scroll',position);
  if(view.ResizeObserver){observer=new view.ResizeObserver(position);observer.observe(panel);observer.observe(trigger)}
 }
 function before(event){if(event.newState==='open')queueMicrotask(()=>{if(panel.isConnected&&panel.matches(':popover-open'))position()})}
 panel.addEventListener('beforetoggle',before);panel.addEventListener('toggle',sync);
 return ()=>{stop();panel.removeEventListener('beforetoggle',before);panel.removeEventListener('toggle',sync)};
}
