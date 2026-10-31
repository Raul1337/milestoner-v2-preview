import {defineConfig} from 'vite';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('.',import.meta.url));
// Only this separate build substitutes ephemeral storage. Production modules stay intact.
export default defineConfig({
 root:root+'theme-playground',base:'/milestoner-v2-preview/theme-playground/',publicDir:root+'public',
 build:{outDir:root+'playground-dist',emptyOutDir:true,rollupOptions:{input:{playground:root+'theme-playground/index.html',frame:root+'theme-playground/frame.html'}}},
 plugins:[{name:'isolated-playground-data',enforce:'pre',resolveId(id,importer){
  if(id==='virtual:baseline-light')return '\0baseline-light';
  if(importer?.endsWith('/src/main.jsx')&&id==='./model')return '\0playground-model';
  if(importer?.endsWith('/src/main.jsx')&&id==='./sidebar-preference')return '\0playground-sidebar';
 },load(id){
  if(id==='\0baseline-light'){const css=readFileSync(root+'src/tokens.css','utf8').split('@media')[0];return 'export default '+JSON.stringify(Object.fromEntries([...css.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map(m=>[m[1],m[2]])))}
  if(id==='\0playground-model')return `export * from ${JSON.stringify(root+'src/model.js')}; import {initial} from ${JSON.stringify(root+'src/model.js')}; export function readDemo(){return initial()} export function saveDemo(){return true}`;
  if(id==='\0playground-sidebar')return 'export function readSidebarExpanded(){return false} export function saveSidebarExpanded(){return true}';
 }}]
});
