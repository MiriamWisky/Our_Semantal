// const axios = require('axios');

const API_URL = 'http://localhost:3000'; // Update with your server URL

// Registration function
async function register(email, password) {
  console.log(email);
  console.log(password);
   const reqdata = {
    email : email,
    password : password}
    const API_URL2 = 'http://localhost:3000/register'; 
  try {
    const response = await axios.post(API_URL2 , reqdata);
    console.log("1");
    console.log(response.data.message);
  } catch (error) {
    console.log("2");
    console.error('Error registering user:', error.response);
  }
}

// Login function
async function login(email, password) {
  console.log("miriam wisky");
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    console.log(response.data.message);
    // Redirect to a new page after successful login
    window.location.href = '/dashboard.html'; // Update with the desired URL
  } catch (error) {
    console.error('Error logging in:', error.response.data.message);
  }
}

// ... (remaining code)
