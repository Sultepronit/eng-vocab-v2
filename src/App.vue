<script>
import AudioComponent from './components/AudioComponent.vue';
import { preparePlaylist } from './pronunciation';
import startSession from '@/startSession';
import nextCard from '@/nextCard';
import evaluate from '@/evaluate';
import { updateCard } from './updateDB';
import { saveSession, restoreSession } from '@/useLocalStorage';

export default {
  name: 'App',
  components: {
    AudioComponent
  },
  data() {
    return {
      session: {
        content: []
      },
      
      progress: {
        learn: {
          plus: 0,
          minus: 0,
          upgraded: 0
        },
        confirm: {
          plus: 0,
          minus: 0,
          upgraded: 0,
          degraded: 0
        },
        repeat: {
          plus: 0,
          minus: 0,
          upgraded: 0,
          degraded: 0
        }
      },

      current: {
        word: { variants: [] },
        card: { s: 0 }
      },

      playback: false,
      changeToPlay: 0,

      word: 'word',
      transc: 'transcription',
      transl: 'translation',
      example: 'example',
      buttons: 'SHOW',

      enableReset: false
    }
  },
  computed: {
    showedCards() {
      return this.session.duration - this.session.content.length;
    },
    persentage() {
      return Math.round(this.showedCards / this.session.duration * 100);
    }
  },
  created() {
    console.timeLog('tt', 'created!');

    const restored = restoreSession();
    if(restored) {
      this.session = restored.session;
      this.progress = restored.progress;
      this.enableReset = true;
      this.showNext();
      console.timeLog('tt', 'ready to go!');
    } else {
      startSession().then(data => {
        this.session = data;
        this.showNext();
        console.timeLog('tt', 'ready to go!');
      });
    }
  },
  methods: {
    showNext() {
      this.buttons = 'SHOW';

      preparePlaylist(this.current.word.variants);

      this.current = nextCard(this.session);

      this.word = this.current.direction === 'FORWARD'
        ? this.current.word.question : this.current.word.hint;

      this.transc = '';

      this.transl = this.current.direction === 'BACKWARD'
        ? this.current.card.transl : '';

      this.example = '';
    },
    showAnswer() {
      this.buttons = 'EVALUATE';

      //this.changeToPlay++;

      this.transc = this.current.card.transc;
      this.word = this.current.word.answer;
      if(this.current.direction === 'FORWARD') {
        this.transl = this.current.card.transl;
      } 
      this.example = this.current.card.example;

      this.enableReset = false;
    },
    evaluateAndSave(mark) {
      console.log(mark);
      console.log(this.current);
      //console.log(this.session);

      const type = this.current.cardType.toLowerCase();
      evaluate[type](mark, this.progress[type], this.current, this.session);

      console.log(this.current.card);

      updateCard(this.current.cardId, this.current.card);

      saveSession({ session: this.session, progress: this.progress });

      if(this.session.content.length < 1) {
        this.word = 'Happy End!';
        this.buttons = 'END';
      } else {
        this.showNext();
      }
    },

    changePlaybackStatus(change) {
        this.playback = change;
    },

    reset() {
      localStorage.clear();
      location.reload();
    }
  }
}
  
</script>

<template>
  <p class="progress">
    <strong>
      {{ `${showedCards}/${session.duration}: ${persentage}% ` }}
    </strong>
    |
    l:{{ session.learnNumber }}
    {{ `${progress.learn.plus}-${progress.learn.minus}` }}
    <strong>{{ progress.learn.upgraded }}</strong>
    |
    c:{{ session.confirmNumber }} 
    {{ `${progress.confirm.plus}-${progress.confirm.minus}` }}
    <strong>{{ `${progress.confirm.upgraded}-${progress.confirm.degraded}` }}</strong>
    |
    r:{{ session.repeatNumber }}
    {{ `${progress.repeat.plus}-${progress.repeat.minus}` }}
    <strong>{{ `${progress.repeat.upgraded}-${progress.repeat.degraded}` }}</strong>
  </p>

  <p class="card">
    {{ `${this.current.cardId} [${this.current.card.s}]:` }}
    {{ `${this.current.card.f} ${this.current.card.b}` }}
  </p>

  <audio-component
    :variants="current.word.variants"
    :playback="playback"
    :set-playback="changePlaybackStatus"
    :trigger="changeToPlay"
  />

  <main>
    <p class="word" v-html="word" />
    <p class="transc">{{ transc }}</p>
    <p class="transl">{{ transl }}</p>
    <p class="example" v-html="example" />
  </main>

  <p class="reset" @click="reset" v-if="enableReset">↻</p>
  <section class="navig">
    <button class="show" v-show="buttons==='SHOW'" @click="showAnswer" />
    <section class="eval" v-show="buttons==='EVALUATE' && !playback">
      <button class="good" @click="evaluateAndSave('GOOD')" />
      <button @click="evaluateAndSave('NEUTRAL')" />
      <button class="bad" @click="evaluateAndSave('BAD')" /> 
    </section>
  </section>
</template>

<style scoped>

</style>
