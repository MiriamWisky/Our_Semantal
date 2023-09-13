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
const { exec } = require('child_process');

function calculateSemanticSimilarity(word1, word2) {
  return new Promise((resolve, reject) => {
    const command = `python3 -c "import semantic_func; print(semantic_func.semantic_similarity('${word1}', '${word2}'))"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        const similarity = parseFloat(stdout);
        resolve(similarity);
      }
    });
  });
}

module.exports = { calculateSemanticSimilarity };
