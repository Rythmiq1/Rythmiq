import React from 'react';
import logo from "../assets/images/Rhythmiq-bg.ico";
import home_icon from '../assets/home.png';
import search_icon from '../assets/search.png';
import stack_icon from '../assets/stack.png';
import arrow_icon from '../assets/arrow.png';
import plus_icon from '../assets/plus.png';

function Sidebar() {
  return (
    <div className="sidebar-container bg-black text-white h-full flex flex-col justify-between rounded-lg p-4">
      {/* Logo and Navigation */}
      <div className="navigation-section space-y-4">
        {/* Logo */}
        <div className="logo mb-6 pl-4 cursor-pointer">
          <img src={logo} alt="Rhythmiq Logo" className="w-32 h-auto" />
        </div>

        {/* Home and Search Links */}
        <div onClick={() => navigate('/')} className="flex items-center gap-3 pl-4 cursor-pointer hover:text-gray-300 transition duration-200">
          <img className="w-6" src={home_icon} alt="Home Icon" />
          <p className="font-bold">Home</p>
        </div>
        <div className="flex items-center gap-3 pl-4 cursor-pointer hover:text-gray-300 transition duration-200">
          <img className="w-6" src={search_icon} alt="Search Icon" />
          <p className="font-bold">Search</p>
        </div>
      </div>

      {/* Library Section */}
      <div className="library-section bg-[#121212] h-[85%] mt-6 rounded-lg">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img className="w-8" src={stack_icon} alt="Library Icon" />
            <p className="font-semibold">Your Library</p>
          </div>
          <div className="flex items-center gap-3 ">
            <img className="w-5 cursor-pointer" src={arrow_icon} alt="Expand Icon" />
            <img className="w-5 cursor-pointer" src={plus_icon} alt="Add Icon" />
          </div>
        </div>

        {/* Playlist and Podcast Creation Sections */}
        <div className="playlist-creation-section p-4 bg-[#242424] m-2 rounded-lg flex flex-col items-start gap-1 pl-4">
          <h1 className="font-semibold">Create your first playlist</h1>
          <p className="font-light text-sm">It's easy, we will help you</p>
          <button className="px-4 py-1.5 bg-white  text-black text-[15px] rounded-full mt-4 hover:bg-gray-200 transition duration-200">Create Playlist</button>
        </div>

        <div className="podcast-creation-section p-4 bg-[#242424] m-2 rounded-lg flex flex-col items-start gap-1 pl-4 mt-4">
          <h1 className="font-semibold">Let's find some podcasts to follow</h1>
          <p className="font-light text-sm">We'll keep you updated on new episodes</p>
          <button className="px-4 py-1.5 bg-white text-black text-[15px] rounded-full mt-4 hover:bg-gray-200 transition duration-200">Browse Podcasts</button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
