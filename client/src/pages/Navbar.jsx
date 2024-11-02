import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import arrow_right from "../assets/right_arrow.png";
import arrow_left from "../assets/left_arrow.png";

function Navbar() {
  const [loggedInUser, setLoggedInUser] = useState(localStorage.getItem('loggedInUser') || '');
  const [userdata, setUserdata] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const name = params.get('name');

    if (token && name) {
      localStorage.setItem('token', token);
      localStorage.setItem('loggedInUser', name);
      setLoggedInUser(name);
    }

    const fetchUserData = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const response = await axios.get("http://localhost:8080/login/success", {
            headers: { Authorization: `Bearer ${storedToken}` },
            withCredentials: true,
          });
          setUserdata(response.data.user);
        } catch (error) {
          console.error('Error fetching user data:', error);
          handleLogout();
        }
      }
    };

    fetchUserData();
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    setLoggedInUser('');
    setUserdata(null);
    navigate('/login');
  };

  return (
    <div>
      <div className=' flex justify-between items-center font-semibold text-white mt-10'>
        <div className='flex items-center gap-2'>
          <img
            onClick={() => navigate(-1)}
            className='w-8 bg-black p-2 rounded-2xl cursor-pointer'
            src={arrow_left}
            alt="Back"
          />
          <img
            onClick={() => navigate(1)}
            className='w-8 bg-black p-2 rounded-2xl cursor-pointer'
            src={arrow_right}
            alt="Forward"
          />
        </div>
        <div className='flex items-center gap-4'>
          <p className='bg-white text-black text-[15px] px-4 py-1 rounded-2xl hidden md:block cursor-pointer'>
           Sign Up
          </p>
        
          {loggedInUser ? (
            <div className='flex items-center gap-2'>
              <p className='bg-purple-500 text-black w-7 h-7 rounded-full flex items-center justify-center'>
                {loggedInUser[0].toUpperCase()}
              </p>
              <button onClick={handleLogout} className='bg-red-500 text-white px-3 py-1 rounded-2xl'>
                Logout
              </button>
            </div>
          ) : (
            <p onClick={() => navigate('/login')} className='bg-purple-500 text-black w-20 h-7 rounded-full flex items-center justify-center'>
              Login
            </p>
          )}
        </div>
      </div>
      <div className='flex items-center gap-2 mt-4'>
        <p className='bg-white text-black px-4 py-1 rounded-2xl cursor-pointer'>All</p>
        <p className='bg-black px-4 py-1 rounded-2xl cursor-pointer text-white'>Music</p>
        <p className='bg-black px-4 py-1 rounded-2xl cursor-pointer text-white'>Podcasts</p>
      </div>
    </div>
  );
}

export default Navbar;
