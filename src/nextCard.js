import { randomFromRange, pullRandomFromArray } from './commonFunctions';

function splitWordVariants(chunk) {
	const parts = chunk.split('/');
    if(parts.length < 2) return { variants: parts, question: chunk, answer: chunk };

	parts.shift();
	const half = parts.length / 2;
	const variants = parts.slice(half);
	const labels = parts.slice(0, half);

	const index = randomFromRange(0, half - 1);
    const hint = labels[index];

	let answer = '';
	for(let i = 0; i < variants.length; i++) {
		if(i === index) answer += '<u>';
        //if(labels[i][0] === '*') answer += labels[i] + ' ';
		answer += variants[i];
        if(i === index) answer += '</u>';
        if(labels[i][0] === '*') answer += `<sup>${labels[i]}</sup>`;
		if(i + 1 < variants.length) answer += ' / ';
	}
	
    return { variants, question: variants[index], hint, answer };
}

function nextCard({ cards, content, learnList, confirmList, repeatList }) {
    const cardType = pullRandomFromArray(content);
    console.log(cardType);
    console.log(content);

    const cardId = cardType === 'LEARN' ? pullRandomFromArray(learnList)
        : cardType === 'CONFRIM' ? pullRandomFromArray(confirmList)
            : pullRandomFromArray(repeatList);

    console.log(cardId);
    //const currentCard = cards[cardId];
    const currentCard = cards[23];
    //const currentCard = cards[380];
    console.log(currentCard);

    const direction = (currentCard.f > currentCard.b) ? "BACKWARD" : "FORWARD";

    const word = splitWordVariants(currentCard.word);
    console.log(word);
    console.log(word.question == word.answer);

    return { cardType, cardId, card: currentCard, direction, word };
}

export default nextCard;