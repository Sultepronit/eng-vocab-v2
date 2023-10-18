import { getData } from '@/api.js';
import { updateMaxToRepeat } from '@/updateDB';

function prepareSession(data) {
    const session = {
        cards: data.parsedDb,
        nextRepeated: data.nextRepeated,
        repeatNumber: data.repeatNumber,
        learnList: [],
        confirmList: [],
        repeatList: [],
        content: []
    };

    for(let i = 0; i < data.parsedDb.length; i++) {
		if(data.parsedDb[i].s > data.maxToRepeat) continue;
		
		switch(data.parsedDb[i].s) {
			case 0:
				session.learnList.push(i);
				break;
			case 1:
				session.confirmList.push(i);
				break;
			default: 
                session.repeatList.push(i);
		}
	}

    const dif = session.repeatList.length - 400;
    //console.log(dif);
	if(dif < 0) {
        //console.log(data.maxToRepeat);
		data.maxToRepeat -= dif * 2;
        //console.log(data.maxToRepeat);
		updateMaxToRepeat(data.maxToRepeat);
	}

    console.log(session.learnList);
    console.log(session.confirmList);
    console.log(session.repeatList);

    console.log("repeat: " + session.repeatNumber);
	session.confirmNumber = Math.round(session.confirmList.length / data.confirmDivider);
	console.log("confirm: " + session.confirmNumber);
	session.learnNumber = session.learnList.length - 1;
	console.log("learn: " + session.learnNumber);

    for(let i = 0; i < session.repeatNumber; i++) session.content.push("REPEAT");
	for(let i = 0; i < session.confirmNumber; i++) session.content.push("CONFIRM");
	for(let i = 0; i < session.learnNumber; i++) session.content.push("LEARN");
	console.log(session.content);

    session.duration = session.content.length;

    //return new Promise(res => res(session));
    return session;
}

function parseDb(dataSheet) {
    const result = {
        parsedDb: [],
        nextRepeated: dataSheet[1][11],
        maxToRepeat: dataSheet[3][11],
        repeatNumber: dataSheet[5][11],
        confirmDivider: dataSheet[7][11]
    }

    for(let e of dataSheet) {
        if(isNaN(e[0])) break;
        //console.log(e);
        let obj = {
            s: e[0],
            f: e[1],
            b: e[2],
            word: e[6],
            transc: e[7],
            transl: e[8],
            example: e[9]
        };
        //console.log(obj);
        result.parsedDb.push(obj);
    }
    //console.log(result.parsedDb);
    console.log(result.parsedDb.length);

    return result;
}

async function startSession() {
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