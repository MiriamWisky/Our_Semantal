const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const randomWords = require('random-words');
const schedule = require('node-schedule');

const app = express();

// Initialize Firebase Admin SDK
const serviceAccount = require('./firebase-admin-SDK.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // ...
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
const port = 8080;

const userWins = {}; // Global object to store user wins


// Schedule task to run at 00:00:00 every day
const dailyJob = schedule.scheduleJob('0 0 * * *', async () => {
  try {
    const randomWord = randomWords();
    const wordRef = admin.firestore().collection('Word').doc();
    await wordRef.set({ word: randomWord });
    console.log('Generated and saved word:', randomWord);
  } catch (error) {
    console.error('Error generating and saving word:', error);
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


// const express = require('express');
// const bodyParser = require('body-parser');
// const admin  = require('firebase-admin');
// const cors = require('cors');
// const bcrypt = require('bcryptjs');

// const app = express();
// // Initialize Firebase Admin SDK
// const serviceAccount = require('./firebase-admin-SDK.json'); // Update with your Firebase Admin SDK key
// admin .initializeApp({
//   credential: admin .credential.cert(serviceAccount),
//   //  databaseURL: 'https://semantale-57712-default-rtdb.europe-west1.firebasedatabase.app/', // Update with your Firebase project URL
// });


// app.use(cors());
// app.use(bodyParser.json());
// app.use(express.static('public'));
// const port = 8080;

// // Define routes
// app.post('/register', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check if the email already exists
//     const existingUser = await admin.auth().getUserByEmail(email);
//     if (existingUser) {
//       return res.status(400).json({ message: 'Email already exists' });
//     }

//     // Create a new user and hash the password
//     const userRecord = await admin.auth().createUser({
//       email,
//       password,
//     });
//     const hashedPassword = await hashPassword(password);

//     // Add user details to Firestore
//     await admin.firestore().collection('Users').doc(userRecord.uid).set({
//       email,
//       wins: 0,
//       passwordHash: hashedPassword,
//     });

//     res.status(201).json({ message: 'User registered successfully', uid: userRecord.uid });
//   } catch (error) {
//     console.error('Error creating user:', error);
//     res.status(500).json({ message: 'Error registering user' });
//   }
// });


// app.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const userRecord = await admin.auth().getUserByEmail(email);

//     // Authenticate the user
//     const isAuthenticated = await authenticateUser(email, password);

//     if (!isAuthenticated) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     // Get user details from Firestore
//     const userDoc = await admin.firestore().collection('Users').doc(userRecord.uid).get();
//     const userDetails = userDoc.data();

//     // You can customize the login process here
//     res.status(200).json({ message: 'Login successful', uid: userRecord.uid, userDetails });
//   } catch (error) {
//     console.error('Error logging in:', error);
//     res.status(401).json({ message: 'Invalid credentials' });
//   }
// });


// // Serve static HTML files and client-side JavaScript

// app.listen(port, () => {
//   console.log(`Server is listening on port ${port}`);
// });


// // Hash the password using bcrypt
// async function hashPassword(password) {
//   const saltRounds = 10;
//   return bcrypt.hash(password, saltRounds);
// }

// // Compare the provided password with the stored hashed password
// async function authenticateUser(email, password) {
//   try {
//     const userDoc = await admin.firestore().collection('Users').where('email', '==', email).get();
//     if (userDoc.empty) {
//       return false;
//     }
//     const userDetails = userDoc.docs[0].data();
//     return await bcrypt.compare(password, userDetails.passwordHash);
//   } catch (error) {
//     return false;
//   }
// }