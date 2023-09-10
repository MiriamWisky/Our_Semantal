function init(){
  const loginForm = document.getElementById('loginForm');
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log('Login form submitted'); 
    const formData = new FormData(loginForm);
    const email = formData.get('email');
    const password = formData.get('password');
    await login(email, password);
  });

  const registerButton = document.getElementById('registerButton');
  registerButton.addEventListener('click', () => {
    window.location.href = 'register.html';
  });

 
}
function initRegister(){
  const registerForm = document.getElementById('registerForm');
  registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log('register form submitted'); 
    const formData = new FormData(registerForm);
    const email = formData.get('email');
    const password = formData.get('password');
    await register(email, password);
  });
}

//  const API_URL = 'http://localhost:80'; 
// const API_URL = 'https://semantale-57712.web.app'; 
const API_URL = "";
// Registration function
async function register(email, password) {
  try {
    onsole.log("miriam");
    const response = await axios.post(`${API_URL}/register`, { email, password } );

    const { message } = response.data;

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
async function login(email, password) {
  try {
    console.log("miriam");
    const response = await axios.post(`${API_URL}/login`, { email, password });

    const { uid, userDetails } = response.data;

    // Update the wins count for the logged-in user
    // const winsCount = userDetails.wins;
    
    window.location.href = '/dashboard.html'; 
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.error('Error logging in:', 'Invalid credentials');
      alert('Invalid email or password'); 
    } else {
      console.error('Error logging in:', error.response ? error.response.data.message : error.message);
    }
  }
}
