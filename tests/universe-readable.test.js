import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {createRequire} from 'node:module';
import {usesReadableUniverse} from '../src/universe-presentation.js';
import {initialInterests,interestLabel} from '../src/interest-model.js';

const bundled=await build({stdin:{resolveDir:process.cwd(),loader:'jsx',contents:`
 import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';
 import ReadableUniverse,{ReadableInterest} from './src/ReadableUniverse.jsx';
 import IllustratedAvatar from './src/IllustratedAvatar.jsx';
 import {BookOpen} from 'lucide-react';
 export function render(items,name){return renderToStaticMarkup(<ReadableUniverse label="Interests" identity={<a className="profile-node" href="#you/profile"><IllustratedAvatar/><strong>{name}</strong><span>View Profile</span></a>} items={items} renderItem={i=><ReadableInterest label={i.label} Icon={BookOpen} affinity={i.affinity} affinityLabel={i.affinity} accessibleLabel={i.label} onClick={()=>{}}/>}/>)}
`},bundle:true,platform:'node',format:'cjs',packages:'external',write:false,plugins:[{name:'css',setup(b){b.onLoad({filter:/\.css$/},()=>({contents:'',loader:'text'}))}}]});
const mod={exports:{}};new Function('require','module','exports',bundled.outputFiles[0].text)(createRequire(import.meta.url),mod,mod.exports);

test('measured rem selects readable presentation for 150/200 percent, preserving normal and browser zoom with unchanged CSS pixels',()=>{
 for(const px of [12,16,18,19.99,NaN,undefined])assert.equal(usesReadableUniverse(px),false);
 for(const px of [20,24,32,48])assert.equal(usesReadableUniverse(px),true);
});
test('readable Universe retains full multilingual/custom labels, all affinity values, one illustrated identity and semantic ordered traversal',()=>{
 const original=initialInterests(),snapshot=JSON.stringify(original);
 for(const language of ['en','es'])for(const count of [0,8,24]){
  const items=Array.from({length:count},(_,n)=>({id:'example-'+n,label:n<12?interestLabel(original.confirmed[n],language):'Fotografía de arquitectura y paisajes extraordinarios '+n,affinity:['love','like','curious','not-really'][n%4]}));
  const name='Explorador de universos y caminos extraordinarios';const html=mod.exports.render(items,name);
  assert.equal((html.match(/class="illustrated-avatar"/g)||[]).length,1);
  assert.equal((html.match(/class="profile-node"/g)||[]).length,1);
  assert.ok(html.includes(name));assert.ok(html.includes('href="#you/profile"'));
  assert.equal((html.match(/<li>/g)||[]).length,count);assert.equal((html.match(/class="readable-interest"/g)||[]).length,count);
  let previous=-1;for(const item of items){const position=html.indexOf('<strong>'+item.label+'</strong>');assert.ok(position>previous);previous=position;assert.ok(html.includes('data-affinity="'+item.affinity+'"'))}
  assert.doesNotMatch(html,/aria-hidden="true"><strong|<input|<select|text-overflow/);
 }
 assert.equal(JSON.stringify(original),snapshot);
});

test('public review applies changed text immediately even when the iframe URL does not navigate or fire load',async()=>{
 const {readFile}=await import('node:fs/promises'),{runInNewContext}=await import('node:vm');
 const html=await readFile('public/review/universe.html','utf8'),script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
 const root={style:{}},controls={},frame={style:{},src:'',contentWindow:{innerWidth:320},contentDocument:{documentElement:root,getElementById:id=>id==='root'?{}:null},addEventListener(){}};
 for(const [id,values] of Object.entries({text:['100','150','200'],lang:['es','en'],appearance:['dark','light'],width:['320','390'],view:['you','you/expanded']}))controls[id]={options:values.map(value=>({value})),value:values[0],handlers:{},addEventListener(n,fn){this.handlers[n]=fn}};
 controls.measurement={textContent:''};
 runInNewContext(script,{URL,URLSearchParams,location:{search:'?text=200',href:'https://example.test/review/universe.html'},history:{replaceState(){}},document:{querySelector:()=>frame,getElementById:id=>controls[id]}});
 assert.equal(root.style.fontSize,'200%');const first=frame.src;
 for(const value of ['100','150','200']){controls.text.value=value;controls.text.handlers.change();assert.equal(frame.src,first);assert.equal(root.style.fontSize,value+'%');assert.match(controls.measurement.textContent,new RegExp(value+'%'))}
});
