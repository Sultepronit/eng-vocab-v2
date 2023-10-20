<script setup>
import { ref, onMounted, watch } from 'vue';
import startSession from './startSession';
import nextCard from './nextCard';
import { connectKeyControl } from './keyboardListener';
import { connectPlayback, preparePlaylist, startSpeaking } from '@/pronunciation';


const theInput = ref(null);

//const control = reactive(action);
const keyControl = ref({
    monitor: '_',
    actionName: '',
    play: false,
    showAnswer: false,
    answer: false,
    evaluate: false,
    train: false
});
connectKeyControl(keyControl);

/* watch(() => keyControl.value.monitor, (newVal) => {
    console.log(newVal);
    console.log(keyControl.value.monitor);
}); */
//console.log(keyControl);
//setInterval(() => {console.log(control.monitor)}, 2000);
//const actionMonitor = ref('');
/* function getKey(key) {
    console.log(key);
    actionMonitor.value = key;
    console.log(theInput.value.value);
    console.log(theInput.value);
    console.log(theInput.value.innerHTNL);
    console.log(theInput.value.outerHTML);
}
document.addEventListener('keyup', (event) => getKey(event.key));
//document.addEventListener('keypress', (event) => console.log(event)) */

//const theInput = ref(null);

const word = ref('word');
const transc = ref('transcritption');
const transl = ref('translation');
const example = ref('example');

const current = ref({});

const session = await startSession();
console.log(session);
console.timeLog('tt', 'now we\'ll show the first card...');

onMounted(() => {
    console.log('Mounted!');
    showNext();
    console.timeLog('tt', 'ready to go!');
});


function showNext() {
    keyControl.value.actionName = 'showAnswer';
    theInput.value.focus();
    //console.log(theInput);
    //console.log(session.value)
    current.value = nextCard(session);
    console.log(current.value);

    word.value = current.value.direction === 'FORWARD'
        ? current.value.word.question : current.value.word.hint;

    transc.value = '';

    transl.value = current.value.direction === 'BACKWARD'
        ? current.value.card.transl : '';

    example.value = '';
}

watch(() => keyControl.value.showAnswer, (nv) => {
    if(nv) {
        keyControl.value.showAnswer = false;
        console.log('show!');
    }
});


</script>
<template>
    <h1>This is a desktop version!</h1>
    <!-- <p>{{ actionMonitor }}</p> -->
    <p>{{ keyControl.monitor }}</p>
    <input ref="theInput" type="text" />

    <main>
        <p class="word" v-html="word" />
        <p class="transc">{{ transc }}</p>
        <p class="transl" v-html="transl" />
        <p class="example" v-html="example" />
    </main>
</template>