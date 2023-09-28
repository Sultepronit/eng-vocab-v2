<script>
import startSession from '@/startSession';
import nextCard from '@/nextCard';
import { pron } from '@/pronunciation';
export default {
  //name: 'App',
  name: 'English',
  data() {
    return {
      sessionData: {},
      progress: 0,

      current: {},

      stage: 'QUESTION',

      word: 'word',
      transc: 'transcription',
      transl: 'translation',

      buttons: 'SHOW',
    }
  },
  methods: {
    showNext() {
      this.stage = 'QUESTION';
      this.buttons = 'SHOW';

      this.current = nextCard(this.sessionData);
      //pronunciation(this.audio, this.current.card.word);
      pron('load', this.current.card.word);

      this.word = this.current.direction === 'FORWARD'
        ? this.current.card.word : '';
      this.transc = '';
      this.transl = this.current.direction === 'BACKWARD'
        ? this.current.card.transl : '';
    },
    showAnswer() {
      this.stage = 'EVALUATION';
      this.buttons = 'EVALUATE';

      //this.audio.play();
      pron('play');

      this.transc = this.current.card.transc;
      if(this.current.direction === 'BACKWARD') {
        this.word = this.current.card.word;
      } else {
        this.transl = this.current.card.transl;
      }
    },
    play() {
      pron('play');
    }
  },
  computed: {
    persentage() {
      return Math.round(this.progress / this.sessionData.duration * 100);
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

  <p class="word">{{ word }}</p>
  <p class="transc">{{ transc }}</p>
  <p class="transl">{{ transl }}</p>

  <button v-show="buttons==='SHOW'" @click="showAnswer">show</button>
  <section v-show="buttons==='EVALUATE'">
    <button @click="showNext">plus</button>
    <button>neutral</button>
    <button>minus</button>
  </section>

  <!-- <p v-for="card in sessionData.content">{{ card }}</p> -->
  <!-- <p>{{ sessionData.content.length }}</p> -->

</template>

<style scoped>

</style>
