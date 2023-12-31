import { getData } from '@/api.js';
import { updateMaxToRepeat } from './updateDB';

function prepareSession(data) {
    const session = {
        cards: data.parsedDb,
        nextRepeated: data.nextRepeated,
        repeatList: [],
    };

    for(let i = 0; i < data.parsedDb.length; i++) {
        if(!data.parsedDb[i]) continue;
		if(data.parsedDb[i].s > data.maxToRepeat) continue;
		
		session.repeatList.push(i);
	}

    const dif = session.repeatList.length - 400;
	if(dif < 0) {
		data.maxToRepeat -= dif * 2;
		updateMaxToRepeat(data.maxToRepeat);
	}

    console.log(session.repeatList);

    return session;
}

function parseDb(dataSheet) {
    const result = {
        parsedDb: [],
        nextRepeated: dataSheet[10][11],
        maxToRepeat: dataSheet[12][11],
    }

    for(let e of dataSheet) {
        if(isNaN(e[0])) break;
        
        if(e[0] < 2) {
            result.parsedDb.push(null);
            continue;
        }

        let obj = {
            s: e[3],
            f: e[4],
            b: e[5],
            word: e[6],
            transc: e[7],
            transl: e[8],
            example: e[9]
        };
        result.parsedDb.push(obj);
    }
    //console.log(result.parsedDb);
    console.log(result.parsedDb.length);

    console.log(result);
    return result;
}

async function startSession() {
    console.timeLog('tt', 'fetching data!');
    const dataSheet = await getData('db', 'A', 'L');
    console.timeLog('tt', 'received data!');

    const parsedDb = parseDb(dataSheet);
    console.timeLog('tt', 'parsed sheet');

    const session = prepareSession(parsedDb);
    console.log(session);
    console.timeLog('tt', 'prepared session!');

    return new Promise(res => res(session));
}

export default startSession;