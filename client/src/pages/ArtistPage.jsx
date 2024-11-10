import React from 'react';
import { useParams } from 'react-router-dom';
import darshu from '../assets/darshu.jfif'; 
import darshu1 from '../assets/darshu1.jpg'; 
import { FaPlay } from 'react-icons/fa';
import { FiMoreHorizontal } from 'react-icons/fi';

const ArtistPage = () => {
  const { id } = useParams(); 
  const artists = [
    { id: '1', name: 'Artist 1', description: 'Description for Artist 1', image: darshu }, 
    { id: '2', name: 'Artist 2', description: 'Description for Artist 2', image: darshu },
  ];

  const songs = [
    { id: 1, image: darshu1, name: 'Song 1', duration: '3:45' },
    { id: 2, image: darshu, name: 'Song 2', duration: '4:20' },
    { id: 3, image:darshu1, name: 'Song 3', duration: '2:55' },
    { id: 4, image: darshu, name: 'Song 4', duration: '5:10' },
  ];

  const artist = artists.find(artist => artist.id === id);

  if (!artist) {
    return <p>Artist not found</p>; 
  }

  return (
    <div className="artist-page p-0 m-0 mb-20 ">
      <div className="relative w-full h-72">
        <img src={artist.image} alt={artist.name} className="w-full h-80 object-cover" />
        <h1 className="absolute bottom-2 left-4 text-white text-[200px] font-bold bg-opacity-50 px-4 py-2">
          {artist.name}
        </h1>
      </div>

      <div>

      <p className="ml-4 text-white mt-10 mb-4">{artist.description}</p>
    <button className="bg-white ml-6 rounded-full p-4 text-[#006161] hover:bg-[#006161] hover:text-white">
          <FaPlay size={20} />
    </button>
    <button className="bg-transparent ml-4 rounded-full p-4 text-white hover:bg-[#006161] hover:text-white border-none focus:outline-none">
    <FiMoreHorizontal size={20} />
    </button>

    </div>

    <div className='mt-4 mb-4'>
      <h2 className=" font-bold ml-5 text-6xl text-[#006161]">Popular</h2>
    </div>

    <div className="space-y-4 mt-8">
  {songs.map((song, index) => (
    <div key={song.id} className="flex "> 
      <span className="text-xl text-white ml-7">{index + 1}</span>
      <img src={song.image} alt={song.name} className="w-16 h-16 object-cover rounded ml-[200px]" />
        <h3 className="text-white font-semibold ml-[450px]">{song.name}</h3>
        <p className="text-sm text-white ml-[550px]">{song.duration}</p>
    </div>
  ))}
</div>


     

      
    </div>
  );
};

export default ArtistPage;
