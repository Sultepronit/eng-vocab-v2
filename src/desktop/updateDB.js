import { postData } from "@/api";
const sheet = 'db';

function updateMaxToRepeat(newVal) {
    postData(sheet, [['L12', newVal]]);
    //postData(sheet, [['M12', newVal]]);
}

function updateNextRepeated(newVal) {
    //postData(sheet, [['L10', newVal]]);
    postData(sheet, [['M10', newVal]]);
}

function updateCard(id, card) {
    const row = id + 1;
    const changes = [
        ['D'+row, card.s],
        ['E'+row, card.f],
        ['F'+row, card.b]
    ];
    if(card.toReturn) changes.push(['A'+row, 0]);
    postData(sheet, changes);
}

export { updateMaxToRepeat, updateNextRepeated, updateCard };