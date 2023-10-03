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

let waitingVariants = null;
let playbackIsWaiting = false;
let urlList = null;

fetchAudioUrls().then(result => {
    urlList = result;
    console.timeLog('tt', 'audio urls loaded!');
    if(waitingVariants) preparePlaylist(waitingVariants);
    if(playbackIsWaiting) speakNext();
});

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
    audio.src = url;
}

function playRecord(item) {
    if(counter > 0) prepareRecord(item);
    audio.play();
    console.log(audio.src);
}

function speakNext() {
    const item = playlist[counter];
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

    if(!urlList) {
        playbackIsWaiting = true;
        console.log('wating for url list!');
        return;
    }

    speakNext();
}

function prepareFirst() { // preloading first variant of pronunciation
    const item = playlist[0];
    if(item.type === 'play') prepareRecord(item);

    if(playbackIsWaiting) {
        playbackIsWaiting = false;
        speakNext();
    }
}

function preparePlaylist(variants) {
    if(!urlList) {
        waitingVariants = variants;
        return;
    }

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