import { pullRandomFromArray } from '@/commonFunctions';
import splitWordVariants from '@/splitWordVariants';
import { directions } from './enums';

function nextCard(session) {
    //console.log(session);
    const { cards, repeatList } = session;

    const cardId = pullRandomFromArray(repeatList);

    const card = cards[cardId];
    //const card = cards[23];
    //const card = cards[380];

    const direction = (card.f > card.b)
        ? directions.BACKWARD : directions.FORWARD;

    const word = splitWordVariants(card.word);

    return { cardId, card, direction, word };
}

export default nextCard;