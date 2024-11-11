import React from 'react';
import {  FaHeart, FaHistory, FaGlobe, FaUserFriends } from 'react-icons/fa';
import { IoMdHome } from "react-icons/io";
import { IoSearchSharp } from "react-icons/io5";
import { MdLibraryMusic } from "react-icons/md";
import { FiPlusCircle } from "react-icons/fi";
import { AiOutlineUser } from 'react-icons/ai'; 
const IconText = ({ iconName, displayText, active }) => {
  const iconMap = {
    home: <IoMdHome className="text-3xl"/>,
    search: <IoSearchSharp className="text-2xl"/>,
    library_music: <MdLibraryMusic className="text-2xl"/>,
    library_add: <FiPlusCircle className="text-2xl"/>,
    favorite: <FaHeart className="text-2xl"/>,
    history: <FaHistory className="text-2xl"/>,
    public: <FaGlobe className="text-2xl"/>,
    artist :<AiOutlineUser className="text-2xl"/>,
    room:<FaUserFriends className = "text-2xl"/>
  };

  return (
    <div className={`flex items-center p-2 rounded ${active ? ' text-gray' : 'text-white-900 hover:text-white'}`}>
      <div className="mr-5 mb-2 ml-3">
        {iconMap[iconName]}
      </div >
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-lg ml-3 pb-8">{displayText}</span>
      </div>
    </div>
  );
};

export default IconText;
