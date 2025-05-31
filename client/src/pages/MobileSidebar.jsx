import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react'; 
import logo from "../assets/images/logo-bg.png";
import IconText from '../components/IconText';

function MobileSidebar({ isOpen, onClose }) {
  const [activeLink, setActiveLink] = useState('/home');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isMobile || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex scrollbar-hide overflow-auto">
     
      <div className="overflow-auto scrollbar-hide w-16 h-full bg-black text-white py-6 shadow-xl flex flex-col items-center space-y-6 relative">
        
        <button
          onClick={onClose}
          className="bg-inherit border-0 absolute top-0 right-1  w-8 h-8 text-white hover:text-gray-400"
        >
          <X size={25} />Close
        </button>

       
        <img src={logo} alt="Logo" className="h-10 mt-10 mb-6" />

        
        {[
          { to: '/home', icon: 'home', text: 'Home' },
          { to: '/search', icon: 'search', text: 'Search' },
          { to: '/library', icon: 'library_music', text: 'Your Library' },
          { to: '/playlist', icon: 'library_add', text: 'Create Playlist' },
          { to: '/liked-songs', icon: 'favorite', text: 'Liked Songs' },
          { to: '/history', icon: 'history', text: 'History' },
          { to: '/artists', icon: 'artist', text: 'Artists' },
          { to: '/room', icon: 'room', text: 'Room' },
          { to: '/info', icon: 'info', text: 'Info' },
          
        ].map(({ to, icon, text }) => (
          <Link
            key={to}
            to={to}
            onClick={() => {
              setActiveLink(to);
              onClose();
            }}
            className="overflow-auto scrollbar-hide group relative"
          >
            <IconText iconName={icon} displayText="" active={activeLink === to} />
            <span className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 text-xs bg-white text-black rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              {text}
            </span>
          </Link>
        ))}
      </div>

      
      <div className="flex-1 bg-black bg-opacity-70" onClick={onClose} />
    </div>
  );
}

export default MobileSidebar;
