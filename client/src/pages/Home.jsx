import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [userdata, setUserdata] = useState({});
  const [loggedInUser, setLoggedInUser] = useState('');
  const location = useLocation(); 

  useEffect(() => {

    const storedUser = localStorage.getItem('loggedInUser');
    setLoggedInUser(storedUser);

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

  
    const params = new URLSearchParams(location.search);
    const token = params.get('token'); 
    const name = params.get('name');


    if (token && name) {
      localStorage.setItem('token', token);
      localStorage.setItem('loggedInUser', name);
      console.log("User logged in via Google:", name); 
    }

    getUser();
  }, [location]);

  return (
    <>
      <header>
        <nav>
          <div>
            <ul>
              <li><NavLink to="/">Home</NavLink></li>
              {Object.keys(userdata).length > 0 ? (
                <>
                  <li>{userdata.displayName || loggedInUser}</li>
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

  );
}

export default Home;
