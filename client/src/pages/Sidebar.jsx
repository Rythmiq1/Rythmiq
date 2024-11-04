import React from 'react';
import logo from "../assets/images/Rhythmiq-bg.ico";
import IconText from '../components/IconText';
import { Link } from 'react-router-dom'; // Import Link for navigation

function Sidebar() {
  return (
    <div className="sidebar-container bg-gray-900 text-white h-full">
      {/* Logo Section */}
      <div className="logoDiv p-6">
        <img src={logo} alt="logo" className="w-40 h-auto cursor-pointer" />
      </div>

  
      <div className="py-5 space-y-4">
      
        <Link to="/home"> 
          <IconText iconName="home" displayText="Home" active/>
        </Link>

        <Link to="/search"> 
          <IconText iconName="search" displayText="Search"/>
        </Link>

       
        <IconText iconName="library_music" displayText="Your Library" />
      </div>

      
      <div className="pt-5 space-y-2">
        <IconText iconName="library_add" displayText="Create Playlist" />
        <Link to="/liked-songs"> 
          <IconText iconName="favorite" displayText="Liked Songs" />
        </Link>
        <Link to="/history" className="text-white flex items-center p-2 rounded">
      <IconText iconName="history" displayText="History" />
        </Link>
      </div>

     
      <div className="px-5 pb-5">
  
        <div className="flex items-center border border-gray-100 text-white w-3/4 rounded-full px-2 py-1
         hover:border-white cursor-pointer transition-colors duration-200">
          <IconText iconName="public" displayText="English" />
        </div>

        {/* Footer Links */}
        <div className="mt-4 text-gray-400 text-xs space-y-1">
          {["About Us", "Cookies", "Privacy Center", "Privacy Policy", "Legal"].map((text, index) => (
            <p key={index} className="hover:text-white cursor-pointer transition duration-200 transform hover:scale-105">
              {text}-
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
