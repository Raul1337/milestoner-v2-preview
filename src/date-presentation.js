// Presentation only: never infer a missing date or rewrite stored values.
export function formatDateLabel(value,locale,includeYear=false){
 return new Date(value+'T12:00:00').toLocaleDateString(locale,{day:'numeric',month:'short',...(includeYear?{year:'numeric'}:{})});
}
