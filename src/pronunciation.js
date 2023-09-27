import soundObject from '@/soundObject';

export default function load(audio, word) {
    const urls = soundObject[word.toLowerCase()];
    console.log(urls);
    if('length' in urls) {
        audio.src = urls[0];
        console.log(audio.preload);
    }
}
    //audio.play();

const prepFn = () =>  {
    const audio = new Audio();
    let word = '';
    let urls = [];
    let index = 0;
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
                console.log(audio.preload);
            } else {
                utterance.text = word;
            }
        } else /* if(req === 'play') */ {
            if(urls) {
                audio.play();
                audio.onended = () => {
                    console.log('it was gooood!');
                    if(urls.length > 1) {
                        index = index + 1 < urls.length ? index + 1 : 0;
                        audio.src = urls[index];
                    }
                }
            } else {
                //utterance.text(word);
                //utterance.text = word;
                speechSynthesis.speak(utterance);
            }
        }
    }
}

const pron = prepFn();
//const pron = prepFn;

export { pron };