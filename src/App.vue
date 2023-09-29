<script>
import AudioComponent from './components/AudioComponent.vue';
import startSession from '@/startSession';
import nextCard from '@/nextCard';
export default {
  name: 'App',
  components: {
    AudioComponent
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
  methods: {
    showNext() {
      this.stage = 'QUESTION';
      this.buttons = 'SHOW';

      this.current = nextCard(this.sessionData);
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

      this.changeToPlay++;

      this.transc = this.current.card.transc;

      this.word = this.current.word.answer;

      if(this.current.direction === 'FORWARD') {
        this.transl = this.current.card.transl;
      } 
    },
    evaluateAndSave() {

    },
    changePlaybackStatus(change) {
        this.playback = change;
    },
  }
}
  
</script>

<template>
  <p>
    <strong>
      {{ progress }}/
      {{ sessionData.duration }}: 
      {{ persentage }}% |
    </strong>
    l:{{ sessionData.learnNumber }} |
    c:{{ sessionData.confirmNumber }} |
    r:{{ sessionData.repeatNumber }}
  </p>

  <audio-component
    :variants="current.word.variants"
    :playback="playback"
    :set-playback="changePlaybackStatus"
    :trigger="changeToPlay"
  />
  <p
    class="word"
    v-html="word"
  />
  <p class="transc">{{ transc }}</p>
  <p class="transl">{{ transl }}</p>

  <button
    v-show="buttons==='SHOW'"
    @click="showAnswer"
  >
    show
  </button>
  <section v-show="buttons==='EVALUATE' && !playback">
    <button @click="showNext">plus</button>
    <button>neutral</button>
    <button>minus</button>
  </section>
</template>

<style scoped>

</style>
