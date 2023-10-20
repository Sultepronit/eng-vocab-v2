let keyControl = {};
function connectKeyControl(kc) {
    keyControl = kc;
}

const actions = {
    showAnswer(key) {
        if(key === 'Enter') keyControl.value.showAnswer = true;
    }
}

function getKey(key) {
    //console.log(key);
    if(key === 'Shift') return;

    keyControl.value.monitor = key;
    actions[keyControl.value.actionName](key);
   /*  actionMonitor.value = key;
    console.log(theInput.value.value);
    console.log(theInput.value);
    console.log(theInput.value.innerHTNL);
    console.log(theInput.value.outerHTML); */
}
document.addEventListener('keyup', (event) => getKey(event.key));
//document.addEventListener('keypress', (event) => console.log(event));
console.log('key listener added!');

export { connectKeyControl }; 