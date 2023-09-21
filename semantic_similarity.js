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

const { exec } = require('child_process');

function calculateSemanticSimilarity(word1, word2) {
  return new Promise((resolve, reject) => {
    const pythonProcess = exec('python semantic_func.py', (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        const similarity = parseFloat(stdout);
        resolve(similarity);
      }
    });

    // Send data to the Python script (if needed)
    pythonProcess.stdin.write(`${word1}\n${word2}`);
    pythonProcess.stdin.end();
  });
}

module.exports = { calculateSemanticSimilarity };
