<script setup>
import { ref, onMounted } from 'vue';
import startSession from './startSession';
import { connectPlayback, preparePlaylist, startSpeaking } from '@/pronunciation';

const theInput = ref(null);

const actionMonitor = ref('');
function getKey(key) {
    console.log(key);
    actionMonitor.value = key;
    /* console.log(theInput.value.value);
    console.log(theInput.value); */
    /* console.log(theInput.value.innerHTNL);
    console.log(theInput.value.outerHTML); */
}
document.addEventListener('keyup', (event) => getKey(event.key));
//document.addEventListener('keypress', (event) => console.log(event))

//const theInput = ref(null);

const session = await startSession();
console.log(session);
console.timeLog('tt', 'now we\'ll show the first card...');

onMounted(() => {
    console.log('Mounted!');
    showNext();
    console.timeLog('tt', 'ready to go!');
});


function showNext() {
    theInput.value.focus();
    console.log(theInput);
}



</script>
<template>
    <h1> This is a desktop version!</h1>
    <p>{{ actionMonitor }}</p>
    <input ref="theInput" type="text" />
</template>