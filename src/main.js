/* import './assets/main.css' */
console.time('tt');
console.timeLog('tt', 'main.js');

import { createApp } from 'vue';

import App from './App.vue';

console.log(window.outerWidth);

createApp(App).mount('#app');

/* if(window.outerWidth < 1000) {
    createApp(App).mount('#app');
} */