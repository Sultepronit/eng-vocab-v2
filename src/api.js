const urlBase = import.meta.env.VITE_DATABASE_URI;

async function getData(sheet, firstCol, lastCol) {
    const url = `${urlBase}?sheet=${sheet}&firstCol=${firstCol}&lastCol=${lastCol}`;
	try {
        console.timeLog('tt', 'getting data!');
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

export { getData };