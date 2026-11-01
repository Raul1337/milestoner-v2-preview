import {useEffect,useRef,useState} from 'react';
import {createMilesNavigation,navigationView} from './miles-navigation';
export default function useMilesNavigation(){
 const [view,setView]=useState(()=>navigationView(location,history)),controller=useRef(),guard=useRef(action=>action()),profileGuard=useRef(null);
 useEffect(()=>{controller.current=createMilesNavigation(window,setView,action=>guard.current(action),()=>profileGuard.current);return()=>controller.current.destroy()},[]);
 return {route:view.route,isOpen:view.open,guard,profileGuard,open:()=>controller.current.open(),close:after=>controller.current.close(after)};
}
