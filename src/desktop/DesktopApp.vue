<script setup>
import { ref, onMounted, watch } from 'vue';
import startSession from './startSession';
import nextCard from './nextCard';
//import { connectKeyControl } from './keyboardListener';
import { connectPlayback, preparePlaylist, startSpeaking } from '@/pronunciation';


const theInput = ref(null);

//const control = reactive(action);
/* const keyControl = ref({
    monitor: '_',
    actionName: '',
    play: false,
    showAnswer: false,
    answer: false,
    evaluate: false,
    train: false
}); */
//connectKeyControl(keyControl);

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

const mark = ref('');
const expectedAction = ref('');

function showNext() {
    theInput.value.focus();

    current.value = nextCard(session);
    console.log(current.value);

    mark.value = '';

    word.value = current.value.direction === 'FORWARD'
        ? current.value.word.question : current.value.word.hint;

    transc.value = '';

    transl.value = current.value.direction === 'BACKWARD'
        ? current.value.card.transl : '';

    example.value = '';

    preparePlaylist(current.value.word.variants);
    expectedAction.value = 'initShowAnswer';
}

function play() {
    //this.playback.on = true;
    startSpeaking();
}

function showAnswer() {
    console.log('show!');

    transc.value = current.value.card.transc;
    word.value = current.value.word.answer;
    if(current.value.direction === 'FORWARD') {
        transl.value = current.value.card.transl;
    } 
    example.value = current.value.card.example;

    try {
        play();
    } catch (error) {
        alert(error);
    }

    expectedAction.value = 'evaluate';
}

function saveProgress() {
    console.log('save!');
    showNext();
}

const keyMonitor = ref('_');
const actions = {
    initShowAnswer(key) {
        if(key === 'Enter') showAnswer();
    },
    evaluate(key) {
        if(key === 'g') {
            mark.value = 'good';
            return;
        }
        if(key === 'b') {
            mark.value = 'bad';
            return;
        }
        if(key === 'n') {
            mark.value = 'neutral';
            return;
        }
        if(key === 'Enter' && mark.value !== '') {
            saveProgress();
        }
    }
};
function keyAction(key) {
    //console.log(key);
    if(key === 'Shift') return;

    keyMonitor.value = key;
    actions[expectedAction.value](key);
    //keyControl.value.monitor = key;
    //actions[keyControl.value.actionName](key);
   /*  actionMonitor.value = key;
    console.log(theInput.value.value);
    console.log(theInput.value);
    console.log(theInput.value.innerHTNL);
    console.log(theInput.value.outerHTML); */
}
document.addEventListener('keyup', (event) => keyAction(event.key));

</script>
<template>
    <h1>This is a desktop version!</h1>
    <p>{{ keyMonitor }}</p>
    <!-- <p>{{ keyControl.monitor }}</p> -->
    <input ref="theInput" type="text" />

    <main v-bind:class="mark">
        <p class="word" v-html="word" />
        <p class="transc">{{ transc }}</p>
        <p class="transl" v-html="transl" />
        <p class="example" v-html="example" />
    </main>
</template>

<style>
main {
    border: 5px solid white;
}
.good {
    /* border: 4px solid green; */
    border-color: green;
}
.bad {
    border-color: red;
}
.neutral {
    border-color: yellow;
}
</style>