import {selectHomeInsight} from './home-insight.js';
export const REVIEW_KEY='milestoner-demo-insight-review-v1';
export function insightKey(insight){return insight?JSON.stringify([insight.id,insight.project.id,insight.project.tasks.map(t=>[t.id,t.text,t.done])]):''}
export function readReviews(storage){try{const value=JSON.parse(storage.getItem(REVIEW_KEY));return Array.isArray(value)?value.filter(x=>typeof x==='string'):[]}catch{return []}}
export function recordReview(reviews,insight,storage){const next=[...new Set([...reviews,insightKey(insight)])].slice(-50);try{storage.setItem(REVIEW_KEY,JSON.stringify(next))}catch{}return next}

export function unreadInsight(state,reviews){const skipped=[];for(let i=0;i<2;i++){const item=selectHomeInsight(state,skipped);if(!item)return null;if(!reviews.includes(insightKey(item)))return item;skipped.push(item.id)}return null}
