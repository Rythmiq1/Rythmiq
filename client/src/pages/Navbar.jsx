import React, { useState, useEffect } from "react";
import { MdNotificationsNone } from "react-icons/md";
import { Menu } from "lucide-react";
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import BASE_URL from "../config";

function Navbar({ notificationCount, setNotificationCount, notifications, onMobileMenuClick }) {
  const buttonStyling = "flex space-x-3 font-semibold bg-white text-[#006161] border-2 border-[#006161] rounded-sm px-4 py-2 hover:bg-[#006161] hover:text-white shadow-lg shadow-[#006161]/50 transition duration-300 ease-in-out";

  const [loggedInUser, setLoggedInUser] = useState('');
  const [userdata, setUserdata] = useState({});
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleNotificationBox = () => {
    setIsNotificationVisible(prev => !prev);
    if (notificationCount > 0) setNotificationCount(0);
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
      if (storedUser) setLoggedInUser(storedUser);
    }

    const getUser = async () => {
      const storedToken = sessionStorage.getItem('token');
      if (storedToken) {
        try {
          const response = await axios.get(`${BASE_URL}/login/success`, {
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
    sessionStorage.clear();
    setLoggedInUser('');
    setUserdata({});
    navigate("/login");
  };

  const getInitials = name =>
    name?.split(" ").map(w => w[0].toUpperCase()).join("");

  return (
    <>
      <div className="fixed top-0 right-0 w-full bg-black text-white px-4 py-2 flex items-center justify-between z-50 shadow-md">
  
        <div className="flex items-center md:hidden">
          <button onClick={onMobileMenuClick} className="text-white focus:outline-none">
            <Menu size={28} />
          </button>
        </div>


        <div className="flex items-center space-x-4 ml-auto">
          {loggedInUser ? (
            <>
          
              <div className="relative group w-10 h-10 flex items-center justify-center rounded-full bg-[#006161] text-white font-bold text-xl cursor-pointer">
                <span className="group-hover:hidden">{getInitials(loggedInUser)}</span>
                <span className="absolute left-[-130px] hidden group-hover:inline-block text-sm text-white">
                  Welcome, {loggedInUser}!
                </span>
              </div>

             
              <div className="relative">
                <button onClick={toggleNotificationBox} className="relative bg-transparent border-none p-1">
                  <MdNotificationsNone className="w-6 h-6 text-white" />
                  {notificationCount > 0 && (
                    <span className="absolute top-[-4px] right-[-4px] bg-red-500 text-white text-xs rounded-full px-1.5">
                      {notificationCount}
                    </span>
                  )}
                </button>

                {isNotificationVisible && (
                  <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg overflow-hidden z-50">
                    <div className="px-4 py-2 font-semibold text-lg text-gray-700 border-b">Notifications</div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="px-4 py-2 text-gray-600">No new notifications</p>
                      ) : (
                        notifications.map((notification, index) => (
                          <div key={index} className="flex items-start px-4 py-3 border-b hover:bg-gray-100">
                            <div className="w-8 h-8 flex items-center justify-center mr-3">
                              <MdNotificationsNone className="w-6 h-6 text-gray-500" />
                            </div>
                            <div className="text-sm flex-1">
                              <p className="text-gray-600">{notification.message}</p>
                              {notification.time && (
                                <p className="text-gray-400 text-xs mt-1">{notification.time}</p>
                              )}
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

              <button className={buttonStyling} onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button className={buttonStyling} onClick={() => navigate("/login?signin=true")}>Sign Up</button>
              <button className={buttonStyling} onClick={() => navigate("/login")}>Log In</button>
            </>
          )}
        </div>
      </div>

      
      <div className="mt-6 scrollbar-hide" />
    </>
  );
}

export default Navbar;
