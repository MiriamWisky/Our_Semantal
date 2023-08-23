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
// import {generate , count} from "random-words";

const app = express();


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
// var randomGeneratedWord= randomWord();

const scheduleRule = new schedule.RecurrenceRule();
scheduleRule.hour = 10;
scheduleRule.minute = 58;
scheduleRule.second = 0;
var yesterday_word="flower";

// const usersCollection = firestore.collection('Users');
// var mail="";
var details = { 
  "mail":"",
  "giveUps" : 0 , 
  "guesses": 0,
  "totalGames": 0,
  "wins":0
}

var word="apple";
const job = schedule.scheduleJob('47 15 * * *', async function () {
  const apiUrl = 'https://random-word-api.vercel.app/api?words=1';
  yesterday_word=word;
  axios.get(apiUrl)
    .then(response => {
      const randomWord = response.data[0];
      word=randomWord;
      console.log(word)

      // res.send(randomWord);
    })
    .catch(error => {
      res.status(500).send('Error fetching random word');
    });
});
app.get('/get', async (req, res) => {
  const res1 = {
    "secretWord":word,
    "details" : details , 
    "yesterday_word" : yesterday_word
  }
  res.send(res1);

});
app.post('/saveToFirestore', async (req, res) => {
  try {
    var  mail, giveUps, guesses, wins, totalGames  ;//= req.body; // Destructure data
    console.log( mail, giveUps, guesses, wins, totalGames);
    console.log(req.body);
    mail=req.body.dataToSave["mail"];
    console.log(mail);
    const db = admin.firestore();
    const usersCollection = db.collection('Users');

    // Query for the user by email
    const querySnapshot = await usersCollection.where('email', '==', mail).get();

    if (querySnapshot.empty) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update attributes for each matching document
    const updatePromises = querySnapshot.docs.map(docSnapshot => {
      const userRef = docSnapshot.ref;
      return userRef.update({
        giveUps,
        guesses,
        wins,
        totalGames
      });
    });

    await Promise.all(updatePromises);

    res.status(200).json({ message: 'User attributes updated.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred.' });
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
      giveUps : 0,
      totalGames : 0,
      guesses : 0,
      passwordHash: hashedPassword,
    });
    // userWins[userRecord.uid] = 0;
    details["mail"]=email;
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
  // word2=randomGeneratedWord;
  word2=word;
  console.log(word1, word2)
  
  calculateSemanticSimilarity(word1, word2)
  
  .then((similarity) => {
    if(exist)
    console.log(similarity);
    res_similarity=similarity.toFixed(4);
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
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    console.log(user)
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isAuthenticated = await bcrypt.compare(password, user.passwordHash);

    if (!isAuthenticated) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    console.log("hello")
    // userWins[user.uid] = user.wins;
    details["mail"]=email;

         details["giveUps"] = user.giveUps;
        details["guesses"] = user.guesses;
        details["totalGames"] = user.totalGames;
        details["wins"] = user.wins;
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

