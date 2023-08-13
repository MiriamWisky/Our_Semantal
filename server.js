const express = require('express');
const bodyParser = require('body-parser');
const firebaseAdmin = require('firebase-admin');
const cors = require('cors');

// Initialize Firebase Admin SDK
const serviceAccount = require('./firebase-admin-SDK.json'); // Update with your Firebase Admin SDK key
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: 'https://semantale-57712-default-rtdb.europe-west1.firebasedatabase.app/', // Update with your Firebase project URL
});

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
const port = 3000;

// Define routes
app.post('/register', async (req, res) => {
  console.log('server/register'); 
  try {
    const { email, password } = req.body;
    const userRecord = await firebaseAdmin.auth().createUser({
      email,
      password,
    });
    res.status(201).json({ message: 'User registered successfully', uid: userRecord.uid });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

app.post('/login', async (req, res) => {
  console.log('server/login'); 
  try {
    const { email, password } = req.body;
    const userRecord = await firebaseAdmin.auth().getUserByEmail(email);
    // You can customize the login process here
    res.status(200).json({ message: 'Login successful', uid: userRecord.uid });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Serve static HTML files and client-side JavaScript

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
