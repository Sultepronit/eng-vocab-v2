import { randomFromRange, pullRandomFromArray } from './commonFunctions';

function splitWordVariants(chunk) {
	const parts = chunk.split('/');
    if(parts.length < 2) return {
        variants: parts, question: chunk, answer: chunk, hint: ''
    };

	parts.shift();
	const half = parts.length / 2;
	const variants = parts.slice(half);
	const labels = parts.slice(0, half);

	const index = randomFromRange(0, half - 1);
    const hint = labels[index];

	let answer = '';
	for(let i = 0; i < variants.length; i++) {
		if(i === index) answer += '<u>';
		answer += variants[i];
        if(i === index) answer += '</u>';
        if(labels[i][0] === '*') answer += `<sup>${labels[i]}</sup>`;
		if(i + 1 < variants.length) answer += ' / ';
	}
	
    return { variants, question: variants[index], hint, answer };
}

//function nextCard({ cards, content, learnList, confirmList, repeatList }) {
function nextCard(session) {
    const { cards, content, learnList, confirmList, repeatList } = session;
    const cardType = pullRandomFromArray(content);
    //console.log(cardType);
    //console.log(content);

    const cardId = cardType === 'LEARN' ? pullRandomFromArray(learnList)
        : cardType === 'CONFIRM' ? pullRandomFromArray(confirmList)
            : pullRandomFromArray(repeatList);

    //console.log(cardId);
    const card = cards[cardId];
    //const card = cards[23];
    //const card = cards[380];
    //console.log(card);

    const direction = (card.f > card.b) ? "BACKWARD" : "FORWARD";

    const word = splitWordVariants(card.word);
    //console.log(word);

    return { cardType, cardId, card, direction, word };
}

export default nextCard;