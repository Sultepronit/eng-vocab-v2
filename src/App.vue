<script>
import startSession from '@/startSession.js';
export default {
  name: 'App',
  data() {
    return {
      sessionData: {
        //duration: 10
      },
      progress: 0
    }
  },
  methods: {
  },
  computed: {
    persentage() {
      return Math.round(this.progress / this.sessionData.duration * 100);
    }
  },
  created() {
    console.timeLog('tt', 'created!');
    /* this.session = startSession();
    console.log(this.session) */
    startSession().then(data => this.sessionData = data);
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

</template>

<style scoped>

</style>
