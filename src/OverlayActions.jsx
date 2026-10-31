import React from 'react';
import {createPortal} from 'react-dom';
import {useOverlay} from './OverlayContext';
export default function OverlayActions({children,always=false}){
 const overlay=useOverlay();
 if(overlay?.stableGeometry&&overlay.footer)return createPortal(<div className="miles-action-slot" hidden={overlay.suspended}>{children}</div>,overlay.footer);
 return always&&overlay?.footer?createPortal(children,overlay.footer):children;
}
