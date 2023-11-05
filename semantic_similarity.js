
const axios = require('axios');

//This  function  accesses a server that receives 2 words and returns their semantic distance
function calculateSemanticSimilarity(word1, word2) {
  return axios.post('https://python-server-gkw3.onrender.com/calculate-semantic-similarity', {
    word1: word1,
    word2: word2
  })
  .then(response => response.data.similarity)
  .catch(error => {
    throw error;
  });
}

module.exports = { calculateSemanticSimilarity };
