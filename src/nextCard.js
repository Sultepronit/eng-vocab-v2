import cf from '@/commonFunctions';

function nextCard({ cards, content, learnList, confirmList, repeatList }) {
    const cardType = cf.pullRandomFromArray(content);
    console.log(cardType);
    console.log(content);

    const currentCardId = cardType === 'LEARN' ? cf.pullRandomFromArray(learnList)
        : cardType === 'CONFRIM' ? cf.pullRandomFromArray(confirmList)
            : cf.pullRandomFromArray(repeatList);

    console.log(currentCardId);
    const currentCard = cards[currentCardId];
    //const currentCard = cards[23];
    console.log(currentCard);

    const direction = (currentCard.f > currentCard.b) ? "BACKWARD" : "FORWARD";

    return {cardType, cardId: currentCardId, card: currentCard, direction };
}

export default nextCard;