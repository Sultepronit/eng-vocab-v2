import soundObject from '@/soundObject';

const prepFn = () =>  {
    const audio = new Audio();
    let word = '';
    let urls = [];
    let index = 0;
    let errorCount = 0;

    audio.oncanplay = () => console.log('can play!');

    audio.onended = () => {
        console.log('it was gooood!');
        if(urls.length > 1) {
            index = index + 1 < urls.length ? index + 1 : 0;
            audio.src = urls[index];
        }
    }

    audio.onerror = () => {
        //console.log()
        console.log('playback error', errorCount);
        if(urls.length > 1  && errorCount++ < 10) {
            index = index + 1 < urls.length ? index + 1 : 0;
            audio.src = urls[index];
        }
    }

    const utterance = new SpeechSynthesisUtterance('hello there!');
    utterance.lang = 'en';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
    
    return (req, wordArg) => {
        if(req === 'load') {
            word = wordArg;
            urls = soundObject[word.toLowerCase()];
            //urls = soundObject[word.toUpperCase()];
            console.log(urls);
            index = 0;
            if(urls) {
                audio.src = urls[index];
                errorCount = 0;
            } else {
                utterance.text = word;
            }
        } else /* if(req === 'play') */ {
            if(urls) {
                audio.play();
            } else {
                speechSynthesis.speak(utterance);
            }
        }
    }
}

const pron = prepFn();
//const pron = prepFn;

export { pron };