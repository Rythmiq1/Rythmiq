import React, { useState, useEffect } from "react";
import { FaBell } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Notification from './Notification.jsx';

function Navbar({ notificationCount, setNotificationCount, notifications }) {
  const buttonStyling = "flex space-x-3 mr-2 font-semibold bg-white text-[#006161] border-2 border-[#006161] rounded-sm px-6 py-2 hover:bg-[#006161] hover:text-white hover:border-[#006161] mx-8 shadow-lg shadow-[#006161]/50 transition duration-300 ease-in-out";

  const [loggedInUser, setLoggedInUser] = useState('');
  const [userdata, setUserdata] = useState({});
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();


  const toggleNotificationBox = () => {
    setIsNotificationVisible((prev) => !prev);
    
    if (notificationCount > 0) {
      setNotificationCount(0);
    }
  };

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
            headers: { Authorization: storedToken },
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
    sessionStorage.removeItem('userId');
    setLoggedInUser('');
    setUserdata({});
    navigate("/login"); 
  };

  return (
    <>
      <div className="navbar fixed top-0 right-0 w-full h-16 bg-black bg-opacity-30 text-white px-6 py-4 z-10 flex items-center justify-end space-x-6">
        <div className="flex items-center space-x-4">
          <Notification />
          {loggedInUser ? (
            <>
            
              <div className="relative">
                <FaBell
                  size={24}
                  className="text-white cursor-pointer"
                  onClick={toggleNotificationBox}
                />
                
                {notificationCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2">
                    {notificationCount}
                  </span>
                )}
              </div>
              <span className="text-white">Welcome, {loggedInUser}!</span>
              <button type='submit' className={buttonStyling} onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button type='submit' className={buttonStyling} onClick={() => navigate("/login?signin=true")}>Sign Up</button>
              <button type='submit' className={buttonStyling} onClick={() => navigate("/login")}>Log In</button>
            </>
          )}
        </div>
      </div>

     
      <div className="mt-16">
      </div>

     
      {isNotificationVisible && (
        <div className="fixed top-16 right-6 bg-white text-black shadow-lg rounded-lg p-4 w-72 z-20 cursor-pointer">
          <h3 className="font-semibold text-lg">Notifications</h3>
          <div className="mt-2 max-h-48 overflow-y-auto">
            {notifications.length === 0 ? (
              <p>No new notifications</p>
            ) : (
              notifications.map((notification, index) => (
                <div key={index} className="p-2 border-b last:border-b-0">
                  <p className="text-sm">{notification.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
