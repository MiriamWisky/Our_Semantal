// const async = require("hbs/lib/async");

// const async = require("hbs/lib/async");

 
// import { createRequire } from 'module';
var numberOfGames = 10 ,numberOfWins = 5,  numberOfGuesses = 50 ,numberOfGiveUps = 3 , averageGuesses, wins = 0;
function init(){
    // const require = createRequire(import.meta.url);
    // global.require = require;
    const addButton = document.getElementById('addButton');
    const wordInput = document.getElementById('wordInput');
    const wordList = document.getElementById('wordList');
    const p= document.getElementById('yesterday_word');
    var word;
    let serialNumber = 1;
  
    

   
    const statsButton = document.getElementById("statsButton");
    const statsModal = document.getElementById("statsModal");
    const statsContent = document.getElementById("statsContent");

    statsButton.addEventListener("click", () => {
        statsModal.style.display = "block";
        // Populate the stats content
        // const numberOfGames = 10; // Replace with actual number
        // const numberOfWins = 5;   // Replace with actual number
        // const numberOfGuesses = 50; // Replace with actual number
        // const numberOfGiveUps = 3;  // Replace with actual number
         averageGuesses = (numberOfGuesses + numberOfGiveUps) / numberOfGames; // Calculate average

        const statsText = `
            🎮 Number of games: ${numberOfGames}
            &#128170; Number of wins: ${numberOfWins}
            &#128683; Number of give ups: ${numberOfGiveUps} 
            &#128221; Number of guesses: ${numberOfGuesses}
            &#128198; Average guesses: ${averageGuesses.toFixed(2)}
        `;
        statsContent.innerHTML = statsText;
    });

    window.addEventListener('beforeunload', function(event) {
         // Send an AJAX request or use Fetch API to notify the server about tab closure
          fetch('/close-tab', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
             },
            body: JSON.stringify({ wins: wins }) // You need to define winsVariable
          });
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
    p.innerText=`yesterday's word was:${word}`
    // alert(word);

  })
  .catch((error) => {
    console.error('error in get_word', error);
  });
    

  
    addButton.addEventListener('click', async () => {
        
        const newWord = wordInput.value.trim();
        if (newWord !== '') {
        const data={
            "word": newWord
        }
        
         const response = await axios.post(`http://localhost:8080/check`, data);
        //   console.log(response.data["similar"]);
         if(!response.data["exist"])
            alert("invalid word")
         
        else {
        
            const newRow = document.createElement('tr');
            
            const numberCell = document.createElement('td');
            numberCell.textContent = serialNumber;
            newRow.appendChild(numberCell);

            const wordCell = document.createElement('td');
            wordCell.textContent = newWord;
            newRow.appendChild(wordCell);

            const similarityCell = document.createElement('td');
            similarityCell.textContent=`${response.data["similar"]*100} %`
            newRow.appendChild(similarityCell);

            // wordList.appendChild(newRow);
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

            wordInput.value = '';
            serialNumber++;
        }
    }});
}






