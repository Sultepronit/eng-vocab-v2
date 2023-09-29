<template>
  <button @click="start">speak!</button>
</template>

<script>
import soundObject from '@/soundObject';
import { randomFromRange } from '@/commonFunctions';

export default {
    name: 'AudioComponent',
    props: ['variants', 'playback', 'setPlayback', 'trigger'],
    data() {
        return {
            playList: [],
            counter: 0,
            utterance: new SpeechSynthesisUtterance(),
            audio: new Audio()
        }
    },
    watch: {
        trigger() {
            this.start();
        },
        variants() {
            this.playList = [];
            for(let variant of this.variants) {
                console.log(variant);
                const urls = soundObject[variant.toLowerCase()];
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
                        text: variant
                    });
                }
            }
            console.log(this.playList);
        }
    },
    created() {
        this.audio.onended = this.utterance.onend = () => {
            console.log('It was good!');
            //console.log(this.counter, this.variants.length);
            if(++this.counter < this.variants.length) {
                this.speakNext();
            } else {
                console.log('Finished!');
                this.setPlayback(false);
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
        start() {
            this.setPlayback(true);
            this.counter = 0;
            this.speakNext();
        }
    }
}
</script>