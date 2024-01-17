let remainingGuesses = 3;

function makeGuess(){
    

    const userInput = document.getElementById('user-input').value.trim();
    
    if (userInput !== '') {
        remainingGuesses--;
        updateGuessCounter();
    }

    // removes input after guess
    document.getElementById('user-input').value = '';
}

function getHint(){
    
}

function updateGuessCounter(){
    document.getElementById('guess-counter').innerText = remainingGuesses;
}
