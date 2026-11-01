import {defineConfig} from 'vite';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('.',import.meta.url));
// Only this separate build substitutes ephemeral storage. Production modules stay intact.
export default defineConfig({
 define:{'import.meta.env.VITE_CURRENT_HOME':JSON.stringify('false'),'import.meta.env.VITE_PROJECT_CARD_LAB':JSON.stringify('false')},
 root:root+'theme-playground',base:'/milestoner-v2-preview/theme-playground/',publicDir:root+'public',
 build:{outDir:root+'playground-dist',emptyOutDir:true,rollupOptions:{input:{playground:root+'theme-playground/index.html',frame:root+'theme-playground/frame.html'}}},
 plugins:[{name:'isolated-playground-data',enforce:'pre',resolveId(id,importer){
  if(id==='virtual:baseline')return '\0baseline';
  if(importer?.endsWith('/src/main.jsx')&&id==='./model')return '\0playground-model';
  if(importer?.endsWith('/src/main.jsx')&&id==='./sidebar-preference')return '\0playground-sidebar';
 },load(id){
  if(id==='\0baseline'){
   const css=readFileSync(root+'src/tokens.css','utf8');
   const parse=s=>Object.fromEntries([...s.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map(m=>[m[1],m[2]]));
   const light=parse(css.split('@media')[0]);
   const dark={...light,...parse(css.split('@media (prefers-color-scheme: dark) {')[1].split('/* Re-evaluate')[0])};
   return 'export default '+JSON.stringify({light,dark});
  }
  if(id==='\0playground-model')return `export * from ${JSON.stringify(root+'src/model.js')}; import {initial} from ${JSON.stringify(root+'src/model.js')}; export function readDemo(){return initial()} export function saveDemo(){return true}`;
  if(id==='\0playground-sidebar')return 'export function readSidebarExpanded(){return false} export function saveSidebarExpanded(){return true}';
 }}]
});
