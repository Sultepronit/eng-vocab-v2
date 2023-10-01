<template>
  <button @click="start">speak!</button>
  <span>{{ numberOfVoices }}</span>
</template>

<script>
import { urlKeys, urlList } from '@/recordUrls';
import { randomFromRange } from '@/commonFunctions';

export default {
    name: 'AudioComponent',
    props: ['variants', 'playback', 'setPlayback', 'trigger'],
    data() {
        return {
            playList: [],
            counter: 0,

            utterance: new SpeechSynthesisUtterance('Hello there!'),
            voices: [],
            numberOfVoices: 0,

            audio: new Audio(),
            //urlKeys: {}
        }
    },
    watch: {
        trigger() {
            this.start();
        },
        variants() {
            this.preparePlayList();
        }
    },
    beforeCreate() {
        console.log('before create audio')
        const utterance = new SpeechSynthesisUtterance('Hello there!');
        speechSynthesis.speak(utterance);
        setTimeout(() => {
            const voices = speechSynthesis.getVoices();
            //console.log(voices);
            for(let voice of voices) {
                if(voice.lang.match('en')) {
                    //console.log(voice);
                    this.voices.push(voice);
                }
            }
            this.numberOfVoices = this.voices.length;
            console.log(this.voices);
        }, 2000);
    },
    created() {
        this.audio.onended = this.utterance.onend = () => {
            //console.log('It was good!');
            //console.log(this.counter, this.variants.length);
            if(++this.counter < this.variants.length) {
                this.speakNext();
            } else {
                //console.log('Finished!');
                this.setPlayback(false);
                // preloading first variant of pronunciation for next manual play
                this.prepareFirst(); 
            }
        } 
        this.audio.oncanplaythrough = () => console.log('Loaded!');

        this.utterance.lang = 'en';
        this.utterance.rate = 0.8;
    },
    methods: {
        prepareRecord(item) {
            const url = item.getNextUrl();
            console.log(url);
            this.audio.src = url;
        },
        playRecord(item) {
            if(this.counter > 0) this.prepareRecord(item);
            this.audio.play();
        },
        prepareUtterance(text) {
            this.utterance.text = text;
            console.log('utter ' + text);
        },
        generateSpeech(text) {
            if(this.counter > 0) this.prepareUtterance(text);
            speechSynthesis.speak(this.utterance);
        },
        speakNext() {
            const item = this.playList[this.counter];
            //console.log(item);
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
        },
        prepareFirst() { // preloading first variant of pronunciation
            const item = this.playList[0];
            //console.log(item);
            if(item.type === 'play') {
                this.prepareRecord(item)
            } else {
                if(this.numberOfVoices > 1) {
                    this.utterance.voice
                        = this.voices[ randomFromRange(0, this.numberOfVoices - 1) ];
                    console.log(this.utterance.voice);
                }
                this.prepareUtterance(item.text);
            }
        },
        preparePlayList() {
            this.playList = [];
            for(let variant of this.variants) {
                const shortUrls = urlList[variant.toLowerCase()];
                if(shortUrls) {
                    this.playList.push({
                        type: 'play',
                        shortUrls,
                        index: randomFromRange(0, shortUrls.length - 1),
                        getNextUrl() {
                            this.index = ((this.index + 1) < this.shortUrls.length)
                                ? this.index + 1 : 0;
                            const urlParts = this.shortUrls[this.index].split('*');
                            const urlKey = urlKeys[urlParts[0]];
                            return urlKey + urlParts[1];
                        }
                    });
                } else {
                    this.playList.push({
                        type: 'generate',
                        text: variant
                    });
                }
            }
            console.log('playList:');
            console.log(this.playList);
            this.prepareFirst();
        }
    }
}
</script>