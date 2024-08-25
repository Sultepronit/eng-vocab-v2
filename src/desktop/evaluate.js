import { directions } from './enums';
import { updateNextRepeated } from './updateDB';


function upgradeOrDegrade(current, status) {
    current.card.s = status;
    current.card.f = 0;
    current.card.b = 0;
}

function evaluate(progress, mark, current, session) {
    progress.repeated++;
    progress[mark.name]++;
    console.log(progress);

    if(mark.increment === 1) {
        current.card[current.direction[0].toLowerCase()] = 1;
    } else {
        current.card[current.direction[0].toLowerCase()]--;
    }
    // if(current.direction === directions.FORWARD) {
    //     current.card.f += mark.increment;
    // } else { // backward
    //     current.card.b += mark.increment;
    // }

    // degrade
    if(mark.increment === -100) {
        progress.degraded++;
        current.card.toReturn = true;
        upgradeOrDegrade(current, 0);
        return;
    }

    // upgrade
    if(current.card.f > 0 && current.card.b > 0) {
        progress.upgraded++;
        // current.card.s = session.nextRepeated++;
        // current.card.f = 0;
        // current.card.b = 0;
        upgradeOrDegrade(current, session.nextRepeated++);

        updateNextRepeated(session.nextRepeated);
    }

    // if(current.card.f < -1 || current.card.b < -2) {
    //     progress.degraded++;
    //     current.card.toReturn = true;
    //     current.card.s = 0;
    //     current.card.f = 0;
    //     current.card.b = 0;
    // }

    //console.log(current.card);
}

export default evaluate;