<script setup>
import { ref, onMounted, reactive } from 'vue';
import startSession from './startSession';
import nextCard from './nextCard';
import { connectPlayback, preparePlaylist, startSpeaking } from '@/pronunciation';

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
const current = ref({});

const session = await startSession();
console.timeLog('tt', 'now we\'ll show the first card...');

onMounted(() => {
    showNext();
    console.timeLog('tt', 'ready to go!');
});

const mark = ref('');
const correctInput = ref(true);

const expectedAction = ref('');

// repeat cycle //
function showNext() {
    current.value = nextCard(session);
    console.log(current.value);
    mark.value = '';

    typedIn.value = '';

    word.value = current.value.direction === 'FORWARD'
        ? current.value.word.question : current.value.word.hint;

    transc.value = '';

    transl.value = current.value.direction === 'BACKWARD'
        ? current.value.card.transl : '';

    example.value = '';

    preparePlaylist(current.value.word.variants);

    if(current.value.direction === 'BACKWARD') {
        showTheInput();
    } else {
        hideTheInput();
    }
    expectedAction.value = 'initShowAnswer';
}

function evaluateAnswer() {
    hideTheInput();

    typedIn.value = theInput.value.value;
    if(theInput.value.value === current.value.word.question) {
        mark.value = 'good';
        correctInput.value = true;

        typedInColor.value = 'blue';
    } else {
        mark.value = 'bad';
        correctInput.value = false;

        typedInColor.value = 'red';
        if(typedIn.value === '') typedIn.value = '~';
    }
    theInput.value.value = '';
}

function showAnswer() {
    transc.value = current.value.card.transc;
    word.value = current.value.word.answer;
    if(current.value.direction === 'FORWARD') {
        transl.value = current.value.card.transl;
    } 
    example.value = current.value.card.example;

    if(current.value.direction === 'BACKWARD') {
        evaluateAnswer();
    }

    play();

    expectedAction.value = 'evaluate';
}

function trainWriting() {
    showTheInput();
    expectedAction.value = 'initEvaluateTraining';
}

function evaluateTraining() {
    if(theInput.value.value === current.value.word.question) {
        theInput.value.value = '';
        showNext();
    } else {
        theInput.value.style.color = 'red';
    }
}

function saveProgress() {
    console.log('save!');
    if(current.value.direction === 'FORWARD' || !correctInput.value) {
        trainWriting();
    } else {
        showNext();
    }
}

// keyboard control //
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

const keyMonitor = ref('_');
function keyAction(key) {
    if(key === 'Shift') return;

    keyMonitor.value = key;

    actions[expectedAction.value](key);

    if(key === 'Alt') {
        play();
    }
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