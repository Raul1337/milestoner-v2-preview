import React from 'react';
import {ArrowRight, X} from 'lucide-react';
import {MPlus} from './Navigation';
import {useLanguage} from './language';

export default function MilesInsight({insight, onOpen, onDismiss}) {
 const {t, content} = useLanguage();
 if (!insight) return null;
 return <aside className="miles-insight" aria-labelledby="home-insight-title">
  <div className="insight-copy">
   <div className="insight-heading"><MPlus /><h2 id="home-insight-title">Miles</h2><small>{content(insight.project, 'title')}</small></div>
   <p>{t(insight.reason)}</p>
   <button className="text-button" onClick={onOpen}>{t(insight.action)}<ArrowRight size={16} aria-hidden="true" /></button>
  </div>
  <button className="icon-button insight-dismiss" aria-label={t('Ocultar sugerencia de Miles')} onClick={onDismiss}><X size={18} /></button>
 </aside>;
}
