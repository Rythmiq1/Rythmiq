import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import TextWithHover from '../components/TextWithHover';

function Navbar() {
  const [loggedInUser, setLoggedInUser] = useState('');
  const [userdata, setUserdata] = useState({});
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const name = params.get('name');
    const id = params.get('userId');
    if (token && name) {
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('loggedInUser', name);
      sessionStorage.setItem('userId', id);
      setLoggedInUser(name);
    } else {
      const storedUser = sessionStorage.getItem('loggedInUser');
      if (storedUser) {
        setLoggedInUser(storedUser);
      }
    }

    const getUser = async () => {
      const storedToken = sessionStorage.getItem('token');
      if (storedToken) {
        try {
          const response = await axios.get("http://localhost:8080/login/success", {
            headers: { Authorization: `Bearer ${storedToken}` },
            withCredentials: true,
          });
          setUserdata(response.data.user);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    getUser();
  }, [location]);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('loggedInUser');
    sessionStorage.removeItem('UserId');
    setLoggedInUser('');
    setUserdata({});
  };

  return (
    <>
      <div className="navbar fixed top-0 right-0 w-full h-16 bg-black bg-opacity-30 text-white px-6 py-4 z-10 flex items-center justify-end space-x-6">
        <div className="h-6 border-l-2 border-gray-400"></div>
        <div className="flex items-center space-x-4">
          <TextWithHover displayText="Premium" />
          <TextWithHover displayText="Support" />
          <TextWithHover displayText="Download" />
        </div>
        <div className="h-6 border-l-2 border-gray-400"></div>
        <div className="flex items-center space-x-4">
          {loggedInUser ? (
            <>
              <span className="text-white">Welcome, {loggedInUser}!</span>
              <button
                className="bg-white text-black font-bold px-4 py-1 rounded-full hover:bg-gray-200 transition"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="bg-black text-white font-bold px-4 py-1 rounded-full hover:bg-gray-200 transition"
                onClick={() => navigate("/login?signin=true")}
              >
                Sign Up
              </button>
              <button
                className="bg-white text-black font-bold px-4 py-1 rounded-full hover:bg-gray-200 transition"
                onClick={() => navigate("/login")}
              >
                Log In
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="mt-20">
      </div>
    </>
  );
}

export default Navbar;
