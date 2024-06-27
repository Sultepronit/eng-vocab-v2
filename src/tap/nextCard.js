import { pullRandomFromArray } from '@/commonFunctions';
import splitWordVariants from '@/splitWordVariants';

function nextCard(session) {
    const { cards, content, learnList, confirmList, repeatList, rememberList } = session;
    const cardType = pullRandomFromArray(content);
    console.log(content);
    console.log(cardType);

    const cardId = cardType === 'LEARN' ? pullRandomFromArray(learnList)
        : cardType === 'CONFIRM' ? pullRandomFromArray(confirmList)
            : cardType === 'REMEMBER' ? pullRandomFromArray(rememberList)
                : pullRandomFromArray(repeatList);
    
    const card = cards[cardId];
    //const card = cards[23];
    //const card = cards[380];

    const direction = (card.f > card.b) ? "BACKWARD" : "FORWARD";

    const word = splitWordVariants(card.word);

    return { cardType, cardId, card, direction, word };
}

export default nextCard;