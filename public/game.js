// const async = require("hbs/lib/async");

// const async = require("hbs/lib/async");

 
// import { createRequire } from 'module';
// const readline = require('readline');
// const clear = require('clear');
var numberOfGames = 0 ,numberOfWins = 0,  numberOfGuesses = 0 ,numberOfGiveUps = 0 , averageGuesses, wins = 0, secret_word="" , lastGiveUp = null , lastWin = null;
var discover=false, email="";
function init(){
    // const require = createRequire(import.meta.url);
    // global.require = require;
    const addButton = document.getElementById('addButton');
    const wordInput = document.getElementById('wordInput');
    const wordList = document.getElementById('wordList');
    const p= document.getElementById('yesterday_word');
    const giveUp=document.getElementById('giveUpButton');
    var word, give_up;
    let serialNumber = 1;
    const statsButton = document.getElementById("statsButton");
    const statsModal = document.getElementById("statsModal");
    const statsContent = document.getElementById("statsContent");
    const secretModal = document.getElementById("secretModal");
    const give_up_message=document.getElementById("secretMessage");
    const timerProgress = document.querySelector('.timer-progress');
    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');


    const countdownDisplay = document.getElementById('countdown-display');

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





    const dataToSave={} ;

      
      // Add an event listener for the beforeunload event
      window.addEventListener('beforeunload', async () => {
        try {
          const lastWinData = {
            year: lastWin.getFullYear(),
            month: lastWin.getMonth(),
            day: lastWin.getDate(),
          };
      
          dataToSave["lastWin"] = lastWinData;
            dataToSave["mail"]=email;
            dataToSave["giveUps"]=numberOfGiveUps;
            dataToSave["guesses"]=numberOfGuesses;
            dataToSave["wins"]=numberOfWins;
            dataToSave["totalGames"]=numberOfGames;
            dataToSave["lastGiveUp"] = lastGiveUp;
            dataToSave["lastWin"] = lastWinData;

          await axios.post('http://localhost:8080/saveToFirestore', { dataToSave });
        } catch (error) {
          console.error('Error:', error);
        }
      });
   
  //-----------------------------------------------------------


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
    // timerProgress.style.transform = `rotate(${progressPercentage * 3.6}deg)`; // 360 / 100

     timerProgress.style.width = progressPercentage + '%';

    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      alert("Time is up! You lose!");
    } else if (discover) {
      clearInterval(timerInterval);
    //   alert("Well done! You win!");
    }
  }, 1000); // Update every second
}

    //--------------------------------------------------------------

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
    giveUp.addEventListener("click", () => {
        const confirmed = confirm("are you sure you want to give up?");
        // alert("?")
        if (confirmed){
          const today = new Date();
            discover=true;
            give_up=1;
            secretModal.style.display = "block";
            give_up_message.innerHTML=`The secret word is ${secret_word}\n\ncome to play again tomorrow 😊`
            if(lastGiveUp.getFullYear() == 2000 || today.getFullYear() !== lastGiveUp.getFullYear() ||
            today.getMonth() !== lastGiveUp.getMonth() ||
            today.getDate() !== last.getDate())
            numberOfGiveUps++;
            lastGiveUp = new Date();
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
    
    async function get_word(){
        var response=await axios.get(`http://localhost:8080/get`);
        return response.data;
    }
    get_word()
  .then((w) => {
    word=w;
    secret_word=word["secretWord"];
    
    // console.log(word["details"]);
    email=word["details"]["mail"];
    numberOfGiveUps = word["details"]["giveUps"];
    numberOfGuesses = word["details"]["guesses"];
    numberOfWins = word["details"]["wins"];
    numberOfGames = word["details"]["totalGames"] + 1;
    lastGiveUp = word["details"]["lastGiveUp"];
    lastWin = word["details"]["lastWin"];
    averageGuesses = numberOfGuesses / numberOfGames;
    p.innerText=`yesterday's word was:${word["yesterday_word"]}`
    // alert(word);
    numberOfWins=100
     if(numberOfWins>=100){

        startTimer();
     }
  })
  .catch((error) => {
    console.error('error in get_word', error);
  });
    

  
    addButton.addEventListener('click', async () => {
        
        const newWord = wordInput.value.trim();
        if (newWord !== '') {
            // const wordExists = Array.from(wordList.getElementsByTagName('td:nth-child(2)')).some(cell => cell.textContent === newWord);
            // console.log(wordExists)
            // if (wordExists) {
            //     alert("Word already exists in the table");
            //     return; // Exit the function
            // }
            const existingWords = Array.from(document.querySelectorAll('#wordList td:nth-child(2)')).map(cell => cell.textContent);
            console.log(existingWords);
            if (existingWords.includes(newWord)) {
                alert("Word already exists in the table");
                return; // Exit the function
            }
        const data={
            "word": newWord
        }
        
         const response = await axios.post(`http://localhost:8080/check`, data);
        //   console.log(response.data["similar"]);
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
              console.log(lastWin);
              
              
            //   if(lastWin != null ){
            //   today.setHours(0, 0, 0, 0);
            //   lastWin.setHours(0, 0, 0, 0);
            // }
                discover=true;
                if(lastWin != null)
                console.log("year" + lastWin["year"]  + "day" + lastWin["day"]);
                if(lastWin == null || today.getFullYear() !== lastWin["year"] || today.getMonth() !== lastWin["month"] ||
                  today.getDate() !== lastWin["day"])
                 {
                  numberOfWins++;
                  lastWin = new Date();
                }
                const overlay = document.getElementById("overlay");
                const flashingMessage = document.getElementById("flashingMessage");
            
                // Display the overlay and flashing message
                overlay.style.display = "block";
                flashingMessage.style.display = "block";
            
                // Add the flashing class
                flashingMessage.classList.add("flashing");
            
                // Set a timeout to hide the message and overlay after 2-3 seconds
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
          }, 10000); // Adjust the delay time as needed

            wordInput.value = '';
            serialNumber++;
        }
    }});
}


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





