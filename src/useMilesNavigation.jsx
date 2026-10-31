import {useEffect,useRef,useState} from 'react';
import {createMilesNavigation,navigationView} from './miles-navigation';
export default function useMilesNavigation(){
 const [view,setView]=useState(()=>navigationView(location,history)),controller=useRef(),guard=useRef(action=>action());
 useEffect(()=>{controller.current=createMilesNavigation(window,setView,action=>guard.current(action));return()=>controller.current.destroy()},[]);
 return {route:view.route,isOpen:view.open,guard,open:()=>controller.current.open(),close:after=>controller.current.close(after)};
}
