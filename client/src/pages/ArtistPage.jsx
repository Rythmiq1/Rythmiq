import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaPlay } from 'react-icons/fa';
import { FiMoreHorizontal } from 'react-icons/fi';

const ArtistPage = () => {
  const { id } = useParams(); 
  const [artist, setArtist] = useState(null);  
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    
    const fetchArtist = async () => {
      try {
        const response = await fetch(`http://localhost:8080/artist/artists/${id}`);
        const data = await response.json();

        if (data.success) {
          setArtist(data.data); 
        } else {
          console.error('Artist not found');
        }
      } catch (error) {
        console.error('Error fetching artist:', error);
      } finally {
        setLoading(false);  
      }
    };

    fetchArtist();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;  
  }

  if (!artist) {
    return <p>Artist not found</p>;  
  }

  return (
    <div className="artist-page p-0 m-0 mb-20 ">
    <div className="relative w-full h-[450px] mt-2">
  <img src={artist.image} alt={artist.name} className="w-full h-[500px] object-cover object-top" />
  <h1 className="absolute bottom-2 left-4 text-white text-[80px] lg:text-[200px] font-bold bg-opacity-50 px-4 py-2 mt-0 max-w-[90%] break-words">
  {artist.name}
</h1>

</div>


      <div>
        <p className="ml-4 text-white mt-24 mb-4">{artist.bio}</p>
        <button className="bg-white ml-6 rounded-full p-4 text-[#006161] hover:bg-[#006161] hover:text-white">
          <FaPlay size={20} />
        </button>
        <button className="bg-transparent ml-4 rounded-full p-4 text-white hover:bg-[#006161] hover:text-white border-none focus:outline-none">
          <FiMoreHorizontal size={20} />
        </button>
      </div>

      <div className="mt-4 mb-4">
        <h2 className="font-bold ml-5 text-6xl text-[#006161]">Popular</h2>
      </div>

      <div className="space-y-4 mt-8">
        {artist.songs.map((song, index) => (
          <div key={song._id} className="flex">
            <span className="text-xl text-white ml-7">{index + 1}</span>
            <img src={song.image} alt={song.name} className="w-16 h-16 object-cover rounded ml-[200px]" />
            <h3 className="text-white font-semibold ml-[400px]">{song.name}</h3>
            <p className="text-sm text-white ml-[550px]">{song.duration}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistPage;