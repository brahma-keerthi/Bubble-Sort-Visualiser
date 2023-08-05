const n = 15;
const array = []
var timeout = null

init();

let audioCtx = null;

// plays a note with given frequency
function playNote(freq){
    if ( audioCtx == null ){
        audioCtx = new (
            AudioContext || webkitAudioContext || window.webkitAudioContext
        )();
    }
    const dur = 0.1
    const osc = audioCtx.createOscillator();
    osc.frequency.value = freq;
    osc.start();
    osc.stop(audioCtx.currentTime + dur);
    const node = audioCtx.createGain();
    node.gain.value = 0.1;
    node.gain.linearRampToValueAtTime(
        0, audioCtx.currentTime + dur
    );
    osc.connect(node);
    node.connect(audioCtx.destination);
}

// init function
function init(){

    // clears the timeout necessary to stop play
    clearTimeout(timeout);

    for (let i = 0; i<n; ++i){
        array[i] = Math.random();
    }

    showBars();
}

// play function
function play(){
    // make the copy of array to get the moves 
    const copy = [...array]

    const moves = bubbleSort(copy);
    animate(moves.reverse());
}

// Display the bars
function showBars(move){
    // claar the previous bars
    container.innerHTML = "";

    for (let i = 0; i<array.length; ++i){
        const bar = document.createElement("div");
        bar.style.height = array[i] * 100 + "%";
        bar.classList.add("bar");

        // swap = red, comparition - blue
        if ( move && move.indices.includes(i)){
            if ( move.type == "swap" )
                bar.style.backgroundColor = "red";
            else if ( move.type == "comp" )
            bar.style.backgroundColor = "blue";
        }
        container.appendChild(bar);
    }    
}

// animate the moves
function animate(moves){
    if ( moves.length == 0 ){
        showBars();
        return;
    }
        
    const move = moves.pop();
    const [i, j] = move.indices

    // Swap only when the move in swap
    if (move.type == "swap" )
        [array[i], array[j]] = [array[j], array[i]];

    // plays the note based on value
    playNote(200 + array[i]*500);
    playNote(200 + array[j]*500);

    // highlight the swapped bars
    showBars(move);

    timeout = setTimeout(function() {
                animate(moves);
            }, 50);
}

// Bubble sort
function bubbleSort(array){
    // records the moves
    const moves = [];

    do{
        var swapped = false;
        for(let i = 1; i<array.length; ++i){
            moves.push({indices: [i-1, i], type: "comp"});
            if (array[i-1] > array[i] ){
                swapped = true;
                moves.push({indices: [i-1, i], type: "swap"});
                [array[i-1], array[i]] = [array[i], array[i-1]];
            }
        }
    } while (swapped);

    return moves;
}



