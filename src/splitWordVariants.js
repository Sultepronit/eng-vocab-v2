import { randomFromRange } from '@/commonFunctions';

function splitWordVariants(chunk) {
	const parts = chunk.split('/');
    if(parts.length < 2) return {
        variants: parts, question: chunk, answer: chunk, hint: ''
    };

	parts.shift();
	const half = parts.length / 2;
	const variants = parts.slice(half);
	const labels = parts.slice(0, half);

	const index = randomFromRange(0, half - 1);
    const hint = labels[index];

	let answer = '';
	for(let i = 0; i < variants.length; i++) {
		if(i === index) answer += '<u>';
		answer += variants[i];
        if(i === index) answer += '</u>';
        if(labels[i][0] === '*') answer += `<sup>${labels[i]}</sup>`;
		if(i + 1 < variants.length) answer += ' / ';
	}
	
    return { variants, question: variants[index], hint, answer };
}

export default splitWordVariants;