const directions = {
    FORWARD: 'forward',
    BACKWARD: 'backward'
};

const marks = {
    GOOD: { name: 'good', increment: 1 },
    BAD: { name: 'bad', increment: -1 },
    NEUTRAL: { name: 'neutral', increment: 0 },
    NULL: { name: '', increment: 0 },
};

export { directions, marks };