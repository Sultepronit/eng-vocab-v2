import cf from '@/commonFunctions';

function nextCard({ cards, content, learnList, confirmList, repeatList }) {
    const cardType = cf.pullRandomFromArray(content);
    console.log(cardType);
    console.log(content);

   /*  let currentCardId = 0;
    if(cardType === 'LEARN') {
        currentCardId = cf.pullRandomFromArray(learnList);
    } */
    const currentCardId = cardType === 'LEARN' ? cf.pullRandomFromArray(learnList)
        : cardType === 'CONFRIM' ? cf.pullRandomFromArray(confirmList)
            : cf.pullRandomFromArray(repeatList);
    console.log(currentCardId);
    const currentCard = cards[currentCardId];
    console.log(currentCard);

    return {cardType, cardId: currentCardId, card: currentCard };
}

export default nextCard;