import { updateNextRepeated } from '@/updateDB';

function learn(mark, progress, current, session) {
    if(mark === 'GOOD') {
        progress.plus++;
    } else { // BAD or NEUTRAL
        progress.minus++;

        session.content.push('LEARN');
        session.learnList.push(current.cardId);
        console.log("I'm back!");
        console.log(session.learnList);
    }

    const change = mark === 'GOOD' ? 1 : -1;
    if(current.direction === 'FORWARD') {
        current.card.f += change;
        if(current.card.f < 0 && mark === 'GOOD') current.card.f = 0;
    } else { // BACKWARD
        current.card.b += change;
        if(current.card.b < -1) current.card.f = current.card.b = 0;
    }

    if(current.card.f > 1 && current.card.b > 1) {
        progress.upgraded++;
        current.card.s = 1;
        current.card.f = 0;
        current.card.b = 0;
    }
}

function confirmAndRepeat(mark, progress, current, newStatus) {
    if(mark === 'GOOD') {
        progress.plus++;
    } else if(mark === 'BAD') {
        progress.minus++;
    }

    const change = mark === 'GOOD' ? 1 : -1;
    if(current.direction === 'FORWARD') {
        current.card.f += change;
    } else { // BACKWARD
        current.card.b += change;
    }

    if(current.card.f > 0 && current.card.b > 0) {
        progress.upgraded++;
        current.card.s = newStatus();
        current.card.f = 0;
        current.card.b = 0;
        return;
    }

    if(current.card.f < -1 || current.card.b < -1) {
        progress.degraded++;
        current.card.s = 0;
        current.card.f = 0;
        current.card.b = 0;
    }
}

function confirm(mark, progress, current) {
    confirmAndRepeat(mark, progress, current, () => 2);
}

function repeat(mark, progress, current, session) {
    confirmAndRepeat(mark, progress, current, () => {
        updateNextRepeated(session.nextRepeated + 1);
        return session.nextRepeated++;
    });
}

export default { learn, confirm, repeat };