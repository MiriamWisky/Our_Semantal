// const axios = require('axios');

const API_URL = 'http://localhost:8080'; // Update with your server URL

// Registration function
async function register(email, password) {
  try {
    const response = await axios.post(`${API_URL}/register`, { email, password });
    console.log("Registration response:", response.data);

    const { message } = response.data;
    console.log("Message:", message);

    if (message === 'User registered successfully') {
      window.location.href = '/dashboard.html'; // Redirect to dashboard.html
    }
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.error('Error registering user:', 'Email already exists');
      alert('Email already exists');
    } else {
      console.error('Error registering user:', error.response ? error.response.data.message : error.message);
    }
  }
}
// Login function
// Login function
async function login(email, password) {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    console.log(response.data.message);

    const { uid, userDetails } = response.data;

    // Update the wins count for the logged-in user
    const winsCount = userDetails.wins;
    // Redirect to a new page after successful login
    window.location.href = '/dashboard.html'; // Update with the desired URL
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.error('Error logging in:', 'Invalid credentials');
      alert('Invalid email or password'); // Display alert to the user
    } else {
      console.error('Error logging in:', error.response ? error.response.data.message : error.message);
    }
  }
}


// ... (remaining code)