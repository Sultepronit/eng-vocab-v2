const directions = {
    FORWARD: 'forward',
    BACKWARD: 'backward'
};

const marks = {
    GOOD: { name: 'good', increment: 1 },
    BAD: { name: 'bad', increment: -100 },
    NEUTRAL: { name: 'neutral', increment: -1 },
    NULL: { name: '', increment: 0 },
};

export { directions, marks };