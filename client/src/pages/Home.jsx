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
    <div>
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
    <div className="w-80 h-60 px-4 py-2 rounded-lg bg-black bg-opacity-40 hover:bg-opacity-50 cursor-pointer transition duration-200">
      <img 
        src={image} 
        alt={name} 
        className='w-full h-40 object-cover rounded-md' 
      />
      <div className='mt-2'>
        <h3 className='text-lg font-semibold text-white'>{name}</h3>
        <p className='text-gray-400 text-sm'>{desc}</p>
      </div>
    </div>
  );
};

const SongCard = ({ name, desc, image }) => {
  return (
    <div className="w-80 h-60 px-4 py-2 rounded-lg bg-gray-800 bg-opacity-50 hover:bg-opacity-50 cursor-pointer transition duration-200">
      <img 
        src={image} 
        alt={name} 
        className='w-full h-40 object-cover rounded-md' 
      />
      <div className='mt-2'>
        <h3 className='text-lg font-semibold text-white'>{name}</h3>
        <p className='text-gray-400 text-sm'>{desc}</p>
      </div>
    </div>
  );
};

export default Home;
