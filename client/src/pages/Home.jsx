import React, { useEffect, useState } from 'react';
<<<<<<< HEAD
import logo from "../assets/images/Rhythmiq-bg.ico";
import IconText from '../components/IconText';

function Home() {
  const [loggedInUser, setLoggedInUser] = useState('');

  useEffect(() => {
    setLoggedInUser(localStorage.getItem('loggedInUser'));
  }, []);

  return (
    <div className='h-screen w-screen flex'>
      {loggedInUser}
      
      {/* Left Part */}
      <div className='h-screen w-1/5 bg-black '>
        <div className='logoDiv'>
          <img src={logo} alt="logo" className='w-200 h-100' />
        </div>
        <IconText iconName="home" displayText="Home" />
        <IconText iconName="search" displayText="Search" />
        <IconText iconName="library_music" displayText="Library" />
      </div>

      {/* Right Part */}
      <div className='h-screen w-4/5 bg-gray-100'>
        {/* Content goes here */}
      </div>
    </div>
=======
import { NavLink } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [userdata, setUserdata] = useState({});
  const [loggedInUser, setLoggedInUser] = useState('');

  useEffect(() => {
    // Fetch user data
    const getUser = async () => {
      try {
        const response = await axios.get("http://localhost:8080/login/success", {
          withCredentials: true,
        });
        setUserdata(response.data.user);
      } catch (error) {
        console.log(error);
      }
    };

    // Get logged-in user from localStorage
    setLoggedInUser(localStorage.getItem('loggedInUser'));
    getUser(); // Call the function to fetch user data
  }, []);

  return (
    <>
      <header>
        <nav>
          <div>
            <ul>
              <li><NavLink to="/">Home</NavLink></li>
              {Object.keys(userdata).length > 0 ? (
                <>
                  <li>{userdata.displayName}</li>
                  <li><NavLink to="/dashboard">Dashboard</NavLink></li>
                  <li>Logout</li>
                  <li><img src="/circle.png" alt="User Avatar" /></li>
                </>
              ) : (
                <li><NavLink to="/login">Login</NavLink></li>
              )}
            </ul>
          </div>
        </nav>
      </header>
      <div>Home  Welcome {loggedInUser}</div>
    </>
>>>>>>> sneha
  );
}

export default Home;
