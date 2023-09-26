<script>
import startSession from '@/startSession.js';
import nextCard from '@/nextCard.js';
export default {
  name: 'App',
  data() {
    return {
      sessionData: {},
      progress: 0,

      current: {},

      word: 'word',
      transc: 'transcription',
      transl: 'translation',

      showButton: true
    }
  },
  methods: {
    showNext() {
      this.current = nextCard(this.sessionData);
      this.word = this.current.card.word;
      this.transc = this.current.card.transc;
      this.transl = this.current.card.transl;
    },
    showAnswer() {
      this.showButton = false;
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

  <p class="word">{{ word }}</p>
  <p class="transc">{{ transc }}</p>
  <p class="transl">{{ transl }}</p>

  <button v-show="showButton" @click="showAnswer">show</button>
  <section v-show="!showButton">
    <button @click="showNext">plus</button>
    <button>neutral</button>
    <button>minus</button>
  </section>

  <!-- <p v-for="card in sessionData.content">{{ card }}</p> -->
  <!-- <p>{{ sessionData.content.length }}</p> -->

</template>

<style scoped>

</style>
