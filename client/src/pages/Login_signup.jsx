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
    const[signupInfo,setSignupInfo]=useState({
      name:'',
      email:'',
      password:''
  })
  const handleChange=(e)=>{
    const {name,value}=e.target;
    console.log(name,value);
}
console.log('signupInfo->',signupInfo)
const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password } = signupInfo;
    if (!name || !email || !password) {
        return handleError('All fields are required');
    }
    try{
        const url="http://localhost:8080/auth/signup";
     const response=await fetch(url,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(signupInfo)
    })
    
}
    catch(err){
        const result=await response.json();
        console.log(result);
    }
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
        <button className='switch-btn' onClick={switchToSignUp}>Go to Register</button>
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