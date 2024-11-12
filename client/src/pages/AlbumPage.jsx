import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MusicPlayer from './MusicPlayer';
import axios from 'axios';
import LikedCard from '../components/LikedCard';

const AlbumPage = ({ setCurrentSong }) => {
    const { id } = useParams();
    const [album, setAlbum] = useState(null);
    const [songs, setSongs] = useState([]);
    const [likedSongs, setLikedSongs] = useState([]); // List of liked song IDs
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentSong, setCurrentSongState] = useState(null);

    // Fetch album data
    useEffect(() => {
        const fetchAlbum = async () => {
            try {
                const response = await fetch(`http://localhost:8080/album/${id}`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const data = await response.json();
                if (data.album && Array.isArray(data.songs)) {
                    setAlbum(data.album);
                    setSongs(data.songs);
                } else throw new Error("Album or songs not found");
            } catch (error) {
                console.error("Error fetching album:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAlbum();
        fetchLikedSongs();
    }, [id]);

    // Fetch liked songs
    const fetchLikedSongs = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/auth/get-liked', {
                headers: {
                    Authorization: token,
                },
            });
            if (response.data && response.data.success) {
                setLikedSongs(response.data.data.map(song => song._id)); // Update liked songs list
            }
        } catch (error) {
            console.error('Error fetching liked songs:', error);
            toast.error('Failed to fetch liked songs');
        }
    };
    const handleSelectSong = (song) => {
        console.log(song,songs);
        setCurrentSong(song, songs);
        setCurrentSongState(song);
    };

    if (loading) return <div className="text-white text-xl">Loading...</div>;
    if (error) return <div className="text-white text-xl">Error: {error}</div>;

    return (
        <div className="flex flex-col items-center justify-start min-h-screen   bg-gradient-to-b from-[#006161] to-black p-4 mt-16">
            <ToastContainer />
            {album ? (
                <>
                    <div className="mt-8 w-full flex flex-col items-start">
                        <h2 className="text-2xl font-semibold text-white mb-4">Songs:</h2>
                        <div className="flex overflow-x-auto space-x-4 scrollbar-hide">
                            {songs.length > 0 ? (
                                songs.map((song) => (
                                    <LikedCard
                                        key={song._id} 
                                        song={song} 
                                        isLiked={likedSongs.includes(song._id)} // Pass liked status based on fetched liked songs
                                        onSelect={() => handleSelectSong(song)} 
                                        onToggleLike={() => fetchLikedSongs()} 
                                    />
                                ))
                            ) : (
                                <p className="text-white text-lg">No songs available.</p>
                            )}
                        </div>
                    </div>
                    {currentSong && <MusicPlayer song={currentSong} />}
                </>
            ) : (
                <p className="text-white text-lg">No album data available.</p>
            )}
        </div>
    );
};


export default AlbumPage;

// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import MusicPlayer from './MusicPlayer';
// import axios from 'axios';
// import LikedCard from '../components/LikedCard';

// const AlbumPage = ({ setCurrentSong }) => {
//     const { id } = useParams();
//     const [album, setAlbum] = useState(null);
//     const [songs, setSongs] = useState([]);
//     const [likedSongs, setLikedSongs] = useState([]); // List of liked song IDs
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [currentSong, setCurrentSongState] = useState(null);

//     // Fetch album data
//     useEffect(() => {
//         const fetchAlbum = async () => {
//             try {
//                 const response = await fetch(`http://localhost:8080/album/${id}`);
//                 if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//                 const data = await response.json();
//                 if (data.album && Array.isArray(data.songs)) {
//                     setAlbum(data.album);
//                     setSongs(data.songs);
//                 } else throw new Error("Album or songs not found");
//             } catch (error) {
//                 console.error("Error fetching album:", error);
//                 setError(error.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchAlbum();
//         fetchLikedSongs();
//     }, [id]);

//     // Fetch liked songs
//     const fetchLikedSongs = async () => {
//         try {
//             const token = sessionStorage.getItem('token');
//             const response = await axios.get('http://localhost:8080/auth/get-liked', {
//                 headers: {
//                     Authorization: token,
//                 },
//             });
//             if (response.data && response.data.success) {
//                 setLikedSongs(response.data.data.map(song => song._id)); // Update liked songs list
//             }
//         } catch (error) {
//             console.error('Error fetching liked songs:', error);
//             toast.error('Failed to fetch liked songs');
//         }
//     };

//     // Handle song selection
//     const handleSelectSong = (song) => {
//         setCurrentSong(song);
//         setCurrentSongState(song);
//     };

//     if (loading) return <div className="text-white text-xl">Loading...</div>;
//     if (error) return <div className="text-white text-xl">Error: {error}</div>;

//     return (
//         <div className="flex flex-col items-center justify-start min-h-screen bg-gray-800 p-4 mt-16">
//             <ToastContainer />
//             {album ? (
//                 <>
//                     <div className="mt-8 w-full flex flex-col items-start">
//                         <h2 className="text-2xl font-semibold text-white mb-4">Songs:</h2>
//                         <div className="flex overflow-x-auto space-x-4 scrollbar-hide">
//                             {songs.length > 0 ? (
//                                 songs.map((song) => (
//                                     <Card 
//                                         key={song._id} 
//                                         song={song} 
//                                         isLiked={likedSongs.includes(song._id)} // Pass liked status based on fetched liked songs
//                                         onSelect={() => handleSelectSong(song)} 
//                                         onToggleLike={() => fetchLikedSongs()} 
//                                     />
//                                 ))
//                             ) : (
//                                 <p className="text-white text-lg">No songs available.</p>
//                             )}
//                         </div>
//                     </div>
//                     {currentSong && <MusicPlayer song={currentSong} />}
//                 </>
//             ) : (
//                 <p className="text-white text-lg">No album data available.</p>
//             )}
//         </div>
//     );
// };

// const Card = ({ song, isLiked, onSelect, onToggleLike }) => {
//     const [liked, setLiked] = useState(isLiked);

//     useEffect(() => {
//         setLiked(isLiked); // Update local liked state based on prop
//     }, [isLiked]);

//     // Define the handleLike function
//     const handleLike = async () => {
//         try {
//             const token = sessionStorage.getItem('token');
//             if (!token) {
//                 toast.error('User is not authenticated. Please log in.');
//                 return;
//             }

//             const headers = { Authorization: token };
//             const songId = { songId: song._id };
//             let response;

//             if (liked) {
//                 response = await axios.delete(
//                     'http://localhost:8080/auth/delete-like-song',
//                     { data: songId, headers }
//                 );
//                 setLiked(false);
//                 onToggleLike(true);
//             } else {
//                 response = await axios.post(
//                     'http://localhost:8080/auth/like-song',
//                     songId,
//                     { headers }
//                 );
//                 setLiked(true);
//                 onToggleLike(false);
//             }

//             if (response.data.success) {
//                 toast.success(response.data.message);
//             } else {
//                 toast.error(response.data.message || 'Unexpected response from server');
//             }

//         } catch (error) {
//             console.error('Error liking/unliking song:', error);
//             if (error.response) {
//                 toast.error(`Error: ${error.response.data?.message || 'Unexpected error occurred'}`);
//             } else {
//                 toast.error('Network error or server down.');
//             }
//         }
//     };

//     return (
//         <div onClick={onSelect} className='bg-black bg-opacity-40 w-60 px-4 py-2 rounded-lg hover:bg-opacity-50 transition duration-200 cursor-pointer'>
//             <img src={song.image} alt={song.name} className='w-full h-40 object-cover rounded-md' />
//             <div className='mt-2 flex flex-row'>
//                 <div>
//                     <h3 className='text-lg font-semibold text-white'>{song.name}</h3>
//                     <p className='text-gray-400'>{song.desc}</p>
//                     <p className='text-gray-400'>Duration: {song.duration}</p>
//                 </div>
//                 <button 
//                     onClick={(e) => { e.stopPropagation(); handleLike(); }} 
//                     className='mt-4 text-2xl' 
//                     style={{ background: 'none', border: 'none', cursor: 'pointer' }}
//                 >
//                     <span role="img" aria-label="heart" className={`transition duration-200 ${liked ? 'text-red-500' : 'text-gray-400'}`}>
//                         {liked ? '❤️' : '🤍'}
//                     </span>
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default AlbumPage;
