/* export function randomFromRange(from, to) {
    return Math.round((Math.random() * to) - from);
}
//const arr1 = [0, 1, 2, 3, 4, 5, 6];
export function pullRandomFromArray(array) {
    const index = randomFromRange(0, array.length - 1);
    const item = array[index];
    array.splice(index, 1);
    return item;
} */
//console.log(pullRandomFromArray(arr1));
//console.log(arr1);

function randomFromRange(from, to) {
    return Math.round((Math.random() * to) - from);
}
//const arr1 = [0, 1, 2, 3, 4, 5, 6];
function pullRandomFromArray(array) {
    const index = randomFromRange(0, array.length - 1);
    const item = array[index];
    array.splice(index, 1);
    return item;
} 
export default { randomFromRange, pullRandomFromArray };