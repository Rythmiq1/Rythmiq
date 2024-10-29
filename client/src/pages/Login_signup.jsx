import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError ,handleSuccess} from '../utils/Error';
import '../App.css';
import { ToastContainer } from 'react-toastify';
function Login_signup() {
  const navigate = useNavigate();
  
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
    const copySignupInfo = {...signupInfo };
        copySignupInfo[name] = value;
        setSignupInfo(copySignupInfo);
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
    const result = await response.json();
            const { success, message, error } = result;
            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    setIsSignInActive(true);
                }, 1000)
            } else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            } else if (!success) {
                handleError(message);
            }
            console.log(result);
}
    catch(err){
        const result=await response.json();
        console.log(result);
    }
};
const[loginInfo,setLoginInfo]=useState({
  email:'',
  password:''
})
const handleLChange=(e)=>{
  const {name,value}=e.target;
  console.log(name,value);
  const copyLoginInfo = {...loginInfo };
  copyLoginInfo[name] = value;
  setLoginInfo(copyLoginInfo);
}

const handleLogin = async (e) => {
  e.preventDefault();
  const { name, email, password } = loginInfo;
  if (!email || !password) {
      return handleError('All fields are required');
  }
  try{
      const url="http://localhost:8080/auth/login";
   const response=await fetch(url,{
      method:'POST',
      headers:{
          'Content-Type':'application/json'
      },
      body:JSON.stringify(loginInfo)
  })
  const result = await response.json();
          const { success, message,jwtToken,name, error } = result;
          if (success) {
              handleSuccess(message);
              localStorage.setItem('token',jwtToken);
              localStorage.setItem('loggedInUser',name);
              setTimeout(() => {
                  navigate('/home')
              }, 1000)
          } else if (error) {
              const details = error?.details[0].message;
              handleError(details);
          } else if (!success) {
              handleError(message);
          }
          console.log(result);
}
  catch(err){
      handleError(err);
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
        <form onSubmit={handleLogin}>
          <h1>Login</h1>

          <input
          onChange={handleLChange}
          type="email" 
          name='email'
          placeholder="Enter your email" 
          value={loginInfo.email}/>

          <input
          onChange={handleLChange}
          type="password" 
          name='password'
          placeholder="PASSWORD" 
          value={loginInfo.password}
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
         <ToastContainer/> 
    </div>
  )
}

export default Login_signup