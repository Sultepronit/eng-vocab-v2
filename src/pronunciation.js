import fetchAudioUrls from './fetchAudioUrls';
import { randomFromRange } from '@/commonFunctions';
import { generateSpeech } from './speechSynth';
const theModule = await import(import.meta.env.VITE_MY_SYNTH_FN);
const urlsForExpression = theModule.default;

const audio = new Audio();
const playlist = [];
let versionCounter = 0;
let errorCounter = 0;

let urlList = null;
const urlKeys = {
	"a": "https://s3.amazonaws.com/audio.vocabulary.com/1.0/us/",
	"cb": "https://dictionary.cambridge.org/us/media/english/uk_pron/",
	"ca": "https://dictionary.cambridge.org/us/media/english/us_pron/",
	"oa": "https://www.onelook.com/pronounce/macmillan/US/",
	"ob": "https://www.onelook.com/pronounce/macmillan/UK/"
};

let playback = {};
const connectPlayback = (pb) => playback = pb;

function endedSpeaking() {
    errorCounter = 0;
    if(++versionCounter < playlist.length) {
        speakNext();
    } else {
        playback.on = false;
        prepareFirst(); // preloading first variant of pronunciation for repeat
        if(versionCounter > 1) console.log('Ended all the speech!');
    }
}

audio.onended = endedSpeaking;

function prepareRecord(item) {
    const url = item.getNextUrl();
    audio.src = url;
}

function playRecord(item) {
    if(versionCounter > 0) prepareRecord(item);
    //audio.play();
    const playing = audio.play(); // pormise
    playing.then().catch((err) => {
        console.warn(err);
        if(errorCounter++ > 2) {
            console.warn('No good source - will be generated!');
            playlist[versionCounter].type = 'generate';
            generateSpeech(item.text);
        } else {
            console.warn('Trying to load next url!');
            prepareRecord(item);
            playRecord(item);
        }
    });
    console.log(audio.src);
}

function speakNext() {
    const item = playlist[versionCounter];
    if(item.type === 'play') {
        playRecord(item);
    } else {
        generateSpeech(item.text);
        console.log('generate ' + item.text + '!');
    }
}

function startSpeaking() {
    versionCounter = 0;
    speakNext();
}

function prepareFirst() { // preloading first variant of pronunciation
    const item = playlist[0];
    if(item.type === 'play') prepareRecord(item);
}

function preparePlaylist(variants) {
    playlist.length = 0;

    for(const variant of variants) {
        const shortUrls = urlList[variant.toLowerCase()];
        // const shortUrls = null;
        if(shortUrls) {
            playlist.push({
                type: 'play',
                text: variant,
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
                type: 'play',
                text: variant,
                urls: urlsForExpression(variant),
                index: 0,
                getNextUrl() {
                    const url = this.urls[this.index++];
                    if(this.index >= this.urls.length) this.index = 0;
                    return url;
                }
            });
        }
        
        // else {
        //     playlist.push({
        //         type: 'generate',
        //         text: variant
        //     });
        // }
    }
    console.log('playlist:');
    console.log(playlist);
    prepareFirst();
}

let playbackIsWaiting = false;
let stsp = () => {
    playbackIsWaiting = true;
    console.log('Wating for the url list!');
}
const exportStartSpeaking = (pi) => stsp(pi);

let waitingVariants = null;
let ppl = (variants) => waitingVariants = variants;
const exportPreparePlaylist = (variants) => ppl(variants);


fetchAudioUrls().then(result => {
    urlList = result;
    console.timeLog('tt', 'audio urls loaded!');
    
    ppl = preparePlaylist;
    stsp = startSpeaking;
    if(waitingVariants) preparePlaylist(waitingVariants);
    if(playbackIsWaiting) startSpeaking();
});

export {
    connectPlayback,
    exportPreparePlaylist as preparePlaylist,
    exportStartSpeaking as startSpeaking,
    endedSpeaking
};