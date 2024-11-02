import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';
import logo_small from '../assets/logo_small.png';
import add_song from '../assets/add_song.png';
import song_icon from '../assets/song_icon.png';
import add_album from '../assets/add_album.png';
import album_icon from '../assets/album_icon.png';

const Sidebar = () => {
    return (
        <div className='bg-black min-h-screen pl-[4vw]'>

            <div className="flex flex-col gap-5 mt-10">

                <NavLink to='/add-song' className="flex items-center gap-2.5 text-gray-800
                 bg-white border border-black p-2 pr-[max(8vw,10px)] drop-shadow-[-4px_4px_#00FF5B] text-sm font-medium">
                    <img className='w-5' src={add_song} alt="" />
                    <p className='hidden sm:block'>Add Song</p>
                </NavLink>

                <NavLink to='/list-songs' className="flex items-center gap-2.5 text-gray-800
                 bg-white border border-black p-2 pr-[max(8vw,10px)] drop-shadow-[-4px_4px_#00FF5B] text-sm font-medium">
                    <img className='w-5' src={song_icon} alt="" />
                    <p className='hidden sm:block'>List Songs</p>
                </NavLink>

                <NavLink to='/add-album' className="flex items-center gap-2.5 text-gray-800
                 bg-white border border-black p-2 pr-[max(8vw,10px)] drop-shadow-[-4px_4px_#00FF5B] text-sm font-medium">
                    <img className='w-5' src={add_album} alt="" />
                    <p className='hidden sm:block'>Add Album</p>
                </NavLink>

                <NavLink to='/list-albums' className="flex items-center gap-2.5 text-gray-800
                 bg-white border border-black p-2 pr-[max(8vw,10px)] drop-shadow-[-4px_4px_#00FF5B] text-sm font-medium">
                    <img className='w-5' src={album_icon} alt="" />
                    <p className='hidden sm:block'>List Album</p>
                </NavLink>

            </div>
        </div>
    );
}

export default Sidebar;
