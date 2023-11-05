
const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const schedule = require('node-schedule');
const axios = require('axios').default;
const https = require('https');
var checkWord=require('check-if-word') ;

//------------------------------------------------------------------

require('dotenv').config();
const { calculateSemanticSimilarity } = require('./semantic_similarity');
const app = express();

app.use(express.json())

const corsOptions = {
  origin: 'https://senantle.onrender.com',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 204, // Some legacy browsers (IE11) choke on 204
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.static('public'));


// Initialize Firebase Admin SDK
const serviceAccount = require('./firebase-admin-SDK.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
}); 

const scheduleRule = new schedule.RecurrenceRule();
scheduleRule.hour = 10;
scheduleRule.minute = 58;
scheduleRule.second = 0;
var yesterday_word="";
var details = { 
  "mail":"",
  "giveUps" : 0 , 
  "guesses": 0,
  "totalGames": 0,
  "wins":0 ,
  "lastGiveUp" : null , 
  "lastWin" : null
}
var currentWord="apple";
var today = new Date();
var lastTimeRandWord = new Date(today);
lastTimeRandWord.setDate(today.getDate() - 1);

//------------------------------------------------------------------

async function randRandomWord() {
  var currentDate = new Date(today);
  console.log(lastTimeRandWord.getFullYear())
  console.log(currentDate.getFullYear())
  console.log(lastTimeRandWord.getMonth())
  console.log(currentDate.getMonth())
  console.log(lastTimeRandWord.getDate())
  console.log( currentDate.getDate())

  if (
    lastTimeRandWord.getFullYear() !== currentDate.getFullYear() ||
    lastTimeRandWord.getMonth() !== currentDate.getMonth() ||
    lastTimeRandWord.getDate() !== currentDate.getDate()
  ) {
  try {
    yesterday_word=currentWord;
    const apiUrl = 'https://random-word-api.vercel.app/api?words=1';
    const res = await axios.get(apiUrl);
    const randomWord = res.data[0];
    currentWord=randomWord;
    console.log(randomWord);
    lastTimeRandWord=new Date(today);
    return "";
  
  } catch (error) {
    console.error('Error performing daily action:', error);
  }}}

//------------------------------------------------------------------

app.get('/get', async (req, res) => {
  randRandomWord().then(()=>{
     const res1 = {
    "secretWord":currentWord,
    "details" : details , 
    "yesterday_word" : yesterday_word
  }
  console.log( res1["details"]["mail"]);
  res.send(res1);
 
  }).catch((error) => {
    console.error('Error:', error);
  });
});

//------------------------------------------------------------------

app.post('/saveToFirestore', async (req, res) => {
  try {
    var  mail, giveUps, guesses, wins, totalGames , lastGiveUp , lastWin  ;
    mail=req.body.dataToSave["mail"];
    giveUps=req.body.dataToSave["giveUps"]
    guesses=req.body.dataToSave["guesses"]
    wins=req.body.dataToSave["wins"]
    totalGames=req.body.dataToSave["totalGames"];
    lastGiveUp = req.body.dataToSave["lastGiveUp"];
    lastWin = req.body.dataToSave["lastWin"];
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
        totalGames,
        lastGiveUp, 
        lastWin
      });
    });

    await Promise.all(updatePromises);
    res.status(200).json({ message: 'User attributes updated.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred.' });
  }});

//------------------------------------------------------------------

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
      lastGiveUp :  null,
      lastWin : null,
    });
    
    details["mail"]=email;
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

//------------------------------------------------------------------

app.post('/check', async (req, res) => {
  randRandomWord().then(()=>{
  console.log(req.body["word"]);
  // let words = checkWord('en');
  // var exist=words.check(req.body["word"]);
  // console.log(exist);
  var exist=1;
  var res_similarity=0.0;
  let word1=req.body["word"];
  let word2=currentWord;
  calculateSemanticSimilarity(word1, word2)
  .then((similarity) => {
    if(exist)
    res_similarity=similarity.toFixed(4);
    console.log(res_similarity);
    const response={
      "similar":res_similarity,
      "exist":exist
    }
     res.send(response);
  })
  .catch((error) => {
    console.error('Error calculating semantic similarity:', error);
  });
}).catch((error) => {
  console.error('Error:', error);
});
});

//------------------------------------------------------------------

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
    details["mail"]=email;
    details["giveUps"] = user.giveUps;
    details["guesses"] = user.guesses;
    details["totalGames"] = user.totalGames;
    details["wins"] = user.wins;
    details["lastGiveUp"] = user.lastGiveUp;
    details["lastWin"] = user.lastWin;

    console.log(details["mail"]);
    res.status(200).json({ message: 'Login successful', uid: user.uid, userDetails: user });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(401).json({ message: 'Invalid credentials' });
  }});

  //------------------------------------------------------------------

async function getUserByEmail(email) {
  const snapshot = await admin.firestore().collection('Users').where('email', '==', email).limit(1).get();
  if (snapshot.empty) {
    return null;
  }
  const userDoc = snapshot.docs[0];
  return { uid: userDoc.id, ...userDoc.data() };
}

//------------------------------------------------------------------

async function hashPassword(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

//------------------------------------------------------------------

 const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});



