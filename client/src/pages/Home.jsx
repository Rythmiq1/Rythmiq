import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home({ onSongSelect }) {
  const [playlistsData, setPlaylistsData] = useState([]); // For playlists
  const [songsData, setSongsData] = useState([]); // For songs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch both playlists and songs data
    const fetchPlaylists = async () => {
      try {
        const response = await fetch('http://localhost:8080/album/list');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data.albums)) {
          setPlaylistsData(data.albums); // Set playlists data
        } else {
          throw new Error('Data fetched for playlists is not an array');
        }
      } catch (error) {
        console.error("Error fetching playlists:", error);
        setError(error.message);
      }
    };

    const fetchSongs = async () => {
      try {
        const response = await fetch('http://localhost:8080/song/list');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data.songs)) {
          setSongsData(data.songs); // Set songs data
        } else {
          throw new Error('Data fetched for songs is not an array');
        }
      } catch (error) {
        console.error("Error fetching songs:", error);
        setError(error.message);
      }
    };

    // Execute both fetch operations
    Promise.all([fetchPlaylists(), fetchSongs()]).finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='bg-black mb-20 gap'>
      {/* Playlists Section */}
      <PlayListView titleText={"Playlist"} cardData={playlistsData} />

      {/* Songs Available Section */}
      <SongListView titleText={"Songs Available"} cardData={songsData} onSongSelect={onSongSelect} />

      {/* Sound of India Section */}
      <SongListView titleText={"Sound Of India"} cardData={songsData} onSongSelect={onSongSelect} />
    </div>
  );
}

const PlayListView = ({ titleText, cardData }) => {
  const navigate = useNavigate();

  return (
    <div className='text-white mt-8'>
      <div className='text-2xl font-semibold mb-5'>{titleText}</div>
      <div className='w-full flex overflow-x-auto space-x-4 scrollbar-hide'>
        {cardData.map((playlist) => (
          <div
            key={playlist._id}
            onClick={() => navigate(`/album-p/${playlist._id}`)} 
          >
            <PlaylistCard 
              name={playlist.name} 
              desc={playlist.desc} 
              image={playlist.image} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const SongListView = ({ titleText, cardData, onSongSelect }) => {
  return (
    <div className='text-white mt-8'>
      <div className='text-2xl font-semibold mb-5'>{titleText}</div>
      <div className='w-full flex overflow-x-auto space-x-4 scrollbar-hide'>
        {cardData.map((song) => (
          <div
            key={song._id}
            onClick={() => onSongSelect(song)}  // Pass the selected song to the parent (Home)
          >
            <SongCard 
              name={song.name} 
              desc={song.desc} 
              image={song.image} 
            />
          </div>
        ))}
      </div>
    </div>

   
  );
};

const PlaylistCard = ({ name, desc, image }) => {
  return (
    // <div className="w-80 h-60 px-4 py-2 rounded-lg bg-black bg-opacity-40 hover:bg-opacity-50 cursor-pointer transition duration-200 gas xe">
    //   <img 
    //     src={image} 
    //     alt={name} 
    //     className='w-full h-40 object-cover rounded-md' 
    //   />
    //   <div className='mt-2'>
    //     <h3 className='text-lg font-semibold text-white'>{name}</h3>
    //     <p className='text-gray-400 text-sm'>{desc}</p>
    //   </div>
    // </div>
    <div className="flex flex-wrap gap-6 justify-around">
  <div
    className="max-w-[20rem] w-56 rounded-md shadow-md bg-black dark:text-gray-800 
      flex flex-col cursor-pointer transform transition-transform duration-200 
      hover:scale-105 gas he"
    onClick={() => handleCardClick('fixed-artist-id')}
  >
    <img src={image} alt={name} className="w-full h-52 object-cover rounded-md" />

    <div className="flex-grow p-4 space-y-4 flex flex-col justify-between">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold tracking-wide text-white">{name}</h2>
        <p className="text-white text-sm">{desc}</p>
      </div>
    </div>
  </div>

  {/* Repeat the card for each additional item */}
</div>

  );
};

const SongCard = ({ name, desc, image }) => {
  return (
    // <div className="w-80 h-60 px-4 py-2 rounded-lg bg-gray-800 bg-opacity-50 hover:bg-opacity-50 cursor-pointer transition duration-200">
    //   <img 
    //     src={image} 
    //     alt={name} 
    //     className='w-full h-40 object-cover rounded-md' 
    //   />
    //   <div className='mt-2'>
    //     <h3 className='text-lg font-semibold text-white'>{name}</h3>
    //     <p className='text-gray-400 text-sm'>{desc}</p>
    //   </div>
    // </div>

    <div className="px-4 py-2 rounded-lg cursor-pointer transition duration-200">
    <div
      className="max-w-[16rem] w-72 rounded-md shadow-md text-white 
        flex flex-col cursor-pointer transform transition-transform duration-200 
        hover:scale-105 hover:border-2 gas he"
    >
      <img
        src={image}
        alt={name}
        className="object-cover w-full h-64 rounded-t-md"
      />
  
      <div className="flex-grow p-4 space-y-4 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="h-8"> 
            <h2 className="text-l font-semibold tracking-wide text-white truncate">
              {name}
            </h2>
          </div>
          <p className="text-sm text-white overflow-hidden text-ellipsis line-clamp-2">
            {desc}
          </p>
        </div>
      </div>
    </div>
  </div>
  
  
  );
};

export default Home;
