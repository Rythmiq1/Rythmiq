import React, { useState } from 'react';
import logo from "../assets/images/logo-bg.png";
import logoh from  "../assets/images/browser-logo.png";
import IconText from '../components/IconText';
import { Link } from 'react-router-dom';

function Sidebar() {
  const [activeLink, setActiveLink] = useState('/home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);  // Track sidebar open state

  return (
    <div
      className={`sidebar-container bg-gray-900 text-white h-full ${isSidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 ease-in-out group`}
      onMouseEnter={() => setIsSidebarOpen(true)}  // Open sidebar on hover
      onMouseLeave={() => setIsSidebarOpen(false)}  // Close sidebar on hover out
    >
      {/* Logo Section */}
      <div className="logoDiv p-4 flex justify-center">
  <img
    src={isSidebarOpen ? logo : logoh}  // Switch logo based on sidebar state
    alt="logo"
    className="cursor-pointer transition-all duration-300" style={isSidebarOpen ? { width: 'auto', height: 'auto' } : { width: '180px', height: '60px' }}
  />
</div>

      
      <div className="py-3 space-y-4">
        <Link to="/home" onClick={() => setActiveLink('/home')} className="sidebar-link">
          <IconText iconName="home" displayText="Home" active={activeLink === '/home'} />
        </Link>

        <Link to="/search" onClick={() => setActiveLink('/search')} className="sidebar-link">
          <IconText iconName="search" displayText="Search" active={activeLink === '/search'} />
        </Link>

        <Link to="/library" onClick={() => setActiveLink('/library')} className="sidebar-link">
          <IconText iconName="library_music" displayText="Your Library" active={activeLink === '/library'} />
        </Link>
      {/* </div>

      {/* Additional Options Section */}
      <div className="pt-5 space-y-2">
        <Link to="/playlist" onClick={() => setActiveLink('/playlist')} className="sidebar-link">
          <IconText iconName="library_add" displayText="Create Playlist" active={activeLink === '/playlist'} />
        </Link>
        <Link to="/liked-songs" onClick={() => setActiveLink('/liked-songs')} className="sidebar-link">
          <IconText iconName="favorite" displayText="Liked Songs" active={activeLink === '/liked-songs'} />
        </Link>
        <Link to="/history" onClick={() => setActiveLink('/history')} className="sidebar-link">
          <IconText iconName="history" displayText="History" active={activeLink === '/history'} />
        </Link>
      </div>

      {/* Language Selector and Footer Links */}
      {/* Conditionally render the footer only when the sidebar is open */}
      {isSidebarOpen && (
        <div className="px-5 pb-5">
          <div className="mt-4 text-gray-400 text-xs space-y-1">
            {["About Us", "Cookies", "Privacy Center", "Privacy Policy", "Legal"].map((text, index) => (
              <p key={index} className="hover:text-white cursor-pointer transition duration-200 transform hover:scale-105">
                {text}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
    </div>
  );
}

export default Sidebar;

