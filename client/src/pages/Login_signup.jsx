import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils/Error';
import '../App.css';
import { ToastContainer } from 'react-toastify';
import "../pages/login.css";
import GenreSelectionPopup from './GenreSelector'; // Import the new popup component

function Login_signup() {
  const navigate = useNavigate();
  const [isSignInActive, setIsSignInActive] = useState(true);
  const [showGenrePopup, setShowGenrePopup] = useState(false); // State for genre popup

  const switchToSignIn = () => {
    setIsSignInActive(true);
  };

  const switchToSignUp = () => {
    setIsSignInActive(false);
  };

  const loginwithgoogle = () => {
    window.open("http://localhost:8080/auth/google/callback", "_self");
  };

  const [signupInfo, setSignupInfo] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password } = signupInfo;
  
    if (!name || !email || !password) {
      return handleError('All fields are required');
    }
  
    try {
      const url = "http://localhost:8080/auth/signup";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signupInfo)
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        console.error("Signup failed:", errorMessage);
        throw new Error(errorMessage);
      }
  
      const result = await response.json();
      const { success, message, error, jwtToken, userId } = result; // Assume userId is returned in the response
  
      if (success) {
        handleSuccess(message);
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('loggedInUser', name);
        localStorage.setItem('userId', userId); // Store user ID
        navigate('/genre');
      } else if (error) {
        const details = error?.details[0]?.message;
        handleError(details);
      } else {
        handleError(message);
      }
    } catch (err) {
      console.error("Signup error:", err);
      handleError(err.message);
    }
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;
    
    if (!email || !password) {
      return handleError('All fields are required');
    }
  
    try {
      const url = "http://localhost:8080/auth/login";
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginInfo)
      });
  
      const result = await response.json();
      const { success, message, jwtToken, name, userId, error } = result; // Assume userId is returned in the response
  
      if (success) {
        handleSuccess(message);
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('loggedInUser', name);
        localStorage.setItem('userId', userId); // Store user ID

      } else if (error) {
        const details = error?.details[0]?.message;
        handleError(details);
      } else {
        handleError(message);
      }
    } catch (err) {
      handleError(err);
    }
  };
  
  

  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: ''
  });

  const handleLChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo(prevState => ({ ...prevState, [name]: value }));
  };

  

  return (
    <div className={`container ${isSignInActive ? '' : 'right-panel-active'}`} id="container">
      <div className={`form-container sign-up-container ${isSignInActive ? 'hidden' : ''}`}>
        <form onSubmit={handleSignup}>
          <h1>Create Account</h1>
          <input
            onChange={handleChange}
            type='text'
            name='name'
            placeholder='Enter Your name'
          />
          <input
            onChange={handleChange}
            type='email'
            name='email'
            placeholder='Enter Your Email'
          />
          <input
            onChange={handleChange}
            type='password'
            name='password'
            placeholder='Enter Your Password'
          />
          <button type='submit'>REGISTER</button>
        </form>
        <button className='switch-btn Login' onClick={switchToSignIn}>Go to Login</button>
      </div>

      <div className={`form-container sign-in-container ${isSignInActive ? '' : 'hidden'}`}>
        <form onSubmit={handleLogin}>
          <h1>Login</h1>
          <input
            onChange={handleLChange}
            type="email"
            name='email'
            placeholder="Enter your email"
            value={loginInfo.email}
          />
          <input
            onChange={handleLChange}
            type="password"
            name='password'
            placeholder="PASSWORD"
            value={loginInfo.password}
          />
          <button type='submit'>Login</button>
          <button className='login-with-google-btn' onClick={loginwithgoogle}>SIGN IN WITH GOOGLE</button>
        </form>
        <button className='switch-btn' onClick={switchToSignUp}>Go to Register</button>
      </div>

      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <p>Unwind with the magic of music🎧</p>
            <br />
            <button className="ghost" id="signIn" onClick={switchToSignIn}>GO TO LOGIN</button>
          </div>
          <div className="overlay-panel overlay-right">
            <p>Rythimq🎧 se tum Chale Jaoge lekin Rythmiq tumse kaise jayega</p>
            <br />
            <button className="ghost" id="signUp" onClick={switchToSignUp}>GO TO Register</button>
          </div>
        </div>
      </div>

      <ToastContainer />

      {showGenrePopup && ( // Render the genre selection popup if it is to be shown
        <GenreSelectionPopup onClose={() => setShowGenrePopup(false)} />
      )}
    </div>
  );
}

export default Login_signup;
