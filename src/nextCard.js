import cf from '@/commonFunctions';
/* import soundObject from '@/soundObject';
const audio = new Audio(); */

function nextCard({ cards, content, learnList, confirmList, repeatList }) {
    const cardType = cf.pullRandomFromArray(content);
    console.log(cardType);
    console.log(content);

    const currentCardId = cardType === 'LEARN' ? cf.pullRandomFromArray(learnList)
        : cardType === 'CONFRIM' ? cf.pullRandomFromArray(confirmList)
            : cf.pullRandomFromArray(repeatList);

    console.log(currentCardId);
    const currentCard = cards[currentCardId];
    console.log(currentCard);

    const direction = (currentCard.f > currentCard.b) ? "BACKWARD" : "FORWARD";

    /* const urls = soundObject[currentCard.word.toLowerCase()];
    console.log(urls);
    audio.src = urls[0];
    audio.play();

    console.log(audio.preload); */

    return {cardType, cardId: currentCardId, card: currentCard, direction };
}

export default nextCard;