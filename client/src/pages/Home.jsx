import React, { useEffect, useState } from 'react';
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
  );
}

export default Home;
