import { getData } from '@/api.js';
import { updateMaxToRepeat } from './updateDB';
import { pullRandomFromArray } from '@/commonFunctions';

let nextRepeated = 0;

function parseDb(dataSheet) {
    const cards = [];
    nextRepeated = dataSheet[10][11];
    let maxToRepeat = dataSheet[12][11];

    let id = 0;
    for(let e of dataSheet) {
        id++;
        if(isNaN(e[0])) break;
        
        if(e[0] < 2) continue;
        if(e[3] > maxToRepeat) continue;

        cards.push({
            id,
            s: e[3],
            f: e[4],
            b: e[5],
            word: e[6],
            transc: e[7],
            transl: e[8],
            example: e[9]
        });
    }
    //console.log(result.parsedDb);
    console.log(cards.length);

    const dif = cards.length - 400;
	if(dif < 0) {
		maxToRepeat -= dif * 2;
		updateMaxToRepeat(maxToRepeat);
	}

    return cards;
}

function prepareSession(data) {
    const content = [];
    for(let i = 0; i < 60; i++) {
        content.push(pullRandomFromArray(data));
    }

    return { content, nextRepeated };
}

async function startSession() {
    const dataSheet = await getData('db', 'A', 'L');

    const parsedDb = parseDb(dataSheet);
    console.log(parsedDb);

    const session = prepareSession(parsedDb);
    console.log(session);

    return new Promise(res => res(session));
}

export default startSession;