import React from 'react';
import { FaPlay, FaPlus, FaEllipsisH } from 'react-icons/fa'; // Importing icons from react-icons

const Share = () => {
  const currentAlbum = 
  {
    image: 'https://i2.cinestaan.com/image-bank/1500-1500/66001-67000/66708.jpg', // Replace with actual album cover image
    title: 'Super Sharanya',
    artist: 'Armaan Malik',
    year: '2022',
    songCount: '24 songs, 45 min 37 sec',
    songs: [
      { title: 'Ashubha Mangalakaari', artist: 'Justin Varghese, Sarath Chetanpady, Meera Johny', duration: '4:02' },
      { title: 'Shaaru Shaaru', artist: 'Justin Varghese, Meera Johny, Hafsath Abdussalam K P', duration: '3:43' },
      { title: 'Pacha Paayal', artist: 'Justin Varghese, Catherine Francis, Christin Jos', duration: '5:00' },
      { title: 'Shaaru In Town', artist: 'Justin Varghese', duration: '1:49' },
    ]
  };

  return (
<div className="w-full h-full min-h-screen bg-gradient-to-b from-teal-700 to-black p-8 text-white flex flex-col">
     
      <div className="flex items-center w-full h-full">
            <img src={currentAlbum.image} alt={currentAlbum.title}
            className="h-40 w-40 object-cover shadow-lg transform transition-all duration-200 hover:scale-200 hover:border-4 hover:border-white"
            />

        <div className="ml-8">
          <p className="uppercase text-sm">Album</p>
          <h1 className="text-6xl font-bold">{currentAlbum.title}</h1>
          <p className="text-lg mt-2">
            {currentAlbum.artist} • {currentAlbum.year} • {currentAlbum.songCount}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center mt-0 space-x-4">

      <button className="bg-transparent border border-white hover:border-2 hover:border-white text-white text-lg font-bold py-2 px-4 rounded-full flex items-center transition-all duration-500 ease-in-out">
        <FaPlay className="mr-2" /></button>
        <button className="bg-transparent border border-white hover:border-2 hover:border-white text-white text-lg font-bold py-2 px-4 rounded-full flex items-center transition-all duration-500 ease-in-out">
        <FaPlus className="mr-2" /></button>
        <button className="bg-transparent border border-white hover:border-2 hover:border-white text-white text-lg font-bold py-2 px-4 rounded-full flex items-center transition-all duration-500 ease-in-out">
        <FaEllipsisH className="mr-2" /></button>

      </div>

      {/* Song List */}
      <div className="mt-8">
        <div className="flex justify-between items-center text-gray-400 border-b border-gray-700 pb-2">
          
          <span>Title</span>
          <span>Duration</span>
        </div>
        <ul className="mt-4">
          {currentAlbum.songs.map((song, index) => (
            <li
              key={index}
              className="flex justify-between items-center py-2 hover:bg-gray-800 rounded-md transition duration-200"
            >
              
              <div>
                <p className="font-bold text-white">{song.title}</p>
                <p className="text-gray-400 text-sm">{song.artist}</p>
              </div>
              <span className="text-gray-400">{song.duration}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Share;
