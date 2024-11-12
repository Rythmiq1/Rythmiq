import React, { useState } from 'react';
import logo from "../assets/images/logo-bg.png";
import logoh from "../assets/images/browser-logo.png";
import IconText from '../components/IconText';
import { Link } from 'react-router-dom';

function Sidebar() {
  const [activeLink, setActiveLink] = useState('/home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div
      className={`rounded-lg z-10 sidebar-container bg-black text-white h-full ${isSidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 ease-in-out group`}
      onMouseEnter={() => setIsSidebarOpen(true)}
      onMouseLeave={() => setIsSidebarOpen(false)}
    >
      {/* Logo Section */}
      <div className="logoDiv p-4 flex justify-center">
        {isSidebarOpen ? (
          <img
            src={logo}
            alt="Full Logo"
            className="cursor-pointer transition-all duration-300"
            style={{ width: 'auto', height: '140px', marginTop:'35px'}}
          />
        ) : (
          <div className="w-12 h-12 bg-transparent rounded-full flex items-center justify-center">
            <img
              src={logoh}
              alt="Small Circle Logo"
              className="w-8 h-10"
            />
          </div>
        )}
      </div>

      {/* Sidebar Links */}
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
        <Link to="/playlist" onClick={() => setActiveLink('/playlist')} className="sidebar-link">
          <IconText iconName="library_add" displayText="Create Playlist" active={activeLink === '/playlist'} />
        </Link>
        <Link to="/liked-songs" onClick={() => setActiveLink('/liked-songs')} className="sidebar-link">
          <IconText iconName="favorite" displayText="Liked Songs" active={activeLink === '/liked-songs'} />
        </Link>
        <Link to="/history" onClick={() => setActiveLink('/history')} className="sidebar-link">
          <IconText iconName="history" displayText="History" active={activeLink === '/history'} />
        </Link>
        <Link to="/artists" onClick={() => setActiveLink('/artists')} className="sidebar-link">
          <IconText iconName="artist" displayText="Artists" active={activeLink === '/artists'} />
        </Link>
        <Link to="/room" onClick={() => setActiveLink('/room')} className="sidebar-link">
          <IconText iconName="room" displayText="Room" active={activeLink === '/room'} />
        </Link>

        {/* Footer Links */}
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
