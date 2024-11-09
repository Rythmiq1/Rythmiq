import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
function Home() {
  const navigate = useNavigate();
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
      <PlayListView titleText={"Playlist"} cardData={playlistsData} />
      <PlayListView titleText={"Songs available"} cardData={songsData} />
      <PlayListView titleText={"Sound Of India"} cardData={songsData} />
    </div>
  );
}

const PlayListView = ({ titleText, cardData }) => {
  return (
    <div className='text-white mt-8'>
      <div className='text-2xl font-semibold mb-5'>{titleText}</div>
      <div className='w-full flex overflow-x-auto space-x-4 scrollbar-hide'>
        {cardData.map((item) => (
          <NavLink to={`/album-p/${item._id}`} key={item._id}> {/* Changed here */}
            <Card 
              name={item.name} 
              desc={item.desc} 
              image={item.image} 
            />
          </NavLink>
        ))}
      </div>
    </div>
  );
};

const Card = ({ name, desc, image }) => {
  return (
    <div className='bg-black bg-opacity-40 w-60 px-4 py-2 rounded-lg hover:bg-opacity-50 transition duration-200 scrollbar-hide'>
      <img src={image} alt={name} className='w-full h-40 object-cover rounded-md' />
      <div className='mt-2'>
        <h3 className='text-lg font-semibold text-white'>{name}</h3>
        <p className='text-gray-400'>{desc}</p>
      </div>
    </div>
  );
}

export default Home;
