function init(){
    const addButton = document.getElementById('addButton');
    const wordInput = document.getElementById('wordInput');
    const wordList = document.getElementById('wordList');
    let serialNumber = 1;
console.log("ckmc")
    addButton.addEventListener('click', () => {
        const newWord = wordInput.value.trim();
        if (newWord !== '') {
            const newRow = document.createElement('tr');
            
            const numberCell = document.createElement('td');
            numberCell.textContent = serialNumber;
            newRow.appendChild(numberCell);

            const wordCell = document.createElement('td');
            wordCell.textContent = newWord;
            newRow.appendChild(wordCell);

            const similarityCell = document.createElement('td');
            newRow.appendChild(similarityCell);

            wordList.appendChild(newRow);

            wordInput.value = '';
            serialNumber++;
        }
    });
}




// document.addEventListener('DOMContentLoaded', () => {
//     const addButton = document.getElementById('addButton');
//     const wordInput = document.getElementById('wordInput');
//     const wordList = document.getElementById('wordList');

//     addButton.addEventListener('click', () => {
//         const newWord = wordInput.value.trim();
//         if (newWord !== '') {
//             const newRow = document.createElement('tr');
//             const wordCell = document.createElement('td');
//             wordCell.textContent = newWord;
//             newRow.appendChild(wordCell);
//             wordList.appendChild(newRow);
//             wordInput.value = '';
//         }
//     });
// });
// document.addEventListener('DOMContentLoaded', () => {
//     const addButton = document.getElementById('addButton');
//     const wordInput = document.getElementById('wordInput');
//     const wordList = document.getElementById('wordList');
//     let serialNumber = 1;

//     addButton.addEventListener('click', () => {
//         const newWord = wordInput.value.trim();
//         if (newWord !== '') {
//             const newRow = document.createElement('tr');
            
//             const numberCell = document.createElement('td');
//             numberCell.textContent = serialNumber;
//             newRow.appendChild(numberCell);

//             const wordCell = document.createElement('td');
//             wordCell.textContent = newWord;
//             newRow.appendChild(wordCell);

//             const similarityCell = document.createElement('td');
//             newRow.appendChild(similarityCell);

//             wordList.appendChild(newRow);

//             wordInput.value = '';
//             serialNumber++;
//         }
//     });
// });

