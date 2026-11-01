import {defineConfig} from 'vite';
export default defineConfig({base:'/milestoner-v2-preview/',define:{'import.meta.env.VITE_PROJECT_CARD_LAB':JSON.stringify('true')},build:{outDir:'card-exploration-dist'},plugins:[{name:'exploration-title',transformIndexHtml:html=>html.replace(/<title>.*?<\/title>/,'<title>Milestoner · Your Life Interaction</title>')} ]});
