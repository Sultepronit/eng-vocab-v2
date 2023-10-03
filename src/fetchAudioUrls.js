async function fetchAudioUrls() {
    const resp = await fetch('/recordUrls.json?url');
    const urls = await resp.json();
    return urls;
}

export default fetchAudioUrls;