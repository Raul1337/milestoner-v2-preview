// Presentation-only examples. No award conditions, eligibility, dates or user state.
export const BADGE_CATALOG=Object.freeze([
 {id:'first-ascent',icon:'mountain',tone:'travel',name:'Primera ascensión',nameEn:'First Ascent',description:'Una ilustración de la curiosidad por las montañas.',descriptionEn:'An illustration of curiosity for the mountains.'},
 {id:'bookworm',icon:'book',tone:'learning',name:'Entre libros',nameEn:'Bookworm',description:'Un emblema para el placer de descubrir historias.',descriptionEn:'An emblem for the pleasure of discovering stories.'},
 {id:'consistency',icon:'bolt',tone:'finance',name:'Constancia',nameEn:'Consistency',description:'Una idea visual sobre volver a lo que importa.',descriptionEn:'A visual idea about returning to what matters.'},
 {id:'explorer',icon:'compass',tone:'brand',name:'Exploración',nameEn:'Explorer',description:'Una invitación a conocer nuevos lugares.',descriptionEn:'An invitation to discover new places.'},
 {id:'fitness-builder',icon:'dumbbell',tone:'fitness',name:'En movimiento',nameEn:'Fitness Builder',description:'Una celebración ilustrada del movimiento.',descriptionEn:'An illustrated celebration of movement.'},
 {id:'storyteller',icon:'camera',tone:'brand',name:'Contar historias',nameEn:'Storyteller',description:'Una mirada creativa a los momentos cotidianos.',descriptionEn:'A creative look at everyday moments.'},
 {id:'food-explorer',icon:'chef',tone:'warm',name:'Exploración gastronómica',nameEn:'Food Explorer',description:'Un símbolo de curiosidad por sabores y culturas.',descriptionEn:'A symbol of curiosity for flavors and cultures.'},
 {id:'mindful-living',icon:'sprout',tone:'fitness',name:'Vivir con intención',nameEn:'Mindful Living',description:'Una idea ilustrada sobre las pequeñas elecciones.',descriptionEn:'An illustrated idea about small choices.'}
].map(Object.freeze));

export const BADGE_VIEWS=Object.freeze(['all','featured']);
export function badgeView(value){return BADGE_VIEWS.includes(value)?value:'all'}
export function badgeCatalog(view='all'){return badgeView(view)==='featured'?[]:BADGE_CATALOG}
export function badgeText(badge,field,language='es'){return badge[language==='en'?field+'En':field]}
