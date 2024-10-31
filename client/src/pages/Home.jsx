import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [userdata, setUserdata] = useState({});
  const [loggedInUser, setLoggedInUser] = useState('');
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token'); 
    const name = params.get('name');

    // Log token and name to confirm they are being received
    console.log("Token from URL:", token);
    console.log("Name from URL:", name);

    // Check if token and name are present
    if (token && name) {
      // Store in local storage
      localStorage.setItem('token', token);
      localStorage.setItem('loggedInUser', name);
      console.log("User logged in via Google:", name);
      setLoggedInUser(name); // Update state after setting local storage
    } else {
      // Retrieve from local storage if not in URL
      const storedUser = localStorage.getItem('loggedInUser');
      if (storedUser) {
        setLoggedInUser(storedUser);
      }
    }

    // Fetch user data only if the token is available
    const getUser = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const response = await axios.get("http://localhost:8080/login/success", {
            headers: { Authorization: `Bearer ${storedToken}` },
            withCredentials: true,
          });
          setUserdata(response.data.user);
        } catch (error) {
          console.log('Error fetching user data:', error);
        }
      }
    };

    getUser();
  }, [location]);

  // Logout function to clear local storage and reset state
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    setLoggedInUser('');
    setUserdata({});
  };

  return (
    <>
      <header>
        <nav>
          <div>
            <ul>
              <li><NavLink to="/">Home</NavLink></li>
              {Object.keys(userdata).length > 0 || loggedInUser ? (
                <>
                  <li>{userdata.displayName || loggedInUser}</li>
                  <li><NavLink to="/dashboard">Dashboard</NavLink></li>
                  <li><button onClick={handleLogout}>Logout</button></li>
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
  );
}

export default Home;
