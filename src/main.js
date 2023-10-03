/* import './assets/main.css' */
console.time('tt');
console.timeLog('tt', 'main.js');

import { createApp } from 'vue';
import App from './App.vue';

createApp(App).mount('#app');

import urls from '../public/recordUrls.json';
console.log(urls['apple']);