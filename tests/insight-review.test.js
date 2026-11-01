import test from 'node:test';import assert from 'node:assert/strict';
import {insightKey,readReviews,recordReview} from '../src/insight-review.js';
const insight={id:'japan',project:{id:'japan',tasks:[{id:'a',text:'Compare',done:false}]}};
test('review persists without writing the existing demo contract',()=>{const data=new Map(),storage={getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)};const reviews=recordReview([],insight,storage);assert.deepEqual(readReviews(storage),reviews);assert.equal(data.size,1);assert.ok(reviews.includes(insightKey(insight)));assert.equal(recordReview(reviews,insight,storage).length,1)});
test('meaningful task changes permit a new insight; language and unrelated context do not',()=>{assert.equal(insightKey(insight),insightKey({...insight,project:{...insight.project,title:'Translated'}}));assert.notEqual(insightKey(insight),insightKey({...insight,project:{...insight.project,tasks:[{...insight.project.tasks[0],done:true}]}}))});
test('blocked or malformed local storage degrades to page memory',()=>{assert.deepEqual(readReviews({getItem(){throw Error()}}),[]);assert.deepEqual(readReviews({getItem:()=>'{bad'}),[]);assert.equal(recordReview([],insight,{setItem(){throw Error()}}).length,1)});

import {unreadInsight} from '../src/insight-review.js';import {initial} from '../src/model.js';
test('reviewed Japan permits the next grounded opportunity only in Proactive',()=>{const state=initial();state.mode='Proactive';const first=unreadInsight(state,[]);const reviewed=[insightKey(first)];assert.equal(unreadInsight(state,reviewed)?.id,'french-practice');state.mode='Balanced';assert.equal(unreadInsight(state,reviewed),null);state.mode='On Demand';assert.equal(unreadInsight(state,[]),null)});
