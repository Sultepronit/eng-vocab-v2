import { postData } from "./api";
const sheet = 'db';

function updateMaxToRepeat(newVal) {
    postData(sheet, [['L4', newVal]]);
}

function updateNextRepeated(newVal) {
    postData(sheet, [['L2', newVal]]);
}

function updateCard(id, card) {
    const row = id + 1;
    const changes = [
        ['A'+row, card.s],
        ['B'+row, card.f],
        ['C'+row, card.b]
    ];
    postData(sheet, changes);
}

export { updateMaxToRepeat, updateNextRepeated, updateCard };