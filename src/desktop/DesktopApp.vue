<script setup>
console.timeLog('tt', 'desktop setup!');
import { ref, onMounted, reactive } from 'vue';
import startSession from './startSession';
import nextCard from './nextCard';
import { connectPlayback, preparePlaylist, startSpeaking } from '@/pronunciation';
import { directions, marks } from './enums';

// input //
const theInput = ref(null);

const typedIn = ref('');
const showTypedIn = ref(true);
const typedInColor = ref('');

function showTheInput() {
    theInput.value.style.display = 'block';
    theInput.value.focus();
    showTypedIn.value = false;
}

function hideTheInput() {
    theInput.value.style.display = 'none';
    showTypedIn.value = true;
}

// playback //
const playback = reactive({ on: false });
connectPlayback(playback);

function play() {
    playback.on = true;
    try {
        startSpeaking();
    } catch (error) {
        alert(error);
    }
}

// main display //
const word = ref('word');
const transc = ref('transcritption');
const transl = ref('translation');
const example = ref('example');

// session //
//const session = await startSession();
let session = {};
startSession().then((data) => {
    session = data;
    showNext();
    console.timeLog('tt', 'ready to go!');
});
//const current = ref({});
let current = {};

/* onMounted(() => {
    showNext();
    console.timeLog('tt', 'ready to go!');
}); */

const mark = ref('');
//const correctInput = ref(true);
let correctInput = true;

//const expectedAction = ref('');
let expectedAction = '';

// repeat cycle //
function showNext() {
    current = nextCard(session);
    console.log(current);
    mark.value = '';

    typedIn.value = '';

    word.value = current.direction === directions.FORWARD
        ? current.word.question : current.word.hint;

    transc.value = '';

    transl.value = current.direction === directions.BACKWARD
        ? current.card.transl : '';

    example.value = '';

    preparePlaylist(current.word.variants);

    /* if(current.direction === 'BACKWARD') {
        showTheInput();
    } else {
        hideTheInput();
    } */
    current.direction === directions.FORWARD ? hideTheInput() : showTheInput();
    expectedAction = 'initShowAnswer';
}

function evaluateAnswer() {
    hideTheInput();

    typedIn.value = theInput.value.value;
    if(theInput.value.value === current.word.question) {
        mark.value = marks.GOOD;
        correctInput = true;

        typedInColor.value = 'blue';
    } else {
        mark.value = marks.BAD;
        correctInput = false;

        typedInColor.value = 'red';
        if(typedIn.value === '') typedIn.value = '~';
    }
    theInput.value.value = '';
}

function showAnswer() {
    transc.value = current.card.transc;
    word.value = current.word.answer;
    if(current.direction === directions.FORWARD) {
        transl.value = current.card.transl;
    } 
    example.value = current.card.example;

    if(current.direction === directions.BACKWARD) {
        evaluateAnswer();
    }

    play();

    expectedAction = 'evaluate';
}

function trainWriting() {
    showTheInput();
    expectedAction = 'initEvaluateTraining';
}

function evaluateTraining() {
    if(theInput.value.value === current.word.question) {
        theInput.value.value = '';
        showNext();
    } else {
        theInput.value.style.color = 'red';
    }
}

function saveProgress() {
    console.log('save!');
    if(current.direction === directions.FORWARD || !correctInput) {
        trainWriting();
    } else {
        showNext();
    }
}

// keyboard control //
const keyMonitor = ref('_');
function keyAction(key) {
    if(key === 'Shift') return;

    const actions = {
        initShowAnswer(key) {
            if(key === 'Enter') showAnswer();
        },
        evaluate(key) {
            if(key === 'g') {
                mark.value = marks.GOOD;
            } else if(key === 'b') {
                mark.value = marks.BAD;
            } else if(key === 'n') {
                mark.value = marks.NEUTRAL;
            } else if(key === 'Enter') {
                if(mark.value !== '' && !playback.on) saveProgress();
            }
        },
        initEvaluateTraining(key) {
            if(key === 'Enter') {
                evaluateTraining();
            } else { // in case that there was a miskate and the color is red
                theInput.value.style.color = 'black';
            }
        }
    };

    keyMonitor.value = key;

    actions[expectedAction](key);

    if(key === 'Alt') play();
}
document.addEventListener('keyup', (event) => keyAction(event.key));
</script>

<template>
    <p class="monitor">{{ keyMonitor }}</p>

    <input ref="theInput" type="text" />

    <p v-show="showTypedIn" class="typed-in" :style="{ color: typedInColor }">
        {{ typedIn }}
    </p>

    <main v-bind:class="mark">
        <p class="word">
            <span v-show="playback.on" class="playback"></span>
            <span v-html="word" />
            <span v-show="playback.on" class="playback"> 🔊</span>
        </p>
        <p class="transc">{{ transc }}</p>
        <p class="transl" v-html="transl" />
        <p class="example" v-html="example" />
    </main>
</template>

<style>
.monitor {
    font-size: 1.5rem;
    height: 1.5rem;
    margin: 0.2em;
}

input {
    width: 100%;
    text-align: center;
    font-size: 4rem;
    font-family: 'Times New Roman', Times, serif;
    font-style: italic;
}

.typed-in {
    text-align: center;
    font-size: 4rem;
    font-family: 'Times New Roman', Times, serif;
    font-style: italic;
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

.playback {
    display: inline-block;
    /* background: yellow; */
    width: 2em;
    font-size: 0.7em;
}

</style>