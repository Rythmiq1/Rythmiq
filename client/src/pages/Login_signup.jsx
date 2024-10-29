import React, { useState } from 'react';
import '../App.css';
function Login_signup() {
  const [isSignInActive, setIsSignInActive] = useState(true);

    const switchToSignIn = () => {
        setIsSignInActive(true);
    };

    const switchToSignUp = () => {
        setIsSignInActive(false);
    };


  return (
    <div className={`container ${isSignInActive ? '' : 'right-panel-active'}`} id="container">
      <div className={`form-container sign-up-container ${isSignInActive ? 'hidden' : ''}`}>
        <form>
          <h1>Create Account</h1>
          <input
          type='text'
          name='name'
          placeholder='Enter Your name'
          />

          <input
          type='email'
          name='email'
          placeholder='Enter Your Email'
          />

          <input
          type='password'
          name='password'
          placeholder='Enter Your Password'
          />
          <button type='submit'>REGISTER</button>
        </form>
        <button className='switch-btn Login'>Go to Login</button>
      </div>
      <div className={`form-container sign-in-container ${isSignInActive ? '' : 'hidden'}`}>
        <form>
          <h1>Login</h1>

          <input
          type='email'
          name='email'
          placeholder='Enter Your Email'
          />

          <input
          type='password'
          name='password'
          placeholder='Enter Your Password'
          />
          <button type='submit'>Login</button>
        </form>
        <button className='switch-btn'>Go to Register</button>
        </div>
        <div className="overlay-container">
                <div className="overlay">
                    <div className="overlay-panel overlay-left">
                        <p>Unwind with the magic of music🎧</p>
                        <br/>
                        <button className="ghost" id="signIn" onClick={switchToSignIn}>GO TO LOGIN</button>
                    </div>
                    <div className="overlay-panel overlay-right">
                        <p>Rythimq🎧 se tum Chale Jaoge lekin
                            Rythmiq tumse kaise jayega
                        </p>
                        <br/>
                        <button className="ghost" id="signUp" onClick={switchToSignUp}>GO TO Register</button>
                    </div>
                </div>
            </div>
    </div>
  )
}

export default Login_signup