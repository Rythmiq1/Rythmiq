import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from "../config"; 
function Home({ onSongSelect,recommendations  }) {
  const [playlistsData, setPlaylistsData] = useState([]); // For playlists
  const [songsData, setSongsData] = useState([]); // For all songs
  const [lastFiveSongs, setLastFiveSongs] = useState([]); // For the last 5 songs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch both playlists and songs data
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/album/list`);
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
        const response = await axios.get(`${BASE_URL}/song/list`);
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
        const response = await axios.get(`${BASE_URL}/song/last5`);
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
    <div className='ml-2 rounded-lg  bg-black mb-20 gap pl-8 z-4' >
      {/* Playlists Section */}
      <SongListView titleText={"Latest Release"} cardData={lastFiveSongs} onSongSelect={onSongSelect} />
      <PlayListView titleText={"Playlist"} cardData={playlistsData} />

      {/* Songs Available Section */}
      <SongListView titleText={"Songs Available"} cardData={songsData} onSongSelect={onSongSelect} />

      {/* Sound of India Section - Show the last 5 songs */}
      <SongListView titleText={"Recommended for You"} cardData={recommendations} onSongSelect={onSongSelect} />
    </div>
  );
}

const PlayListView = ({ titleText, cardData }) => {
  const navigate = useNavigate();

  return (
    <div className='ml-4 text-white mt-8'>
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
    <div className='ml-4  text-white mt-8'>
      <div className='text-2xl font-semibold mb-5'>{titleText}</div>
      <div className='w-full flex  overflow-x-auto space-x-4 scrollbar-hide'>
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
    <div className="ml-4 flex flex-wrap gap-6 justify-around">
  <div
    className="max-w-[20rem] w-56 rounded-md shadow-md bg-black dark:text-gray-800 
      flex flex-col cursor-pointer transform transition-transform duration-200 
      hover:scale-95 gas he"
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
    <div className="px-4 py-2 rounded-lg cursor-pointer transition duration-200">
    <div
      className="max-w-[16rem] w-72 rounded-md shadow-md text-white 
        flex flex-col cursor-pointer transform transition-transform duration-200 
        hover:scale-95 hover:border-2 gas he"
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
