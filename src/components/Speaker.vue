<template>
    <button @click="speak">speak!</button>
    <p>{{  word }}</p>
</template>

<script>
export default {
    name: 'Speaker',
    props: ['word'],
    data() {
        return {
            utterance: new SpeechSynthesisUtterance()
        }
    },
    methods: {
        speak() {
            console.log('here we go!');
            console.log(this.word);
            //const utterance = new SpeechSynthesisUtterance(this.word);
            //this.utterance.text = this.word;
            speechSynthesis.speak(this.utterance); 
        } 
    },
    watch: {
        word(newOne) {
           /*  console.log('the word has changed: ' + newOne);
            this.utterance.text = this.word; */
        }
    },
    created() {
        this.utterance.lang = 'en';
        this.utterance.rate = 0.8;
    }
}
</script>