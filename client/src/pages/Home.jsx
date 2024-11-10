import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home({ onSongSelect }) {
  const [playlistsData, setPlaylistsData] = useState([]); // For playlists
  const [songsData, setSongsData] = useState([]); // For all songs
  const [lastFiveSongs, setLastFiveSongs] = useState([]); // For the last 5 songs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch both playlists and songs data
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get('http://localhost:8080/album/list');
        if (Array.isArray(response.data.albums)) {
          setPlaylistsData(response.data.albums); // Set playlists data
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
        const response = await axios.get('http://localhost:8080/song/list');
        if (Array.isArray(response.data.songs)) {
          setSongsData(shuffleArray(response.data.songs)); // Shuffle songs and set data
        } else {
          throw new Error('Data fetched for songs is not an array');
        }
      } catch (error) {
        console.error("Error fetching songs:", error);
        setError(error.message);
      }
    };

    // Fetch last 5 songs for "Sound of India" section
    const fetchLastFiveSongs = async () => {
      try {
        const response = await axios.get('http://localhost:8080/song/last5');
        if (Array.isArray(response.data.songs)) {
          setLastFiveSongs(response.data.songs); // Set last 5 songs data
        } else {
          throw new Error('Data fetched for last 5 songs is not an array');
        }
      } catch (error) {
        console.error("Error fetching last 5 songs:", error);
        setError(error.message);
      }
    };

    // Execute all fetch operations
    Promise.all([fetchPlaylists(), fetchSongs(), fetchLastFiveSongs()])
      .finally(() => setLoading(false));
  }, []);

  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
    }
    return shuffledArray;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='mb-24'>
      {/* Playlists Section */}
      <SongListView titleText={"Latest Release"} cardData={lastFiveSongs} onSongSelect={onSongSelect} />
      <PlayListView titleText={"Playlist"} cardData={playlistsData} />

      {/* Songs Available Section */}
      <SongListView titleText={"Songs Available"} cardData={songsData} onSongSelect={onSongSelect} />

      {/* Sound of India Section - Show the last 5 songs */}
     
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
