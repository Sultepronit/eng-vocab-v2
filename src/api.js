const urlBase = import.meta.env.VITE_DATABASE_URI;

async function getData(sheet, firstCol, lastCol) {
    const url = `${urlBase}?sheet=${sheet}&firstCol=${firstCol}&lastCol=${lastCol}`;
	try {
        //console.timeLog('tt', 'getting data!');
		const resp = await fetch(url);
		const array = await resp.json();
		console.log(sheet + ': ' + array.length);
		//console.log(array);
		return array;
	} catch(err) {
		//console.log(err);
		alert(err);
	}
}

async function postData(sheet, data) {
	//console.log('saving...');
	const url = urlBase + '?sheet=' + sheet;
	const params = {
		method: 'POST',
		headers: { Accept: 'application/json' },
		body: JSON.stringify(data)
	};
	try {
		const resp = await fetch(url, params);
		const report = await resp.json();
		console.log('saved:');
		console.log(report);
	} catch (error) {
		alert(error);
	}
}

export { getData, postData };