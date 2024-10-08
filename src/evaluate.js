import { updateNextRepeated } from '@/updateDB';

function basicIncrement(mark, progress, current) {
    if(mark === 'GOOD') {
        progress.plus++;
        current.card[current.direction[0].toLowerCase()] = 1;
    } else {
        progress.minus++;
        current.card[current.direction[0].toLowerCase()]--;
    }
}

function returnCard(current, session) {
    session.content.push('REMEMBER');
    session.rememberList.push(current.cardId);
    console.log("I'm back!");
    console.log(session.rememberList);
}

function upgradeOrDegrade(current, status) {
    current.card.s = status;
    current.card.f = 0;
    current.card.b = 0;
}

function remember(mark, progress, current, session) {
    basicIncrement(mark, progress, current);

    if(mark === 'RETURN') {
        returnCard(current, session);
    }
}

function learn(mark, progress, current, session) {
    basicIncrement(mark, progress, current);

    // degrade
    if(mark === 'BAD') {
        upgradeOrDegrade(current, 0);
    }

    // return
    if(mark === 'BAD' || mark === 'RETURN') {
        returnCard(current, session);
        return;
    }

    // upgrade
    if(current.card.f > 0 && current.card.b > 0) {
        progress.upgraded++;
        upgradeOrDegrade(current, 1);
    }
}

function repeat(mark, progress, current, session) {
    basicIncrement(mark, progress, current);

    // degrade
    if(mark === 'BAD') {
        progress.degraded++;
        upgradeOrDegrade(current, 0);
        return;
    }

    // return
    if(mark === 'RETURN') {
        returnCard(current, session);
        return;
    }

    // upgrade
    if(current.card.f > 0 && current.card.b > 0) {
        progress.upgraded++;
        upgradeOrDegrade(current, session.nextRepeated++);
        updateNextRepeated(session.nextRepeated);
    }
}

function confirm(mark, progress, current) {
    basicIncrement(mark, progress, current);

    // degrade
    if(mark === 'BAD') {
        progress.degraded++;
        upgradeOrDegrade(current, 0);
        return;
    }

    // upgrade
    if(current.card.f > 0 && current.card.b > 0) {
        progress.upgraded++;
        upgradeOrDegrade(current, 2);
    }
}

// function confirmAndRepeat(mark, progress, current, newStatus) {
//     if(mark === 'GOOD') {
//         progress.plus++;
//     } else if(mark === 'BAD') {
//         progress.minus++;
//     }

//     const change = mark === 'GOOD' ? 1
//         : mark === 'BAD' ? -1 : 0;
        
//     if(current.direction === 'FORWARD') {
//         current.card.f += change;
//     } else { // BACKWARD
//         current.card.b += change;
//     }

//     if(current.card.f > 0 && current.card.b > 0) {
//         progress.upgraded++;
//         current.card.s = newStatus();
//         current.card.f = 0;
//         current.card.b = 0;
//         return;
//     }

//     if(current.card.f < -1 || current.card.b < -1) {
//         progress.degraded++;
//         current.card.s = 0;
//         current.card.f = 0;
//         current.card.b = 0;
//     }
// }

// function confirm(mark, progress, current) {
//     confirmAndRepeat(mark, progress, current, () => 2);
// }

// function repeat(mark, progress, current, session) {
//     confirmAndRepeat(mark, progress, current, () => {
//         updateNextRepeated(session.nextRepeated + 1);
//         return session.nextRepeated++;
//     });
// }

export default { learn, confirm, repeat, remember };
