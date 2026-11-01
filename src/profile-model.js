import {DEMO_PROFILE} from './profile-overview-model.js';
export const PROFILE_KEY='milestoner-vision-v2-profile-v1';
// Demo-only field limits and original artwork variants, not native product contracts.
export const PROFILE_LIMITS={displayName:50,username:24,bio:160};
export const AVATAR_OPTIONS=[
 {id:'original',es:'Original',en:'Original',background:'#c2c8ff',clothing:'#788cb6',collar:'#a0b3d0'},
 {id:'lagoon',es:'Laguna',en:'Lagoon',background:'#b6e3da',clothing:'#397e82',collar:'#7eb8ae'},
 {id:'sunrise',es:'Amanecer',en:'Sunrise',background:'#f4d5bd',clothing:'#9b627f',collar:'#c397ae'}
];
export const initialProfile=()=>({version:1,displayName:DEMO_PROFILE.name,username:DEMO_PROFILE.handle.slice(1),bio:'',avatar:'original'});
export function validateProfile(input){
 const errors={};
 const displayName=typeof input?.displayName==='string'?input.displayName.trim():'';
 const username=typeof input?.username==='string'?input.username.trim().replace(/^@/,''):null;
 const bio=typeof input?.bio==='string'?input.bio.trim():null;
 if(!displayName||displayName.length>PROFILE_LIMITS.displayName||/[\u0000-\u001f\u007f]/.test(displayName))errors.displayName='name';
 if(username===null||username.length>PROFILE_LIMITS.username||(username&&!/^[A-Za-z0-9_][A-Za-z0-9_.-]*$/.test(username)))errors.username='username';
 if(bio===null||bio.length>PROFILE_LIMITS.bio)errors.bio='bio';
 if(!AVATAR_OPTIONS.some(a=>a.id===input?.avatar))errors.avatar='avatar';
 return Object.keys(errors).length?{errors}:{profile:{version:1,displayName,username,bio,avatar:input.avatar}};
}
export function createProfileStore(storage){
 let memory;
 return {
  read(){
   if(memory)return {...memory};
   try{const data=JSON.parse(storage.getItem(PROFILE_KEY));if(data?.version===1){const result=validateProfile(data);if(result.profile)return {...result.profile}}}catch{}
   return initialProfile();
  },
  save(input){
   const result=validateProfile(input);if(result.errors)return {ok:false,errors:result.errors};
   memory=result.profile;let persisted=false;
   try{storage.setItem(PROFILE_KEY,JSON.stringify(memory));persisted=true}catch{}
   return {ok:true,persisted,profile:{...memory}};
  }
 };
}
