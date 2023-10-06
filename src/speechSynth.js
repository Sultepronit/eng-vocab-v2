import { endedSpeaking } from "./pronunciation";
import { randomFromRange } from "./commonFunctions";

const utterance = new SpeechSynthesisUtterance();
utterance.lang = 'en';
utterance.rate = 0.8;
const voices = [];

function changeVoice() {
    if(voices.length > 1) {
        utterance.voice
            = voices[ randomFromRange(0, voices.length - 1) ];
        //console.log(utterance.voice);
    }
}

speechSynthesis.speak(new SpeechSynthesisUtterance('Hello!'));
setTimeout(() => {
    const allVoices = speechSynthesis.getVoices();
    //console.log(voices);
    for(const voice of allVoices) {
        //if(voice.lang.match('en')) {
        if(voice.lang.match('en-US') || voice.lang.match('en-GB')) {
            //console.log(voice);
            voices.push(voice);
        }
    }
    console.log(voices);
    changeVoice();
}, 2000);

utterance.onend = () => {
    endedSpeaking();
    changeVoice();
}

console.log('the speech synthesis is ready!');

function generateSpeech(text) {
    utterance.text = text;
    speechSynthesis.speak(utterance);
    console.log(utterance?.voice?.name);
}

export { generateSpeech };