var numberOfGames = 0 ,numberOfWins = 0,  numberOfGuesses = 0 ,numberOfGiveUps = 0 , averageGuesses, wins = 0, secret_word="" , lastGiveUp = null , lastWin = null;
var discover=false, email="",serialNumber = 1, word;

function init(){
    const addButton = document.getElementById('addButton');
    const wordInput = document.getElementById('wordInput');
    const wordList = document.getElementById('wordList');
    const yesterday_w= document.getElementById('yesterday_word');
    const giveUp=document.getElementById('giveUpButton');
    const statsButton = document.getElementById("statsButton");
    const statsModal = document.getElementById("statsModal");
    const statsContent = document.getElementById("statsContent");
    const secretModal = document.getElementById("secretModal");
    const give_up_message=document.getElementById("secretMessage");
    const timerProgress = document.querySelector('.timer-progress');
    const timerContainer = document.querySelector('.timer-container');
    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');
    const countdownDisplay = document.getElementById('countdown-display');
  
    const serverBaseUrl = 'https://senantle.onrender.com';
  
  
    //--------------------------------------------------------------
 
  // Display the time until the next Semantle
    const countdownInterval = setInterval(() => {
        const now = new Date();
        const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        const remainingTime = (midnight - now) / 1000; // Convert to seconds

        const hours = Math.floor(remainingTime / 3600);
        const minutes = Math.floor((remainingTime % 3600) / 60);
        const seconds = Math.floor(remainingTime % 60);

        countdownDisplay.innerHTML = `
            <div>Time until the next semantale:</div>
            <div>${hours}h ${minutes}m ${seconds}s</div>
        `;

        if (remainingTime <= 0) {
            clearInterval(countdownInterval);
            countdownDisplay.innerHTML = "Semantale time has arrived!";
        }
    }, 1000); // Update every second

  //--------------------------------------------------------------

  const dataToSave = {};

  async function saveDataToFirestore() {
    try {
      const lastWinData = lastWin
        ? {
            year: lastWin.getFullYear(),
            month: lastWin.getMonth(),
            day: lastWin.getDate(),
          }
        : null;
  
      const lastGiveUpData = lastGiveUp
        ? {
            year: lastGiveUp.getFullYear(),
            month: lastGiveUp.getMonth(),
            day: lastGiveUp.getDate(),
          }
        : null;
  
      dataToSave["lastWin"] = lastWinData;
      dataToSave["mail"] = email;
      dataToSave["giveUps"] = numberOfGiveUps;
      dataToSave["guesses"] = numberOfGuesses;
      dataToSave["wins"] = numberOfWins;
      dataToSave["totalGames"] = numberOfGames;
      dataToSave["lastGiveUp"] = lastGiveUpData;
      dataToSave["lastWin"] = lastWinData;
  
      const response = await axios.post(`${serverBaseUrl}/saveToFirestore`, {
        dataToSave,
      });
    
      return response;
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }


//--------------------------------------------------------------


//A level 3 user plays with a 10 minute timer
let remainingTime = 10 * 60; 
let timerInterval;
let discover = false;

function updateTimerDisplay() {
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  minutesDisplay.textContent = minutes;
  secondsDisplay.textContent = seconds < 10 ? '0' + seconds : seconds;
}

function startTimer() {
  timerInterval = setInterval(() => {
    remainingTime--;
    updateTimerDisplay();
    const progressPercentage = (1 - remainingTime / (10 * 60)) * 100;
    timerProgress.style.width = progressPercentage + '%';

    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      alert("Time is up! You lose!");
    } else if (discover) {
      clearInterval(timerInterval);
    }
  }, 1000); 
}

    //--------------------------------------------------------------

    //A button to display the player's statistics
    statsButton.addEventListener("click", () => {
        statsModal.style.display = "block";
        averageGuesses = (numberOfGuesses + numberOfGiveUps) / numberOfGames; // Calculate average
        var level=1;
        if(numberOfWins>=50)
         level=2
         else if(numberOfWins>=100)
         level=3;
        const statsText = `                   Overall Statistics
            
            🎖  Level: ${level} 
            🎮 Total games played: ${numberOfGames}
            &#128170; Wins: ${numberOfWins}
            &#128683; Give-ups: ${numberOfGiveUps} 
            &#128221; Total guesses across all games: ${numberOfGuesses}
            &#128198; Average guesses across all games: ${averageGuesses.toFixed(2)}
        `;
        statsContent.innerHTML = statsText;
    });

//-----------------------------------------------------------

//"give up" button + discover the word.
    giveUp.addEventListener("click", () => {
        const confirmed = confirm("are you sure you want to give up?");
        if (confirmed){
          const today = new Date();
            discover=true;
            give_up=1;
            secretModal.style.display = "block";
            give_up_message.innerHTML=`The secret word is ${secret_word}\n\ncome to play again tomorrow 😊`
            if(lastGiveUp == null || today.getFullYear() !== lastGiveUp["year"] || today.getMonth() !== lastGiveUp["month"] ||
                  today.getDate() !== lastGiveUp["day"])
            numberOfGiveUps++;
            lastGiveUp = new Date();
            saveDataToFirestore();
        }
    });

    const closeButton2 = document.querySelector(".close_secret");
    closeButton2.addEventListener("click", () => {
        secretModal.style.display = "none";
    });


    // Close the modal when the close button is clicked
    const closeButton = document.querySelector(".close");
    closeButton.addEventListener("click", () => {
        statsModal.style.display = "none";
    });
    
//-----------------------------------------------------------

//Getting the word and other details are needed at the beginning of the game.
    async function get_word(){
        var response=await axios.get(`${serverBaseUrl}/get`);
        return response.data;
    }
    get_word()
  .then((w) => {
    word=w;
    console.log(word);
    secret_word=word["secretWord"];
    console.log(word["details"]);
    email=word["details"]["mail"];
    numberOfGiveUps = word["details"]["giveUps"];
    numberOfGuesses = word["details"]["guesses"];
    numberOfWins = word["details"]["wins"];
    numberOfGames = word["details"]["totalGames"] + 1;
    lastGiveUp = word["details"]["lastGiveUp"];
    lastWin = word["details"]["lastWin"];
    averageGuesses = numberOfGuesses / numberOfGames;
    yesterday_w.innerText=`yesterday's word was:${word["yesterday_word"]}`
  
     if(numberOfWins>=100){
        startTimer();
        timerContainer.style.display = 'block';
     }
  })
  .catch((error) => {
    console.error('error in get_word', error);
  });
    
//-----------------------------------------------------------
  
// Adding the word to the table sorted by semantic distance
    addButton.addEventListener('click', async () => {
        const newWord = wordInput.value.trim();
        if (newWord !== '') {
            const existingWords = Array.from(document.querySelectorAll('#wordList td:nth-child(2)')).map(cell => cell.textContent);
            if (existingWords.includes(newWord)) {
                alert("Word already exists in the table");
                return; 
            }
        const data={
            "word": newWord
        }
        
         const response = await axios.post(`${serverBaseUrl}/check`, data);
         if(!response.data["exist"])
            alert("invalid word")
         
        else {
            numberOfGuesses++;
            const newRow = document.createElement('tr');
            newRow.style.backgroundColor = '#a4ced7';

            const numberCell = document.createElement('td');
            numberCell.textContent = serialNumber;
            newRow.appendChild(numberCell);

            const wordCell = document.createElement('td');
            wordCell.textContent = newWord;
            newRow.appendChild(wordCell);

            const similarityCell = document.createElement('td');
            similarityCell.textContent=`${(response.data["similar"]*100).toFixed(2)} %`
            if(response.data["similar"] == 1){
              const today = new Date();
              
                discover=true;
                if(lastWin == null || today.getFullYear() !== lastWin["year"] || today.getMonth() !== lastWin["month"] ||
                  today.getDate() !== lastWin["day"])
                 {
                  numberOfWins++;
                  lastWin = new Date();
                  saveDataToFirestore();
                }
                const overlay = document.getElementById("overlay");
                const flashingMessage = document.getElementById("flashingMessage");
            
                overlay.style.display = "block";
                flashingMessage.style.display = "block";
            
                flashingMessage.classList.add("flashing");
            
                // Set a timeout to hide the message and overlay after 4.5 seconds
                setTimeout(() => {
                    flashingMessage.classList.remove("flashing");
                    flashingMessage.style.display = "none";
                    overlay.style.display = "none";
                }, 4500);
            }

            newRow.appendChild(similarityCell);

            const gettingClosedCell = document.createElement('td');
            const similarity = response.data["similar"];
            gettingClosedCell.textContent = getGettingClosedStatus(similarity);
            newRow.appendChild(gettingClosedCell);

            const existingRows = Array.from(wordList.getElementsByTagName('tr'));

            let insertIndex = existingRows.findIndex(row => {
                const existingSimilarity = parseFloat(row.querySelector('td:nth-child(3)').textContent);
                return response.data["similar"] *100 > existingSimilarity;
            });

            if (insertIndex === -1) {
                wordList.appendChild(newRow);
            } else {
                wordList.insertBefore(newRow, existingRows[insertIndex]);
            }
            setTimeout(() => {
              newRow.style.backgroundColor = '';
          }, 10000); 

            wordInput.value = '';
            serialNumber++;
            saveDataToFirestore();
        }
    }});
}

//-----------------------------------------------------------

//Determining proximity in words
function getGettingClosedStatus(similarity) {
  if(similarity == 1){
      return "exactly!!!";
  }else if (similarity >= 0.8) {
      return "hot!";
  } else if (similarity >= 0.5) {
      return "warm!";
  } else {
      return "cold";
  }
}





