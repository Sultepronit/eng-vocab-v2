import { urlKeys, urlList } from '@/recordUrls';
import { randomFromRange } from '@/commonFunctions';

const audio = new Audio();
const playlist = [];
const counter = 0;

audio.onended = () => {
    console.log('Ended playing!');
}
console.log('the audio is created!');

function preparePlaylist(variants) {
    playlist.length = 0;
    console.log(variants);
    for(let variant of variants) {
        const shortUrls = urlList[variant.toLowerCase()];
        console.log(shortUrls);
        if(shortUrls) {
            playlist.push({
                type: 'play',
                shortUrls,
                index: randomFromRange(0, shortUrls.length - 1),
                getNextUrl() {
                    this.index = ((this.index + 1) < this.shortUrls.length)
                        ? this.index + 1 : 0;
                    const urlParts = this.shortUrls[this.index].split('*');
                    const urlKey = urlKeys[urlParts[0]];
                    return urlKey + urlParts[1];
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
    //prepareFirst();
}

export { preparePlaylist };