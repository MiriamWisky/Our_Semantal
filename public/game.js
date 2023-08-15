// const async = require("hbs/lib/async");
 
// import { createRequire } from 'module';

function init(){
    // const require = createRequire(import.meta.url);
    // global.require = require;
    const addButton = document.getElementById('addButton');
    const wordInput = document.getElementById('wordInput');
    const wordList = document.getElementById('wordList');
    let serialNumber = 1;

    addButton.addEventListener('click', async () => {
        
        const newWord = wordInput.value.trim();
        if (newWord !== '') {
        const data={
            "word": newWord
        }
        
         const response = await axios.post(`http://localhost:8080/check`, data);
        //  console.log(response.data["similar"]);
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
            similarityCell.textContent=`${response.data["similar"]/10} %`
            newRow.appendChild(similarityCell);

            // wordList.appendChild(newRow);
            const existingRows = Array.from(wordList.getElementsByTagName('tr'));

            let insertIndex = existingRows.findIndex(row => {
                const existingSimilarity = parseFloat(row.querySelector('td:nth-child(3)').textContent);
                return response.data["similar"] / 10 > existingSimilarity;
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






