import React from 'react'

function Login_signup() {
  return (
    <div>
      <div className='sign-up-container'>
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
        <div className='sign-in-container'>
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
    </div>
  )
}

export default Login_signup