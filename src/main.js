/* import './assets/main.css' */
console.time('tt');
console.timeLog('tt', 'main.js');

import { createApp } from 'vue';
import App from './App.vue';

createApp(App).mount('#app');

/* import urls from '../public/recordUrls.json';
console.log(urls['apple']);

import urls1 from './recordUrls.json';
console.log(urls1['apple']); */

/* const urls2 = fetch('https://eng-url-lib.onrender.com/recordUrls.json');
urls2.then(resp => {
    resp.json.then(urls => console.log(urls['apple']));
}); */

/* const urls2 = fetch('https://eng-vocab.onrender.com/recordUrls.json');
urls2.then(resp => {
    resp.json.then(urls => console.log(urls['apple']));
}); */
/* const urls2 = fetch('/recordUrls.json?url');
urls2.then(resp => {
    resp.json().then(urls => console.log(urls['apple']));
}); */


