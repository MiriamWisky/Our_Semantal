const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const cors = require('cors');
const bcrypt = require('bcryptjs');
// const randomWords = require('random-words');
const schedule = require('node-schedule');
const axios= require('axios');
const https = require('https');
var checkWord=require('check-if-word') ;
const httpsAgent = new https.Agent({ rejectUnauthorized: false });
const { exec } = require('child_process');
const { calculateSemanticSimilarity } = require('./semantic_similarity');

const app = express();


// function runPythonScript(word1, word2, callback) {
//    const pythonScriptPath = './semantic_func.py'; // Replace with the actual path to your Python script
//    const pythonCommand = `python ${pythonScriptPath} ${word1} ${word2}`;

//  exec(pythonCommand, (error, stdout, stderr) => {
//   if (error) {
//     console.error('Error running Python script:', error);
//     return;
//   }

//   const similarity = parseFloat(stdout);
//   callback(similarity);
//   });
// }
app.use(express.json())
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
const port = 8080;

// Initialize Firebase Admin SDK
const serviceAccount = require('./firebase-admin-SDK.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // ...
});




const userWins = {}; // Global object to store user wins


const scheduleRule = new schedule.RecurrenceRule();
scheduleRule.hour = 0;
scheduleRule.minute = 0;
scheduleRule.second = 0;

const dailyWordJob = schedule.scheduleJob(scheduleRule, async () => {
  try {
    const randomGeneratedWord = randomWord();
    const wordRef = admin.firestore().collection('Word').doc();
    await wordRef.set({ word: randomGeneratedWord });
    console.log('Generated and saved daily word:', randomGeneratedWord);
  } catch (error) {
    console.error('Error generating and saving daily word:', error);
  }
});


// Define routes
app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the email already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Add user details to Firestore
    const newUserRef = await admin.firestore().collection('Users').add({
      email,
      wins: 0,
      passwordHash: hashedPassword,
    });
    // userWins[userRecord.uid] = 0;
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});
app.post('/check', async (req, res) => {
  words = checkWord('en');// setup the language for check, default is en
  // runPythonScript(req.body["word"], "apple", (similarity) => {
  //   console.log(`Semantic similarity between '${word1}' and '${word2}': ${similarity}`);
  //   // Use the similarity value as needed in your code
  // });
  var exist=words.check(req.body["word"]);
  var res_similarity=0.0;
  word1=req.body["word"];
  word2="apple";
  calculateSemanticSimilarity(word1, word2)
  .then((similarity) => {
    if(exist)
    console.log(similarity.toFixed(4));
    res_similarity=similarity.toFixed(4).toString().split('.')[1].slice(0, 3);
    const response={
      "similar":res_similarity,
      "exist":exist
    }
     res.send(response);
    // console.log(`Semantic similarity between '${word1}' and '${word2}': ${similarity.toFixed(4)}`);
  })
  .catch((error) => {
    console.error('Error calculating semantic similarity:', error);
  });
  
  
 
        
  
// true
// const options = {
//   method: 'GET',
//   url: 'https://twinword-word-graph-dictionary.p.rapidapi.com/definition/',
//   params: {entry: req["word"]},
//   headers: {
//     'X-RapidAPI-Key': 'c2cd83391emsh39bb54aa7541a5ep161053jsnda76760cfafa',
//     'X-RapidAPI-Host': 'twinword-word-graph-dictionary.p.rapidapi.com'
//   }
// };

// try {
// 	const response = await axios.request(options,{ httpsAgent: httpsAgent });
// 	console.log(response.data);
//   res.send(response)
// } catch (error) {
// 	console.error(error);
// }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isAuthenticated = await bcrypt.compare(password, user.passwordHash);

    if (!isAuthenticated) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    userWins[user.uid] = user.wins;
    res.status(200).json({ message: 'Login successful', uid: user.uid, userDetails: user });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

async function getUserByEmail(email) {
  const snapshot = await admin.firestore().collection('Users').where('email', '==', email).limit(1).get();
  if (snapshot.empty) {
    return null;
  }
  const userDoc = snapshot.docs[0];
  return { uid: userDoc.id, ...userDoc.data() };
}

async function hashPassword(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

