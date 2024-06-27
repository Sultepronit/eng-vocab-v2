<script>
import startSession from './startSession.js';
import nextCard from './nextCard';
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
        },
        remember: {
          minus: 0,
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
      | <i>{{ progress.remember.minus }}</i>
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

  </header>

  <main>
    <p class="word" v-html="word" @click="play" />
    <p class="transc">{{ transc }}</p>
    <p class="transl" v-html="transl" />
    <p class="example" v-html="example" />
  </main>

  <footer> 
    <p class="reset" @click="reset" v-if="enableReset">↻</p>

    <p class="playButton" @click="play">
        <span v-show="!playback.on">🔈</span>
        <span v-show="playback.on">🔊</span>
    </p>

    <section class="navig">
      <button class="show" v-show="buttons==='SHOW'" @click="showAnswer" />

      <section class="eval" v-show="buttons==='EVALUATE' && !playback.on">
        <button
          class="good"
          v-show="this.current.cardType !== 'REMEMBER'"
          @click="evaluateAndSave('GOOD')"
        />
        <button class="neutral" @click="evaluateAndSave('NEUTRAL')" />
        <button
          class="return"
          v-show="this.current.cardType === 'LEARN' || this.current.cardType === 'REMEMBER'"
          @click="evaluateAndSave('RETURN')"
        />
        <button
          class="bad"
          v-show="this.current.cardType !== 'REMEMBER'"
          @click="evaluateAndSave('BAD')"
        /> 
      </section>

    </section>
  </footer>
</template>

<style scoped>
header {
    margin: 0.5rem;   
    margin-bottom: 0;  
}

.second-line {
    display: flex;
    justify-content: space-between;
}

.persentage {
    font-weight: bold;
}

main {
    margin: 0.5rem;
    margin-top: 1.3rem;
    text-align: center;
}

.word {
    font-size: 2.2rem;
}

.transc {
    font-size: 1.5rem;
}

.transl {
    font-size: 1.5rem;
    margin: 0.5rem 0 0.5rem;
}

.example {
    font-size: 1.5rem;
    font-style: italic;
}

.playButton {
    position: absolute;
    bottom: var(--BUTTON-ZISE);
    left: calc(50% - 0.4em);
    /* top: 1.6rem; */
    /*width: 100%;*/
    text-align: center;
    font-size: 2rem;
}

.reset {
    position: fixed;
    bottom: var(--BUTTON-ZISE);
    margin-left: 0.5rem;
    font-size: 3rem;
    color: red;
}

.navig {
    position: fixed;
    /* position: sticky; */
    bottom: 0;

    height: var(--BUTTON-ZISE);
    width: 100%;

    display: flex;
}

.eval {
    flex-basis: var(--BUTTON-ZISE);
    flex-grow: 1;

    display: flex;
}

.navig button {
    flex-basis: var(--BUTTON-ZISE);
    flex-grow: 1;
    margin: 0.5rem;
    margin-bottom: 1rem;
    border-radius: 1rem;
    border: none;
    background: gray;
}

.navig button:active {
    background: yellow;
    border: 2px solid black;
}

button.good {
    background: green;
}

button.return {
  background: yellow;
}

button.bad {
    background: red;
}
</style>
