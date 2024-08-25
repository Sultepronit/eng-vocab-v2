import splitWordVariants from '@/splitWordVariants';
import { directions } from './enums';

function nextCard(session) {
    //console.log(session);
    const { content } = session;

    const card = content.shift();
    console.log(content);

    const direction = (card.f > card.b)
        ? directions.BACKWARD : directions.FORWARD;

    const word = splitWordVariants(card.word);

    return { card, direction, word };
}

export default nextCard;