import { postData } from "@/api";
const sheet = 'db';

function updateMaxToRepeat(newVal) {
    postData(sheet, [['L13', newVal]]);
}

function updateNextRepeated(newVal) {
    postData(sheet, [['L11', newVal]]);
}

function updateCard(card) {
    const changes = [
        ['D'+card.id, card.s],
        ['E'+card.id, card.f],
        ['F'+card.id, card.b]
    ];
    if(card.toReturn) changes.push(['A'+card.id, 0]);
    postData(sheet, changes);
}

export { updateMaxToRepeat, updateNextRepeated, updateCard };