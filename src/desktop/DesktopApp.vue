<script setup>
import { ref, reactive } from 'vue';
import { directions, marks } from './enums';
import startSession from './startSession';
import nextCard from './nextCard';
import evaluate from './evaluate';
import { updateCard } from './updateDB';
import { connectPlayback, preparePlaylist, startSpeaking } from '@/pronunciation';

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
const keyMonitor = ref('_');
let processAction = null;

startSession().then((data) => {
    session = data;

    document.addEventListener('keyup', ({ key }) => {
        if(key === 'Shift') return
        keyMonitor.value = key;

        processAction(key);
        if(key === 'Alt') play();
    });

    showNext();
    console.timeLog('tt', 'ready to go!');
});

// repeat cycle //
const mark = ref(marks.NULL);
let correctInput = true;
let current = {};
const displayStage = ref('');

function showNext() {
    current = reactive( nextCard(session) );
    displayStage.value = current.direction;
    typedIn.value = '';
    mark.value = marks.NULL;
    preparePlaylist(current.word.variants);
    current.direction === directions.FORWARD ? hideTheInput() : showTheInput();
    
    processAction = (key) => { if(key === 'Enter') showAnswer() };
}

function evaluateAnswer() {
    hideTheInput();
    typedIn.value = theInput.value.value;
    theInput.value.value = '';
    if(typedIn.value === current.word.question) {
        mark.value = marks.GOOD;
        correctInput = true;
        typedInColor.value = 'blue';
    } else {
        mark.value = marks.BAD;
        correctInput = false;
        typedInColor.value = 'red';
        if(typedIn.value === '') typedIn.value = '~';
    }
}

function showAnswer() {
    displayStage.value = 'answer';
    if(current.direction === directions.BACKWARD) evaluateAnswer();
    play();

    processAction = (key) => {
        if(key === 'g') {
            mark.value = marks.GOOD;
        } else if(key === 'b') {
            mark.value = marks.BAD;
        } else if(key === 'n') {
            mark.value = marks.NEUTRAL;
        } else if(key === 'Enter') {
            if(mark.value.name !== marks.NULL.name && !playback.on) {
                evaluateAndSave();
            }  
        }
    };
}

function trainWriting() {
    showTheInput();
    
    processAction = (key) => {
        if(key === 'Enter') {
            evaluateTraining();
        } else { // in case that there was a miskate and the color is red
            theInput.value.style.color = 'black';
        }
    };
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
    updateCard(current.cardId, current.card);

    if(current.direction === directions.FORWARD || !correctInput) {
        trainWriting();
    } else {
        showNext();
    }
}
</script>

<template>
<div class="body">
    <p class="progress">
        <strong>{{ progress.repeated }}:</strong>
        {{ progress.good }}-{{ progress.bad }}
        <strong>{{ progress.upgraded }}-{{ progress.degraded }}</strong>
    </p>

    <p class="card-stats">
        {{ current.cardId }} [{{ current.card?.s }}]:
        {{ current.card?.f }} {{ current.card?.b }}
    </p>

    <p class="monitor">{{ keyMonitor }}</p>

    <input ref="theInput" type="text" />
    <p class="typed-in" v-show="showTypedIn" :style="{ color: typedInColor }">
        {{ typedIn }}
    </p>

    <main v-bind:class="mark.name">
        <p class="word">
            <span v-show="playback.on" class="playback"></span>
            
            <span
                v-show="displayStage === 'forward'"
                v-html="current.word?.question"
            />
            <span
                v-show="displayStage === 'backward'"
                v-html="current.word?.hint"
            />
            <span
                v-show="displayStage === 'answer'"
                v-html="current.word?.answer"
            />
            <span v-show="playback.on" class="playback"> 🔊</span>
        </p>
        
        <p class="transc" v-show="displayStage === 'answer'">
            {{ current.card?.transc }}
        </p>
        
        <p
            class="transl"
            v-show="displayStage === 'backward' || displayStage === 'answer'"
            v-html="current.card?.transl"
        />
        
        <p
            class="example"
            v-show="displayStage === 'answer'"
            v-html="current.card?.example"
        />
    </main>
</div>
</template>

<style scoped>
.body {
    padding: 0.5rem;
}
.progress {
    font-size: 1.4rem;
}
.card-stats {
    font-size: 1.4rem;
}

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
    text-align: center;
}

.word {
    font-size: 4rem;
}

.transc {
    font-size: 2.5rem;
}

.transl {
    font-size: 2.5rem;
    margin: 0.5rem 0 1rem;
}

.example {
    font-size: 2.5rem;
    font-style: italic;
}
.good {
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
    font-size: 0.6em;
}
</style>