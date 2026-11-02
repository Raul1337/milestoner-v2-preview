// Read existing token roles; no new palette or theme is defined by the review.
export function tokenDeclarations(source){return Object.fromEntries([...source.matchAll(/(--[\w-]+):\s*([^;{}]+);/g)].map(m=>[m[1],m[2].trim()]))}
export function appearanceTokens(source,dark,contrast=false){
 const base=tokenDeclarations(source.split('@media')[0]);
 if(dark)Object.assign(base,tokenDeclarations(source.split('@media (prefers-color-scheme: dark) {')[1].split('/* Re-evaluate')[0]));
 if(contrast){Object.assign(base,tokenDeclarations(source.split('@media (prefers-contrast: more) {')[1].split('*, *::before')[0]));if(dark)Object.assign(base,tokenDeclarations(source.split('@media (prefers-color-scheme: dark) and (prefers-contrast: more) {')[1]));}
 return base;
}
