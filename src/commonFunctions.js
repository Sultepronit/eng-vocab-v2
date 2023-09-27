function randomFromRange(from, to) {
    return Math.round((Math.random() * (to - from)) + from);
}

function pullRandomFromArray(array) {
    const index = randomFromRange(0, array.length - 1);
    const item = array[index];
    array.splice(index, 1);
    return item;
} 
export default { randomFromRange, pullRandomFromArray };