import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Heart, HeartOff } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BASE_URL from "../config";

function Home({ onSongSelect, recommendations }) {
  const [playlistsData, setPlaylistsData] = useState([]);
  const [songsData, setSongsData] = useState([]);
  const [lastFiveSongs, setLastFiveSongs] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [albumsRes, songsRes, last5Res, likedRes] = await Promise.all([
          axios.get(`${BASE_URL}/album/list`),
          axios.get(`${BASE_URL}/song/list`),
          axios.get(`${BASE_URL}/song/last5`),
          axios.get(`${BASE_URL}/auth/get-liked`, {
            headers: { Authorization: localStorage.getItem('token') },
          }),
        ]);

        if (Array.isArray(albumsRes.data.albums)) setPlaylistsData(albumsRes.data.albums);
        if (Array.isArray(songsRes.data.songs)) setSongsData(shuffleArray(songsRes.data.songs));
        if (Array.isArray(last5Res.data.songs)) setLastFiveSongs(last5Res.data.songs);
        if (likedRes.data.success) {
          setLikedSongs(likedRes.data.data.map(song => song._id));
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  const handleLikeToggle = async (songId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to like songs');
      return;
    }

    try {
      const headers = { Authorization: token };
      const isLiked = likedSongs.includes(songId);
      let res;

      if (isLiked) {
        res = await axios.delete(`${BASE_URL}/auth/delete-like-song`, {
          data: { songId },
          headers,
        });
      } else {
        res = await axios.post(`${BASE_URL}/auth/like-song`, { songId }, { headers });
      }

      if (res.data.success) {
        setLikedSongs(prev =>
          isLiked ? prev.filter(id => id !== songId) : [...prev, songId]
        );
        toast.success(isLiked ? 'Song unliked!' : 'Song liked!');
      } else {
        toast.error('Failed to update like status');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like status');
    }
  };

  if (loading) return <div className="text-white p-6">Loading...</div>;
  if (error) return <div className="text-red-500 p-6">Error: {error}</div>;

  return (
    <div className="px-4 py-8 bg-black min-h-screen text-white">
      <ToastContainer />
      <SongListView
        titleText="Latest Release"
        cardData={lastFiveSongs}
        onSongSelect={onSongSelect}
        likedSongs={likedSongs}
        onToggleLike={handleLikeToggle}
      />
      <PlayListView titleText="Playlist" cardData={playlistsData} />
      <SongListView
        titleText="Songs Available"
        cardData={songsData}
        onSongSelect={onSongSelect}
        likedSongs={likedSongs}
        onToggleLike={handleLikeToggle}
      />
      <SongListView
        titleText="Recommended for You"
        cardData={recommendations}
        onSongSelect={onSongSelect}
        likedSongs={likedSongs}
        onToggleLike={handleLikeToggle}
      />
    </div>
  );
}

const PlayListView = ({ titleText, cardData }) => {
  const navigate = useNavigate();

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold mb-5">{titleText}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {cardData.map((playlist) => (
          <div key={playlist._id} onClick={() => navigate(`/album-p/${playlist._id}`)}>
            <PlaylistCard name={playlist.name} desc={playlist.desc} image={playlist.image} />
          </div>
        ))}
      </div>
    </div>
  );
};

const SongListView = ({ titleText, cardData, onSongSelect, likedSongs = [], onToggleLike = () => {} }) => {
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold mb-5">{titleText}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {cardData.map((song) => (
          <div key={song._id} className="relative group">
            <SongCard
              name={song.name}
              desc={song.desc}
              image={song.image}
              isLiked={likedSongs.includes(song._id)}
              onClick={() => onSongSelect(song)}
              onToggleLike={() => onToggleLike(song._id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const PlaylistCard = ({ name, desc, image }) => (
  <div className="bg-black rounded-md shadow-md transform transition-transform duration-200 hover:scale-95 hover:shadow-[0_0_15px_#0ff]">
    <img src={image} alt={name} className="w-full h-48 object-cover rounded-t-md" />
    <div className="p-4 space-y-2">
      <h3 className="text-lg font-semibold truncate">{name}</h3>
      <p className="text-sm text-gray-300 line-clamp-2">{desc}</p>
    </div>
  </div>
);

const SongCard = ({ name, desc, image, isLiked, onClick, onToggleLike }) => (
  <div
    onClick={onClick}
    className="relative bg-black rounded-md shadow-md transform transition-transform duration-200 hover:scale-95 border-2 border-yellow-400 shadow-[0_0_15px_#FFD700] "
  >
    <img src={image} alt={name} className="w-full h-52 object-cover rounded-t-md" />
    <div className="p-4 space-y-2">
      <h3 className="text-lg font-semibold truncate">{name}</h3>
      <p className="text-sm text-gray-300 line-clamp-2">{desc}</p>
    </div>
    <div
      className="absolute top-2 right-2 bg-black/60 p-1 rounded-full"
      onClick={(e) => {
        e.stopPropagation(); // Prevent triggering the song select
        onToggleLike();
      }}
    >
      {isLiked ? <Heart className="text-red-500 w-5 h-5" /> : <HeartOff className="text-white w-5 h-5" />}
    </div>
  </div>
);

export default Home;
