// const { exec } = require('child_process');

// function calculateSemanticSimilarity(word1, word2) {
//   return new Promise((resolve, reject) => {
//     const command = `python -c "import semantic_func; print(semantic_func.semantic_similarity('${word1}', '${word2}'))"`;

//     exec(command, (error, stdout, stderr) => {
//      if (error) {
//         reject(error);
//       } else {
//         const similarity = parseFloat(stdout);
//         resolve(similarity);
//       }
//     });
//   });
// }
// module.exports = { calculateSemanticSimilarity };













// const { exec } = require('child_process');

// function calculateSemanticSimilarity(word1, word2) {
//   return new Promise((resolve, reject) => {
//     const pythonPath = 'C:\Users\Miriam\AppData\Local\Programs\Python\Python311\python.exe';
    
//     const command = `${pythonPath} -c "import semantic_func; print(semantic_func.semantic_similarity('${word1}', '${word2}'))"`;

//     exec(command, (error, stdout, stderr) => {
//       if (error) {
//         reject(error);
//       } else {
//         const similarity = parseFloat(stdout);
//         resolve(similarity);
//       }
//     });
//   });
// }

// module.exports = { calculateSemanticSimilarity };

const axios = require('axios');

function calculateSemanticSimilarity(word1, word2) {
  return axios.post('https://semantle-python.onrender.com/calculate-semantic-similarity', {
    word1: word1,
    word2: word2
  })
  .then(response => response.data.similarity)
  .catch(error => {
    throw error;
  });
}

module.exports = { calculateSemanticSimilarity };
