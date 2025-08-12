import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import BASE_URL from "../config";
import { Menu, Bell, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Navbar({ notificationCount, setNotificationCount, notifications, onMobileMenuClick }) {
  const buttonStyling =
    "flex items-center space-x-2 font-semibold bg-white text-teal-600 border-2 border-teal-600 rounded px-4 py-2 hover:bg-teal-600 hover:text-white transition-shadow shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-300";

  const [loggedInUser, setLoggedInUser] = useState("");
  const [userdata, setUserdata] = useState({});
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const notifRef = useRef(null);
  const bellRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  const toggleNotifications = () => {
    setIsNotifOpen((prev) => !prev);
    if (notificationCount > 0) setNotificationCount(0);
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    setLoggedInUser("");
    setUserdata({});
    navigate("/login");
  };

  const getInitials = (name) =>
    name?.split(" ").map((word) => word[0].toUpperCase()).join("") || "";

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const name = params.get("name");
    const id = params.get("userId");

    if (token && name) {
      localStorage.setItem("token", token);
      localStorage.setItem("loggedInUser", name);
      localStorage.setItem("userId", id);
      setLoggedInUser(name);
    } else {
      const storedUser = localStorage.getItem("loggedInUser");
      if (storedUser) setLoggedInUser(storedUser);
    }

    const getUser = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const response = await axios.get(`${BASE_URL}/login/success`, {
            headers: { Authorization: storedToken },
            withCredentials: true,
          });
          setUserdata(response.data.user);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    getUser();
  }, [location]);

  useEffect(() => {
    if (!isNotifOpen) return;

    const handleClickOutside = (event) => {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target) &&
        bellRef.current &&
        !bellRef.current.contains(event.target)
      ) {
        setIsNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotifOpen]);

  return (
    <>
      <div className="fixed top-0 left-0 w-full bg-black text-white px-4 py-2 flex items-center justify-between z-50 shadow-md">
        <div className="flex items-center md:hidden">
          <button
            onClick={onMobileMenuClick}
            className="bg-transparent border-none text-white p-2 focus:outline-none z-50"
            aria-label="Open mobile menu"
          >
            <Menu size={28} />
          </button>
        </div>

        <div className="flex items-center space-x-5 ml-auto relative text-gray-100">
          {loggedInUser ? (
            <>
              <div className="relative group">
                <div
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-600 to-teal-800 text-white font-semibold flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform select-none"
                >
                  {getInitials(loggedInUser)}
                </div>

                <span className="hidden md:block absolute left-full top-1/2 transform -translate-y-1/2 ml-3 px-2 py-1 rounded-md bg-gray-900 bg-opacity-80 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                  Welcome, {loggedInUser}!
                </span>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-12 w-64 bg-gray-900 text-white rounded-xl shadow-2xl p-3 backdrop-blur-md border border-gray-700 z-50 md:hidden"
                    >
                      <button
                        onClick={toggleNotifications}
                        className="bg-inherit border-none flex items-center justify-between w-full px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Bell className="bg-inherit w-5 h-5 text-teal-300" />
                          <span className="text-sm">Notifications</span>
                        </div>
                        {notificationCount > 0 && (
                          <span className="bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-0.5">
                            {notificationCount}
                          </span>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          handleLogout();
                          setIsDropdownOpen(false);
                        }}
                        className="bg-inherit border-none flex items-center gap-3 w-full px-4 py-3 mt-2 rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        <LogOut className="w-5 h-5 text-red-400" />
                        <span className="text-sm">Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative hidden md:block" ref={bellRef}>
                <button
                  onClick={toggleNotifications}
                  aria-label="Toggle notifications"
                  className="bg-inherit border-none relative p-1 rounded-md hover:bg-gray-300 hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-teal-300"
                >
                  <Bell className="bg-inherit w-6 h-6 text-gray-100" />
                  {notificationCount > 0 && (
                    <span className="bg-inherit absolute -top-1 -right-1 bg-red-600 text-white text-xs font-semibold rounded-full px-1.5 select-none">
                      {notificationCount}
                    </span>
                  )}
                </button>
              </div>

              <AnimatePresence>
                {isNotifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    ref={notifRef}
                    className="absolute right-0 top-14 w-80 max-h-80 overflow-hidden rounded-lg bg-gray-900 text-white shadow-2xl border border-gray-700 z-50"
                  >
                    <div className="px-5 py-3 border-b border-gray-700 font-semibold text-lg">
                      Notifications
                    </div>
                    <div className="max-h-64 overflow-y-auto custom-scrollbar">
                      {notifications.length === 0 ? (
                        <p className="p-4 text-center text-gray-400">No new notifications</p>
                      ) : (
                        notifications.map((notif, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-3 px-5 py-3 border-b border-gray-700 hover:bg-gray-800 transition"
                          >
                            <Bell className="w-5 h-5 flex-shrink-0 text-teal-300 mt-1" />
                            <div className="flex-grow text-sm text-gray-200">
                              <p>{notif.message}</p>
                              {notif.time && (
                                <p className="mt-1 text-xs text-gray-500">{notif.time}</p>
                              )}
                            </div>
                            <a
                              href="#"
                              className="text-sm text-teal-300 hover:underline self-start"
                            >
                              View
                            </a>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="px-5 py-3 text-center border-t border-gray-700">
                      <a href="#" className="text-sm text-gray-400 hover:underline">
                        See all
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
  onClick={handleLogout}
  className={`hidden md:flex items-center gap-2 ${buttonStyling}`}
>
  <LogOut className="w-5 h-5" />
  Logout
</button>

            </>
          ) : (
            <>
              <button
                className={buttonStyling}
                onClick={() => navigate("/login?signin=true")}
              >
                <span>Sign Up</span>
              </button>
              <button
                className={buttonStyling}
                onClick={() => navigate("/login")}
              >
                <span>Log In</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mt-6" />
    </>
  );
}

export default Navbar;
