<script>
import Speaker from './components/Speaker.vue';
import startSession from '@/startSession';
import nextCard from '@/nextCard';
import { pron } from '@/pronunciation';
export default {
  name: 'App',
  components: {
    Speaker
  },
  data() {
    return {
      sessionData: {},
      progress: 0,

      current: {
        word: { variants: [] }
      },

      stage: 'QUESTION',

      word: 'word',
      transc: 'transcription',
      transl: 'translation',

      buttons: 'SHOW',

      playback: false,
      changeToPlay: 0
    }
  },
  methods: {
    showNext() {
      this.stage = 'QUESTION';
      this.buttons = 'SHOW';

      this.current = nextCard(this.sessionData);
      //pronunciation(this.audio, this.current.card.word);
      //pron('load', this.current.card.word);
      console.log(this.current.word);
      this.word = this.current.direction === 'FORWARD'
        ? this.current.word.question : this.current.word.hint;
      this.transc = '';
      this.transl = this.current.direction === 'BACKWARD'
        ? this.current.card.transl : '';
    },
    showAnswer() {
      this.stage = 'EVALUATION';
      this.buttons = 'EVALUATE';

      //this.audio.play();
      //pron('play');
      //this.playback = true;
      //this.changePlaybackStatus(false);
      this.changeToPlay++;

      this.transc = this.current.card.transc;
      this.word = this.current.word.answer;
      if(this.current.direction === 'BACKWARD') {
        //this.word = this.current.card.word;
        //this.word = this.current.word.answer;
      } else {
        this.transl = this.current.card.transl;
      }
    },
    play() {
      pron('play');
    },
    changePlaybackStatus(change) {
        console.log('change??');
        this.playback = change;
        console.log(this.playback);
    },
  },
  computed: {
    persentage() {
      return Math.round(this.progress / this.sessionData.duration * 100);
    }
  },
  watch: {
    playback(status) {
      console.log('playback: ', status);
    }
  },
  created() {
    console.timeLog('tt', 'created!');
    startSession().then(data => {
      this.sessionData = data;
      this.showNext();
    });
    //this.audio = new Audio();
    //console.log(pron);
  },
}
  
</script>

<template>
  <p>
    <strong>
    {{ progress }}/
    {{ sessionData.duration }}: 
    {{ persentage }}% | </strong>
    l:{{ sessionData.learnNumber }} |
    c:{{ sessionData.confirmNumber }} |
    r:{{ sessionData.repeatNumber }}

  </p>

  <button @click="play">play</button>
  <speaker
    :variants="current.word.variants"
    :playback="playback"
    :set-playback="changePlaybackStatus"
    :trigger="changeToPlay"
  />
  <p class="word" v-html="word"></p>
  <p class="transc">{{ transc }}</p>
  <p class="transl">{{ transl }}</p>

  <button v-show="buttons==='SHOW'" @click="showAnswer">show</button>
  <section v-show="buttons==='EVALUATE' && !playback">
    <button @click="showNext">plus</button>
    <button>neutral</button>
    <button>minus</button>
  </section>

</template>

<style scoped>

</style>
