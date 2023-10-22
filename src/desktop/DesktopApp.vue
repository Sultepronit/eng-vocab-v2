<script setup>
console.timeLog('tt', 'desktop setup!');
import '../assets/desktop.css';
import { ref, reactive } from 'vue';
import startSession from './startSession';
import nextCard from './nextCard';
import evaluate from './evaluate';
import { connectPlayback, preparePlaylist, startSpeaking } from '@/pronunciation';
import { directions, marks } from './enums';

// stats //
const progress = reactive({
    repeated: 0,
    good: 0,
    bad: 0,
    upgraded: 0,
    degraded: 0
});

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

// main display //
const word = ref('word');
const transc = ref('transcritption');
const transl = ref('translation');
const example = ref('example');

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

// session //
let session = {};
let current = {};
startSession().then((data) => {
    session = data;
    showNext();
    console.timeLog('tt', 'ready to go!');
});

//const mark = ref('');
const mark = ref(marks.NULL);
let correctInput = true;

let expectedAction = '';

// repeat cycle //
function showNext() {
    current = nextCard(session);
    //console.log(current);
    //mark.value = '';
    mark.value = marks.NULL;

    typedIn.value = '';

    word.value = current.direction === directions.FORWARD
        ? current.word.question : current.word.hint;

    transc.value = '';

    transl.value = current.direction === directions.BACKWARD
        ? current.card.transl : '';

    example.value = '';

    preparePlaylist(current.word.variants);

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

function evaluateAndSave() {
    console.log('save!');
    console.log(current);

    evaluate(progress, mark.value, current, session);

    if(current.direction === directions.FORWARD || !correctInput) {
        trainWriting();
    } else {
        showNext();
    }
}

// keyboard control //
const keyMonitor = ref('_');
//function keyAction(key) {
document.addEventListener('keyup', ({ key }) => {
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
                if(mark.value !== marks.NULL && !playback.on) evaluateAndSave();
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
    console.log(expectedAction);
    actions[expectedAction](key);

    if(key === 'Alt') play();
});
//document.addEventListener('keyup', (event) => keyAction(event.key));
</script>

<template>
    <p class="progress">
        <strong>{{ progress.repeated }}:</strong>
        {{ progress.good }}-{{ progress.bad }}
        <strong>{{ progress.upgraded }}-{{ progress.degraded }}</strong>
    </p>

    <p class="monitor">{{ keyMonitor }}</p>

    <input ref="theInput" type="text" />

    <p v-show="showTypedIn" class="typed-in" :style="{ color: typedInColor }">
        {{ typedIn }}
    </p>

    <main v-bind:class="mark.name">
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
