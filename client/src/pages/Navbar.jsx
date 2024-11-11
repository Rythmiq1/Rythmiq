import React, { useState, useEffect } from "react";
import { MdNotificationsNone } from "react-icons/md";
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

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
      setNotificationCount(0); // Reset count when notifications are viewed
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

  // Extract initials from the logged-in user's name
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0].toUpperCase())
      .join("");
  };

  return (
    <>
      <div className="navbar fixed top-0 right-0 w-full h-16 bg-black bg-opacity-30 text-white px-6 py-4 z-10 flex items-center justify-end space-x-6">
        <div className="flex items-center space-x-4">
          {loggedInUser ? (
            <>
              <div className="relative">
                <button onClick={toggleNotificationBox} className="text-gray-700 bg-transparent focus:outline-none rounded mr-10">
                  <MdNotificationsNone className="w-6 h-6 bg-transparent text-white" />
                </button>

                {notificationCount > 0 && (
                  <span className="absolute top-6 right-6 bg-red-500 text-white text-xs rounded-full px-2">
                    {notificationCount}
                  </span>
                )}

                {isNotificationVisible && (
                  <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg overflow-hidden z-50">
                    <div className="px-4 py-2 font-semibold text-lg text-gray-700 border-b">
                      Notifications
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications && notifications.length === 0 ? (
                        <p className="px-4 py-2 text-gray-600">No new notifications</p>
                      ) : (
                        notifications.map((notification) => (
                          <div key={notification.id} className="flex items-start px-4 py-3 border-b hover:bg-gray-100">
                            <div className="w-8 h-8 flex items-center justify-center mr-3">
                              <MdNotificationsNone className="w-6 h-6 text-gray-500" />
                            </div>
                            <div className="text-sm flex-1">
                              <p className="text-gray-600">{notification.message}</p>
                              <p className="text-gray-400 text-xs mt-1">{notification.time}</p>
                            </div>
                            <a href="#" className="text-sm hover:underline ml-2">View</a>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="px-4 py-2 text-center">
                      <a href="#" className="text-sm hover:underline">See all</a>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative flex items-center">
                {/* User's Initials Circle */}
                <div className="group w-10 h-10 flex items-center justify-center rounded-full bg-[#006161] text-white font-bold text-xl mr-4 cursor-pointer">
                  {/* Initials */}
                  <span className="group-hover:hidden">{getInitials(loggedInUser)}</span>
                  {/* "Welcome, User!" text on hover */}
                  <span className="group-hover:block hidden text-sm text-white">
                    Welcome, {loggedInUser}!
                  </span>
                </div>
              </div>

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

      <div className="mt-16"></div>
    </>
  );
}

export default Navbar;
