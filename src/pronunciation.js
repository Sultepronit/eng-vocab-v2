//import urlList from '../public/recordUrls.json';
//import { urlKeys, urlList } from '@/recordUrls';
//import { urlKeys } from '@/recordUrls';
import fetchAudioUrls from './fetchAudioUrls';
import { randomFromRange } from '@/commonFunctions';
import { generateSpeech } from './speechSynth';



const audio = new Audio();
const playlist = [];
let counter = 0;

const urlKeys = {
	"a": "https://s3.amazonaws.com/audio.vocabulary.com/1.0/us/",
	"cb": "https://dictionary.cambridge.org/us/media/english/uk_pron/",
	"ca": "https://dictionary.cambridge.org/us/media/english/us_pron/",
	"oa": "https://www.onelook.com/pronounce/macmillan/US/",
	"ob": "https://www.onelook.com/pronounce/macmillan/UK/"
};

let urlList = {};
fetchAudioUrls().then(result => urlList = result);

console.log(urlList);

let playback = {};
function endedSpeaking() {
    if(++counter < playlist.length) {
        speakNext();
        //console.log('Ended speaking one!');
    } else {
        playback.on = false;
        prepareFirst();
        if(counter > 1) console.log('Ended all the speech!');
    }
}
audio.onended = endedSpeaking;

console.log('the audio is created!');

function prepareRecord(item) {
    const url = item.getNextUrl();
    //console.log(url);
    audio.src = url;
}

function playRecord(item) {
    if(counter > 0) prepareRecord(item);
    audio.play();
    console.log(audio.src);
}

function speakNext() {
    const item = playlist[counter];
    //console.log(item);
    if(item.type === 'play') {
        playRecord(item);
    } else {
        generateSpeech(item.text);
        console.log('generate ' + item.text + '!');
    }
}

function startSpeaking(pi) {
    playback = pi;
    counter = 0;
    speakNext();
}

function prepareFirst() { // preloading first variant of pronunciation
    const item = playlist[0];
    //console.log(item);
    if(item.type === 'play') {
        prepareRecord(item);
    }
}

function preparePlaylist(variants) {
    playlist.length = 0;

    for(const variant of variants) {
        const shortUrls = urlList[variant.toLowerCase()];
        //const shortUrls = null;
        if(shortUrls) {
            playlist.push({
                type: 'play',
                shortUrls,
                index: randomFromRange(0, shortUrls.length - 1),
                getNextUrl() {
                    this.index = ((this.index + 1) < this.shortUrls.length)
                        ? this.index + 1 : 0;
                    const urlParts = this.shortUrls[this.index].split('*');
                    const head = urlKeys[urlParts[0]];
                    return head + urlParts[1];
                }
            });
        } else {
            playlist.push({
                type: 'generate',
                text: variant
            });
        }
    }
    console.log('playlist:');
    console.log(playlist);
    prepareFirst();
}

export { preparePlaylist, startSpeaking, endedSpeaking };