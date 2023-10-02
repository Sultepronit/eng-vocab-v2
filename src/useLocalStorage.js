function saveSession(sessionProgress) {
    console.time('saving to localStorage');
    localStorage.setItem('mainSession', JSON.stringify(sessionProgress));
    console.timeEnd('saving to localStorage');
}

function restoreSession() {
    const data = localStorage.getItem('mainSession');
    if(data) {
        const restoredSession = JSON.parse(data);
        console.log(restoredSession);
        console.timeLog('tt', 'restored session!');
        return restoredSession;
    } else {
        return null;
    }
}

export { saveSession, restoreSession };