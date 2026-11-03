// Presentation-only protection. No record, draft or persistence contract is added.
export function formSnapshot(root){
 return JSON.stringify([...root.querySelectorAll('input,textarea,select')].filter(e=>!['submit','button','reset'].includes(e.type)).map(e=>[e.name,e.type==='checkbox'||e.type==='radio'?e.checked:String(e.value).trim()]));
}
export function bindUnsavedNavigation(win,channel,isDirty,request,leave){
 const guard={isDirty,request,leave,blockMiles:true};if(channel)channel.current=guard;
 const unload=e=>{if(isDirty()){e.preventDefault();e.returnValue=''}};
 win.addEventListener('beforeunload',unload);
 return()=>{win.removeEventListener('beforeunload',unload);if(channel?.current===guard)channel.current=null};
}
export function dismissOnEscape(event,dismiss){
 if(event.key!=='Escape'||event.defaultPrevented)return false;
 event.preventDefault();event.stopPropagation();dismiss();return true;
}
