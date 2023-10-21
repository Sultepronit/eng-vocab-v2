<script setup>
import { ref, onMounted, reactive } from 'vue';
import startSession from './startSession';
import nextCard from './nextCard';
//import { connectKeyControl } from './keyboardListener';
import { connectPlayback, preparePlaylist, startSpeaking } from '@/pronunciation';


const theInput = ref(null);

const playback = reactive({ on: false });
connectPlayback(playback);

const word = ref('word');
const transc = ref('transcritption');
const transl = ref('translation');
const example = ref('example');

const current = ref({});

const session = await startSession();
console.timeLog('tt', 'now we\'ll show the first card...');

onMounted(() => {
    showNext();
    console.timeLog('tt', 'ready to go!');
});

const mark = ref('');
const expectedAction = ref('');

function showNext() {
    current.value = nextCard(session);
    console.log(current.value);

    theInput.value.style.display = 'none';
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
    playback.on = true;
    startSpeaking();
}

function showAnswer() {
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
function trainWriting() {
    theInput.value.style.display = 'block';
    theInput.value.focus();

    expectedAction.value = 'initEvaluateTraining';
}

function evaluateInput() {
    if(theInput.value.value === current.value.word.question) {
        theInput.value.value = '';
        return 'GOOD!'
    } else {
        return theInput.value.value;
    }
}

function evaluateTraining() {
    if(evaluateInput() === 'GOOD!') {
        showNext();
    } else {
        theInput.value.style.color = 'red';
    }
    /* if(theInput.value.value === current.value.word.question) {
        theInput.value.value = '';
        showNext();
    } else {
        theInput.value.style.color = 'red';
    } */
}

function saveProgress() {
    console.log('save!');
    trainWriting();
    //showNext();
}

const keyMonitor = ref('_');
const actions = {
    initShowAnswer(key) {
        if(key === 'Enter') showAnswer();
    },
    evaluate(key) {
        if(key === 'g') {
            mark.value = 'good';
        } else if(key === 'b') {
            mark.value = 'bad';
        } else if(key === 'n') {
            mark.value = 'neutral';
        } else if(key === 'Enter' && mark.value !== '') {
            if(!playback.on) saveProgress();
        }
    },
    initEvaluateTraining(key) {
        if(key === 'Enter') {
            evaluateTraining();
        } else {
            theInput.value.style.color = 'black';
        }
    }
};
function keyAction(key) {
    //console.log(key);
    if(key === 'Shift') return;

    keyMonitor.value = key;

    actions[expectedAction.value](key);

    if(key === 'a' && expectedAction.value !== 'initEvaluateTraining') {
        play();
    } else if(key === 'Alt') {
        play();
    }
}
document.addEventListener('keyup', (event) => keyAction(event.key));
</script>

<template>
    <h1>This is a desktop version!</h1>
    <p class="monitor">{{ keyMonitor }}</p>
    <input ref="theInput" type="text" />

    <main v-bind:class="mark">
        <p class="word" :class="{'active-playback': playback.on}" v-html="word" />
        <p class="transc">{{ transc }}</p>
        <p class="transl" v-html="transl" />
        <p class="example" v-html="example" />
    </main>
</template>

<style>
.monitor {
    font-size: 1.5rem;
    height: 1.5rem;
}
input {
    font-size: 3rem;
}
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

.active-playback::after {
    content: ' 🔊';
    font-size: 0.7em;
}

.active-playback {
    padding-left: 1em;
}
</style>