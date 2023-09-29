<template>
    <button @click="speak">speak!</button>
    <p>{{ variants }}</p>
</template>

<script>
import soundObject from '@/soundObject';
import { randomFromRange } from '@/commonFunctions';

export default {
    name: 'Speaker',
    props: ['variants', 'setPlayback', 'trigger'],
    data() {
        return {
            playList: [],
            counter: 0,
            utterance: new SpeechSynthesisUtterance(),
            audio: new Audio()
        }
    },
    created() {
        this.audio.onended = this.utterance.onend = () => {
            console.log('It was good!');
            console.log(this.counter, this.variants.length);
            if(++this.counter < this.variants.length) {
                this.speakNext();
            } else {
                console.log('Finished!');
                this.setPlayback(false);
                //this.finishedSpeaking();
            }
        } 
        this.utterance.lang = 'en';
        this.utterance.rate = 0.8;
    },
    methods: {
        playRecord(item) {
            const url = item.getNextUrl();
            console.log(url);
            this.audio.src = url;
            this.audio.play();
        },
        generateSpeech(text) {
            this.utterance.text = text;
            speechSynthesis.speak(this.utterance);
        },
        speakNext() {
            const item = this.playList[this.counter];
            console.log(item);
            if(item.type === 'play') {
                this.playRecord(item);
            } else {
                this.generateSpeech(item.text);
            }
        },
        speak() {
            console.log('here we go!');
            this.setPlayback(true);
            this.counter = 0;
            this.speakNext();
        }
    },
    watch: {
        trigger(newStatus) {
            console.log(newStatus);
            this.speak();
        },
        variants(newOne) {
            console.log('the variants has changed: ' + newOne);
            console.log(newOne.length);
            this.playList = [];
            for(let v of this.variants) {
                console.log(v);
                const urls = soundObject[v.toLowerCase()];
                console.log(urls);
                if(urls) {
                    this.playList.push({
                        type: 'play',
                        urls,
                        index: randomFromRange(0, urls.length - 1),
                        getNextUrl() {
                            this.index = (this.index + 1) < this.urls.length ? this.index + 1 : 0;
                            return this.urls[this.index];
                        }
                    });
                } else {
                    this.playList.push({
                        type: 'generate',
                        text: v
                    });
                }
            }
            console.log(this.playList);
        }
    }
}
</script>