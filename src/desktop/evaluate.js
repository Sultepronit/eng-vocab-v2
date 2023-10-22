import { directions } from './enums';

function evaluate(progress, mark, current, session) {
    progress.repeated++;
    progress[mark.name]++;

    console.log(session.nextRepeated);
    console.log(current.card);

    if(current.direction === directions.FORWARD) {
        current.card.f += mark.increment;
    } else { // backward
        current.card.b += mark.increment;
    }

    if(current.card.f > 0 && current.card.b > 0) {
        progress.upgraded++;
        current.card.s = session.nextRepeated++;
        current.card.f = 0;
        current.card.b = 0;

        //updateNextRepeated(session.nextRepeated);

        //return;
    }

    if(current.card.f < -1 || current.card.b < -2) {
        progress.degraded++;
        current.card.return = true;
        current.card.s = 0;
        current.card.f = 0;
        current.card.b = 0;
    }

    console.log(current.card);
}

export default evaluate;