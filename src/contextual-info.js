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

export function rectanglesOverlap(a,b){return a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top}
// Welcome protects its primary action. Other contextual help keeps its original
// placement. If neither connected position fits, use ordinary document flow.
export function protectedInfoPosition(anchor,viewport,height,action){
 const base=contextualInfoPosition(anchor,viewport,height),min=viewport.top+12,max=viewport.top+viewport.height-12;
 for(const top of [anchor.top-8-height,anchor.bottom+8]){
  const rect={left:base.left,right:base.left+base.width,top,bottom:top+height};
  if(rect.top>=min&&rect.bottom<=max&&!rectanglesOverlap(rect,action))return {...base,top};
 }
 return null;
}

// Native auto popovers provide light dismissal, Escape, invoker focus and one-open
// behavior, including inside a native dialog. No document-wide overlay manager.
export function observeInfoPopover(panel,trigger,view,onChange,{avoidSelector,onNoSpace}={}){
 let listening=false,observer,disposed=false;
 function position(){
  if(disposed||!panel.matches(':popover-open'))return false;
  const v=view.visualViewport,viewport={left:v?.offsetLeft||0,top:v?.offsetTop||0,width:Math.min(v?.width||view.innerWidth,view.document.documentElement.clientWidth),height:v?.height||view.innerHeight};
  panel.style.width=Math.min(340,Math.max(0,viewport.width-24))+'px';
  panel.style.maxHeight=Math.max(0,viewport.height-24)+'px';
  const rect=trigger.getBoundingClientRect(),height=panel.getBoundingClientRect().height||240,action=avoidSelector&&view.document.querySelector(avoidSelector);
  const naturalHeight=Math.max(height,panel.scrollHeight?panel.scrollHeight+panel.offsetHeight-panel.clientHeight:height);
  const result=action?protectedInfoPosition(rect,viewport,naturalHeight,action.getBoundingClientRect()):contextualInfoPosition(rect,viewport,height);
  if(!result){onNoSpace?.();return false}
  for(const [key,value] of Object.entries(result))panel.style[key]=value+'px';
  return true;
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
  if(disposed)return;
  const open=panel.matches(':popover-open');onChange(open);
  if(!open){stop();if(panel.contains(view.document.activeElement)&&trigger.isConnected)trigger.focus({preventScroll:true});return}
  if(!position()||listening)return;listening=true;
  panel.querySelector('.contextual-info-close')?.focus({preventScroll:true});
  view.document.addEventListener('keydown',escape,true);
  view.addEventListener('resize',position);view.addEventListener('scroll',position,true);
  view.visualViewport?.addEventListener('resize',position);view.visualViewport?.addEventListener('scroll',position);
  if(view.ResizeObserver){observer=new view.ResizeObserver(position);observer.observe(panel);observer.observe(trigger)}
 }
 function before(event){if(event.newState==='open')queueMicrotask(()=>{if(panel.isConnected&&panel.matches(':popover-open'))position()})}
 panel.addEventListener('beforetoggle',before);panel.addEventListener('toggle',sync);
 return ()=>{disposed=true;stop();panel.removeEventListener('beforetoggle',before);panel.removeEventListener('toggle',sync)};
}

// An inline disclosure has no top-layer surface or scroll lock. Escape/outside
// dismissal remains local to the open explanation, with the same return target.
export function observeInlineInfo(panel,trigger,view,onClose){
 function outside(event){if(!panel.contains(event.target)&&!trigger.contains(event.target))onClose(!event.target.closest?.('button,a[href],input,textarea,select,summary,[tabindex]'))}
 function escape(event){
  if(event.key!=='Escape')return;
  const dialog=view.document.querySelector('dialog[open]');
  if(dialog&&!dialog.contains(panel)){onClose(false);return}
  event.preventDefault();event.stopPropagation();onClose(true);
 }
 view.document.querySelectorAll('.contextual-info-panel[popover]:popover-open').forEach(p=>p.hidePopover());
 const capture={capture:true};
 view.document.addEventListener('click',outside,capture);view.document.addEventListener('keydown',escape,capture);
 return ()=>{view.document.removeEventListener('click',outside,capture);view.document.removeEventListener('keydown',escape,capture)};
}
