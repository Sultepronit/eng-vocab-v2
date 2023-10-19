<script>
import startSession from '@/startSession';
import nextCard from '@/nextCard';
import evaluate from '@/evaluate';
import { updateCard } from '@/updateDB';
import { saveSession, restoreSession } from '@/useLocalStorage';
import { connectPlayback, preparePlaylist, startSpeaking } from '@/pronunciation';

export default {
  //name: 'App',
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

      playback: { on: false },

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

    connectPlayback(this.playback);

    const restored = restoreSession();
    if(restored) {
      this.session = restored.session;
      this.progress = restored.progress;
      this.enableReset = true;
      console.timeLog('tt', 'now we\'ll get the first card...');
      this.showNext();
      console.timeLog('tt', 'ready to go!');
    } else {
      startSession().then(data => {
        this.session = data;
        console.timeLog('tt', 'now we\'ll get the first card...');
        this.showNext();
        console.timeLog('tt', 'ready to go!');
      });
    }
  },
  methods: {
    showNext() {
      this.buttons = 'SHOW';

      saveSession({ session: this.session, progress: this.progress });

      this.current = nextCard(this.session);
      preparePlaylist(this.current.word.variants);

      this.word = this.current.direction === 'FORWARD'
        ? this.current.word.question : this.current.word.hint;

      this.transc = '';

      this.transl = this.current.direction === 'BACKWARD'
        ? this.current.card.transl : '';

      this.example = '';
    },

    play() {
      this.playback.on = true;
      startSpeaking();
    },

    showAnswer() {
      this.buttons = 'EVALUATE';

      this.transc = this.current.card.transc;
      this.word = this.current.word.answer;
      if(this.current.direction === 'FORWARD') {
        this.transl = this.current.card.transl;
      } 
      this.example = this.current.card.example;

      this.enableReset = false;

      try {
        this.play();
      } catch (error) {
        alert(error);
      }
    },

    evaluateAndSave(mark) {
      console.log(mark);
      console.log(this.current);
      //console.log(this.session);

      const type = this.current.cardType.toLowerCase();
      evaluate[type](mark, this.progress[type], this.current, this.session);

      console.log(this.current.card);

      updateCard(this.current.cardId, this.current.card);

      //saveSession({ session: this.session, progress: this.progress });

      if(this.session.content.length < 1) {
        this.word = 'Happy End!';
        this.transc = '';
        this.transl = '';
        this.example = '';
        this.buttons = 'END';
        localStorage.clear();
      } else {
        this.showNext();
      }
    },

    reset() {
      localStorage.clear();
      location.reload();
    }
  }
}
  
</script>

<template>
  <header>
    <p class="progress">
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

    <div class="second-line">
      <p class="persentage">
          {{ `${showedCards}/${session.duration}: ${persentage}% ` }}
      </p>

      <p class="card">
        {{ `${this.current.cardId} [${this.current.card.s}]:` }}
        {{ `${this.current.card.f} ${this.current.card.b}` }}
      </p>
    </div>

    <p class="playButton" @click="play">
      <span v-show="!playback.on">🔈</span>
      <span v-show="playback.on">🔊</span>
    </p>
  </header>

  <main>
    <p class="word" v-html="word" @click="play" />
    <p class="transc">{{ transc }}</p>
    <p class="transl" v-html="transl" />
    <p class="example" v-html="example" />
  </main>

  <p class="reset" @click="reset" v-if="enableReset">↻</p>
  <section class="navig">
    <button class="show" v-show="buttons==='SHOW'" @click="showAnswer" />
    <section class="eval" v-show="buttons==='EVALUATE' && !playback.on">
      <button class="good" @click="evaluateAndSave('GOOD')" />
      <button class="neutral" @click="evaluateAndSave('NEUTRAL')" />
      <button class="bad" @click="evaluateAndSave('BAD')" /> 
    </section>
  </section>
</template>

<style scoped>

</style>
