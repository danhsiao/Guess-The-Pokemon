let about = '';
let hintsRemaining = 2;
let hintsClicked = 0;
let remainingGuesses = 5;
let correctAnswer = '';
let randomId = 0;
let speciesResponse;
let speciesData;
let imageUrl;
let blurInt = 20;
let versionResponse;
let versionData;
version = '';

function getRandomPokemonImage() {
    // Generate a random number between 1 and 1025
    randomId = Math.floor(Math.random() * 500) + 1;
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

    correctAnswer = answerData.forms[0].name;
    correctAnswer = correctAnswer.charAt(0).toUpperCase() + correctAnswer.slice(1);
}

function makeGuess() {
    const userInput = document.getElementById('user-input').value.trim();
    if (userInput !== '') {
        if (userInput.toLowerCase() === correctAnswer.toLowerCase()) {
            // Show congrats message
            document.getElementById('congratsMessage').style.display = 'block';
            document.getElementById('correctAnswerDisplay').innerText = correctAnswer;
            document.getElementById('answerDisplay').style.display = 'block';
            document.getElementById('user-input').style.display = 'none';
            document.getElementById('guessButton').style.display = 'none';
            document.getElementById('hint-button').style.display = 'none';
            document.getElementById('remaining-guesses').style.display = 'none';
            document.getElementById('about-hint').style.display = 'none';
            document.getElementById('version-hint').style.display = 'none';

            blurImage(0);
        } else {
            remainingGuesses--;
            updateGuessCounter();
            if(remainingGuesses == 0){
                document.getElementById('correctAnswerDisplay').innerText = correctAnswer;
                document.getElementById('answerDisplay').style.display = 'block';
                // Hide the input and guess button since the game is over
                document.getElementById('user-input').style.display = 'none';
                document.getElementById('guessButton').style.display = 'none';
                document.getElementById('hint-button').style.display = 'none';
                document.getElementById('about-hint').style.display = 'none';
                document.getElementById('version-hint').style.display = 'none';
                blurImage(0);
            }
            else{
                blurInt -= 3;
                blurImage(blurInt);
            }
        }
    }
    // Clear input after guess
    document.getElementById('user-input').value = '';
}

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
  
async function getHint() {
    if (hintsRemaining === 2 && about === '' && hintsClicked ===0) {
      await displayPokemonAbout();
      hintsClicked += 1;
    }
    else if (hintsRemaining === 1 && version === '' && hintsClicked ===1){
        await displayPokemonVersion();
        hintsClicked += 1;
    }
  }
  

  
function updateGuessCounter(){
      document.getElementById('guess-counter').innerText = remainingGuesses;
  }

  
  