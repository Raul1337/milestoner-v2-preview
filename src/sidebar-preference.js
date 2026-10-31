// A presentation preference, separate from the unchanged demo data contract.
export const SIDEBAR_KEY='milestoner-vision-v2-sidebar-expanded-v1';
export function readSidebarExpanded(){
  try{return localStorage.getItem(SIDEBAR_KEY)==='true'}catch{return false}
}
export function saveSidebarExpanded(expanded){
  try{localStorage.setItem(SIDEBAR_KEY,String(expanded===true));return true}catch{return false}
}
