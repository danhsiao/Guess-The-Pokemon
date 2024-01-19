let about = '';
let hintsRemaining = 3;
let hintsClicked = 0;
let remainingGuesses = 5;
let correctAnswer = '';
let randomId = 0;
let speciesResponse;
let speciesData;
let imageUrl;
let blurInt = 30;
let versionResponse;
let versionData;
let firstLetter = '';
let version = '';
let guessCounter = 1;

function startGame() {
  document.getElementById('overlay').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  document.getElementById('guesses').style.display = 'none';
  document.getElementById('playAgainButton').style.display= 'none';
  getRandomPokemonImage();
}
document.getElementById('playButton').addEventListener('click', startGame);

function playAgain(){
  document.getElementById('app').style.display = 'block';
  document.getElementById('gameOverMessage').style.display = 'none';
  document.getElementById('guesses').style.display = 'none';
  document.getElementById('congratsMessage').style.display = 'none';
  document.getElementById('answerDisplay').style.display = 'none';
  initializeGame()
}
document.getElementById('playAgainButton').addEventListener('click', playAgain);

// Function to initialize the game
function initializeGame() {
  // Set initial values
  about = '';
  hintsRemaining = 3;
  hintsClicked = 0;
  remainingGuesses = 5;
  correctAnswer = '';
  randomId = 0;
  blurInt = 30;
  firstLetter = '';
  version = '';
  guessCounter = 1;

  // Clear previous guesses
  const guessesContainer = document.getElementById('guesses');
  guessesContainer.innerHTML = '';

  // Reset any displayed messages
  document.getElementById('gameOverMessage').style.display = 'none';
  document.getElementById('congratsMessage').style.display = 'none';
  document.getElementById('answerDisplay').style.display = 'none';
  document.getElementById('guesses').style.display = 'none';


  // Reset input field
  document.getElementById('user-input').value = '';
  document.getElementById('guesses').style.display = 'none';
  document.getElementById('user-input').style.display = 'block';
  document.getElementById('guessButton').style.display = 'block';
  document.getElementById('hint-button').style.display = 'block';
  document.getElementById('playAgainButton').style.display = 'none';

  // Get a new Pokemon image
  getRandomPokemonImage();
}

// Event listener to call initializeGame when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeGame);

function getRandomPokemonImage() {
    // Generate a random number between 1 and 1025
    randomId = Math.floor(Math.random() * 648) + 1;
    const P = new Pokedex.Pokedex({ cacheImages: true });  

    // Construct the URL with the random ID
    imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${randomId}.svg`;
    // Select the image element and set its 'src' attribute to the new URL
    getCorrectAnswer();
    document.getElementById('pokemonImage').src = imageUrl;
    blurImage(blurInt);
  }
  getRandomPokemonImage();

function blurImage(blurValue) {
    var image = document.getElementById('pokemonImage');
    image.style.filter=`blur(${blurValue}px)`;
}

async function getCorrectAnswer(){
    answerResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    answerData = await answerResponse.json();

    let nameParts = answerData.forms[0].name.split('-');
    correctAnswer = nameParts[0]; // This will be 'keldeo' if the name is 'keldeo-ordinary'

    // Capitalize the first letter
    correctAnswer = correctAnswer.charAt(0).toUpperCase() + correctAnswer.slice(1);
}

function makeGuess() {
    const userInput = document.getElementById('user-input').value.trim();
    if (userInput !== '') {
        const guessItem = document.createElement('p');
        const guessLabel = document.createElement('span');
        guessLabel.innerText = 'Guess ' + guessCounter + ': ';
        guessLabel.style.fontWeight = 'bold';
        guessItem.appendChild(guessLabel);
        guessItem.appendChild(document.createTextNode(userInput));

        if (userInput.toLowerCase() === correctAnswer.toLowerCase()) {
            // Show congrats message
            guessItem.classList.add('correct-guess');
            document.getElementById('congratsMessage').style.display = 'block';
            document.getElementById('correctAnswerDisplay').innerText = correctAnswer;
            document.getElementById('answerDisplay').style.display = 'block';
            document.getElementById('user-input').style.display = 'none';
            document.getElementById('guessButton').style.display = 'none';
            document.getElementById('hint-button').style.display = 'none';
            document.getElementById('remaining-guesses').style.display = 'none';
            document.getElementById('about-hint').style.display = 'none';
            document.getElementById('version-hint').style.display = 'none';
            document.getElementById('letter-hint').style.display = 'none';
            document.getElementById('playAgainButton').style.display= 'block';


            blurImage(0);
        } else {
            guessItem.classList.add('incorrect-guess');
            remainingGuesses--;
            updateGuessCounter();
            if(remainingGuesses == 0){
                document.getElementById('gameOverMessage').style.display = 'block';
                document.getElementById('correctAnswerDisplay').innerText = correctAnswer;
                document.getElementById('answerDisplay').style.display = 'block';
                // Hide the input and guess button since the game is over
                document.getElementById('remaining-guesses').style.display = 'none';
                document.getElementById('user-input').style.display = 'none';
                document.getElementById('guessButton').style.display = 'none';
                document.getElementById('hint-button').style.display = 'none';
                document.getElementById('about-hint').style.display = 'none';
                document.getElementById('version-hint').style.display = 'none';
                document.getElementById('letter-hint').style.display = 'none';
                document.getElementById('playAgainButton').style.display= 'block';
                blurImage(0);
            }
            else{
                blurInt -= 4;
                blurImage(blurInt);
            }
        }
        const guesses = document.getElementById('guesses');
        guesses.appendChild(guessItem);
        guessCounter++;
    }
    document.getElementById('guesses').style.display = 'block';
    document.getElementById('user-input').value = '';
}
document.getElementById('user-input').addEventListener('keypress', function(event) {
  // Check if the key pressed is the Enter key
  if (event.key === 'Enter') {
      makeGuess(); // Call the makeGuess function
  }
});

async function displayPokemonAbout() {
    try {
      // Use the native fetch API to make a request to the PokéAPI with the ID
      speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${randomId}`);
      speciesData = await speciesResponse.json(); // Fix the typo here from speciestData to speciesData
      
      // Find the first English flavor text entry
      const englishFlavorTexts = speciesData.flavor_text_entries.filter(entry => entry.language.name === 'en');
      const recentFlavorText = englishFlavorTexts[englishFlavorTexts.length - 1].flavor_text.replace(/\f/g, " ");
      
      // Update the species variable with the recent English flavor text
      if(recentFlavorText.toLowerCase().includes(correctAnswer.toLowerCase())){
        about = recentFlavorText.replace(new RegExp(correctAnswer, 'gi'), "???");
        }
      else{
        about = recentFlavorText;
      }
      var aboutHintElement = document.getElementById('about-hint');
      if (aboutHintElement) {
        document.getElementById('about').innerText = about; // Set the text content of the span element
        aboutHintElement.style.display = 'block'; // Make sure the element is visible
        hintsRemaining--; // Decrement the hints remaining
      }
    } catch (error) {
      console.error(error); // Handle any errors that might occur during the request
    }
  }

async function displayPokemonVersion(){
    try{
    versionResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    versionData = await versionResponse.json();

    version = versionData.game_indices[1].version.name;
    version = version.charAt(0).toUpperCase() + version.slice(1);

    var versionHintElement = document.getElementById('version-hint');
    if(versionHintElement){
        document.getElementById('version').innerText = version;
        versionHintElement.style.display = 'block';
        hintsRemaining--;
    }
    }catch(error){
        console.log(error);
    }
}

async function displayPokemonFirstLetter(){
  firstLetter = correctAnswer[0];
  var firstLetterHintElement = document.getElementById('letter-hint');
  if(firstLetterHintElement){
    document.getElementById('firstLetter').innerText = firstLetter;
    firstLetterHintElement.style.display = 'block';
    hintsRemaining--;
  }
}
  
async function getHint() {
    if (hintsRemaining === 3 && about === '' && hintsClicked ===0) {
      await displayPokemonAbout();
      hintsClicked += 1;
    }
    else if (hintsRemaining === 2 && version === '' && hintsClicked ===1){
        await displayPokemonVersion();
        hintsClicked += 1;
    }
    else{
      await displayPokemonFirstLetter();
      hintsClicked += 1;
    }
  }
  

  
function updateGuessCounter(){
      document.getElementById('guess-counter').innerText = remainingGuesses;
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Don't call getRandomPokemonImage or other initialization functions here,
    // as they should only run after the play button is clicked.
    initializeGame();
  });
  