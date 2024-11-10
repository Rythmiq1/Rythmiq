import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import defaultImg from '../assets/images/Rhythmiq.png';
import MusicPlayer from './MusicPlayer';

const LibraryPage = () => {
    const [playlists, setPlaylists] = useState([]); // My Playlists state
    const [likedSongs, setLikedSongs] = useState([]); // Liked Songs state
    const [savedPlaylists, setSavedPlaylists] = useState([]); // Saved Playlists state
    const [currentSong, setCurrentSong] = useState(null); // Currently playing song
    const [showShareModal, setShowShareModal] = useState(false); // Modal visibility
    const [shareUrl, setShareUrl] = useState(''); // Shared URL
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error handling
    const navigate = useNavigate(); // React Router's navigate
    const userId = sessionStorage.getItem('userId'); // Get userId from session storage

    // Combined useEffect to fetch all data (playlists, liked songs, saved playlists)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = sessionStorage.getItem('token');
                
                // Fetch playlists
                const playlistsResponse = await axios.get('http://localhost:8080/playlist/my-playlists', {
                    headers: { Authorization: token },
                });
                if (playlistsResponse.data.success) {
                    setPlaylists(playlistsResponse.data.playlists);
                } else {
                    throw new Error("Could not fetch playlists");
                }

                // Fetch liked songs
                const likedSongsResponse = await axios.get('http://localhost:8080/auth/get-liked', {
                    headers: { Authorization: token },
                });
                if (likedSongsResponse.data.success) {
                    setLikedSongs(likedSongsResponse.data.data);
                }

                // Fetch saved playlists
                const savedPlaylistsResponse = await axios.get('http://localhost:8080/auth/saved-playlists', {
                    headers: { Authorization: token },
                });
                if (savedPlaylistsResponse.data.success) {
                    setSavedPlaylists(savedPlaylistsResponse.data.savedPlaylists);
                } else {
                    throw new Error("Could not fetch saved playlists");
                }
                
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchData();
        } else {
            setError("User not found or logged in.");
            setLoading(false);
        }
    }, [userId]);

    // Handle song selection
    const handleSelectSong = (song) => {
        setCurrentSong(song);
    };

    // Handle like toggle for songs
    const handleLikeToggle = async (songId) => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            toast.error('User is not authenticated. Please log in.');
            return;
        }

        const headers = { Authorization: token };
        const songIdObj = { songId };

        try {
            let response;
            if (likedSongs.some((song) => song._id === songId)) {
                response = await axios.delete('http://localhost:8080/auth/delete-like-song', {
                    data: songIdObj,
                    headers,
                });
                if (response.data.success) {
                    setLikedSongs(likedSongs.filter(song => song._id !== songId));
                    toast.success('Song unliked!');
                }
            } else {
                response = await axios.post('http://localhost:8080/auth/like-song', songIdObj, { headers });
                if (response.data.success) {
                    setLikedSongs([...likedSongs, { _id: songId }]);
                    toast.success('Song liked!');
                }
            }
        } catch (error) {
            console.error('Error liking/unliking song:', error);
            toast.error('Failed to update like status');
        }
    };

    const handlePlaylistClick = (playlistId) => {
        navigate(`/playlist/${playlistId}`);
    };
    

    const handleShareClick = (playlistId) => {
        const generatedUrl = `${window.location.origin}/playlist-shared/${playlistId}`;
        setShareUrl(generatedUrl);
        setShowShareModal(true);
    };
    

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
    };

    // Handle close share modal
    const closeModal = () => {
        setShowShareModal(false);
    };

    // Loading state
    if (loading) return <div className="text-white text-xl">Loading...</div>;

    return (
        <div className="flex flex-col justify-start min-h-screen bg-gradient-to-b from-[#006161] to-black p-4 mt-16 mb-20">
            <ToastContainer />
            <h2 className="text-2xl font-semibold text-white mb-4">Your Playlists:</h2>
            <div className="flex overflow-x-auto space-x-4 scrollbar-hide">
                {playlists?.map((playlist) => (
                    <div
                        key={playlist._id}
                        className="bg-black bg-opacity-40 w-60 px-4 py-2 rounded-lg hover:bg-opacity-50 transition duration-200 cursor-pointer relative"
                    >
                        <img src={playlist.image || defaultImg} alt={playlist.name} className="w-full h-40 object-cover rounded-md"
                            onClick={() => handlePlaylistClick(playlist._id)} />
                        <h3 className="text-lg font-semibold text-white mt-2">{playlist.name}</h3>
                        <p className="text-gray-400">{playlist.description}</p>
                        <button
                            className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-2"
                            onClick={() => handleShareClick(playlist._id)}
                        >
                            Share
                        </button>
                    </div>
                )) || <p>No playlists available</p>}
            </div>

            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Liked Songs:</h2>
            <div className="flex overflow-x-auto space-x-4 scrollbar-hide">
                {likedSongs.map((song) => (
                    <Card
                        key={song._id}
                        song={song}
                        isLiked={likedSongs.some((s) => s._id === song._id)}
                        onSelect={() => handleSelectSong(song)}
                        onToggleLike={handleLikeToggle}
                    />
                ))}
            </div>

            {currentSong && <MusicPlayer song={currentSong} />}

            {/* Share Modal */}
            {showShareModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg max-w-sm w-full text-center">
                        <h2 className="text-xl font-semibold mb-4">Share this Playlist</h2>
                        <p className="mb-4">{shareUrl}</p>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-full mb-4"
                            onClick={handleCopyLink}
                        >
                            Copy Link
                        </button>
                        <button
                            className="bg-gray-500 text-white px-4 py-2 rounded-full"
                            onClick={closeModal}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <div className=" text-blue-50 mt-8">
                <h2 className='text-white font-bold'>Your Saved Playlists</h2>
                {savedPlaylists?.length === 0 ? (
                    <p>No playlists saved.</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 cursor-pointer">
                        {savedPlaylists.map((playlist) => (
                            <div key={playlist._id} className="flex flex-col items-center">
                                <img
                                    src={playlist.image || defaultImg}
                                    alt={playlist.name}
                                    className="w-48 h-48 object-cover rounded-md mb-2"
                                />
                                <p className="text-center text-white">{playlist.name}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};


const Card = ({ song, isLiked, onSelect, onToggleLike }) => {
    return (
        <div 
            className="bg-black bg-opacity-40 w-60 px-4 py-2 rounded-lg"
            onClick={onSelect}
        >
            <img
                src={song.image || defaultImg}
                alt={song.name}
                className="w-full h-40 object-cover rounded-md"
            />
            <h3 className="text-lg font-semibold text-white mt-2">{song.name}</h3>
            <p className="text-gray-400">{song.artist}</p>
            <button 
                onClick={(e) => { e.stopPropagation(); onToggleLike(song._id); }} 
                className="text-2xl mt-1" 
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
                <span role="img" aria-label="heart" className={`transition duration-200 ${isLiked ? 'text-red-500' : 'text-gray-400'}`}>
                    {isLiked ? '❤️' : '🤍'}
                </span>

            </button>
        </div>
    );
};

export default LibraryPage;



// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import axios from 'axios';
// import defaultImg from '../assets/images/Rhythmiq.png';
// import MusicPlayer from './MusicPlayer';

// const LibraryPage = () => {
//     const [myPlaylists, setMyPlaylists] = useState([]); // My Playlists state
//     const [savedPlaylists, setSavedPlaylists] = useState([]); // Saved Playlists state
//     const [likedSongs, setLikedSongs] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [currentSong, setCurrentSong] = useState(null); 
//     const navigate = useNavigate();
//     const [error, setError] = useState(null);

//     const userId = sessionStorage.getItem('userId'); // Get user ID from session

//     // Fetch My Playlists
//     useEffect(() => {
//         const fetchPlaylists = async () => {
//             try {
//                 const token = sessionStorage.getItem('token');
//                 const response = await axios.get('http://localhost:8080/playlist/my-playlists', {
//                     headers: { Authorization: token },
//                 });
//                 console.log('My Playlists Response:', response.data);
//                 if (response.data.success) {
//                     setMyPlaylists(response.data.playlists);
//                 } else {
//                     throw new Error("Could not fetch playlists");
//                 }
//             } catch (error) {
//                 console.error("Error fetching my playlists:", error);
//                 setError('Failed to load playlists');
//             }
//         };
//         fetchPlaylists();
//     }, []);

//     // Fetch Saved Playlists from userId
//     useEffect(() => {
//         if (userId) {
//             const fetchSavedPlaylists = async () => {
//                 try {
//                     const token = sessionStorage.getItem('token');
//                     const response = await axios.get(`http://localhost:8080/user/${userId}/savedPlaylists`, {
//                         headers: { Authorization: token },
//                     });
//                     console.log('Saved Playlists Response:', response.data); // Log the response to inspect the data
//                     if (response.data.success) {
//                         setSavedPlaylists(response.data.playlists);  // Save the playlists returned from API
//                     } else {
//                         throw new Error("Could not fetch saved playlists");
//                     }
//                 } catch (error) {
//                     console.error("Error fetching saved playlists:", error);
//                     setError('Failed to load saved playlists');
//                 } finally {
//                     setLoading(false);
//                 }
//             };
//             fetchSavedPlaylists();
//         } else {
//             setError("User not found or logged in.");
//             setLoading(false);
//         }
//     }, [userId]);

//     // Fetch Liked Songs
//     const fetchLikedSongs = async () => {
//         try {
//             const token = sessionStorage.getItem('token');
//             const response = await axios.get('http://localhost:8080/auth/get-liked', {
//                 headers: { Authorization: token },
//             });
//             if (response.data.success) {
//                 setLikedSongs(response.data.data);
//             }
//         } catch (error) {
//             console.error('Error fetching liked songs:', error);
//             toast.error('Please Login');
//         }
//     };

//     useEffect(() => {
//         fetchLikedSongs();
//     }, []);  // Fetch liked songs only once on component mount

//     // Handle song selection
//     const handleSelectSong = (song) => {
//         setCurrentSong(song);
//     };

//     // Handle like toggle
//     const handleLikeToggle = async (songId) => {
//         const token = sessionStorage.getItem('token');
//         if (!token) {
//             toast.error('User is not authenticated. Please log in.');
//             return;
//         }

//         const headers = { Authorization: token };
//         const songIdObj = { songId };

//         try {
//             let response;
//             if (likedSongs.some((song) => song._id === songId)) {
//                 response = await axios.delete('http://localhost:8080/auth/delete-like-song', {
//                     data: songIdObj,
//                     headers,
//                 });
//                 if (response.data.success) {
//                     setLikedSongs(likedSongs.filter(song => song._id !== songId));
//                     toast.success('Song unliked!');
//                 }
//             } else {
//                 response = await axios.post('http://localhost:8080/auth/like-song', songIdObj, { headers });
//                 if (response.data.success) {
//                     setLikedSongs([...likedSongs, { _id: songId }]);
//                     toast.success('Song liked!');
//                 }
//             }
//         } catch (error) {
//             console.error('Error liking/unliking song:', error);
//             toast.error('Failed to update like status');
//         }
//     };

//     const handlePlaylistClick = (playlistId) => {
//         navigate(`/playlist/${playlistId}`);
//     };

//     // Handle share modal
//     const handleShareClick = (playlistId) => {
//         const generatedUrl = `${window.location.origin}/playlist-shared/${playlistId}`;
//         setShareUrl(generatedUrl);
//         setShowShareModal(true);
//     };

//     const handleCopyLink = () => {
//         navigator.clipboard.writeText(shareUrl);
//         toast.success("Link copied to clipboard!");
//     };

//     const closeModal = () => {
//         setShowShareModal(false);
//     };

//     if (loading) return <div className="text-white text-xl">Loading...</div>;

//     return (
//         <div className="flex flex-col justify-start min-h-screen bg-gradient-to-b from-[#006161] to-black p-4 mt-16">
//             <ToastContainer />
//             <h2 className="text-2xl font-semibold text-white mb-4">Your Playlists:</h2>
//             <div className="flex overflow-x-auto space-x-4 scrollbar-hide">
//                 {myPlaylists.map((playlist) => (
//                     <div
//                         key={playlist._id}
//                         className="bg-black bg-opacity-40 w-60 px-4 py-2 rounded-lg hover:bg-opacity-50 transition duration-200 cursor-pointer relative"
//                     >
//                         <img src={playlist.image || defaultImg} alt={playlist.name} className="w-full h-40 object-cover rounded-md"
//                             onClick={() => handlePlaylistClick(playlist._id)} />
//                         <h3 className="text-lg font-semibold text-white mt-2">{playlist.name}</h3>
//                         <p className="text-gray-400">{playlist.description}</p>
//                         <button
//                             className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-2"
//                             onClick={() => handleShareClick(playlist._id)}
//                         >
//                             Share
//                         </button>
//                     </div>
//                 ))}
//             </div>

//             <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Liked Songs:</h2>
//             <div className="flex overflow-x-auto space-x-4 scrollbar-hide">
//                 {likedSongs.map((song) => (
//                     <Card 
//                         key={song._id} 
//                         song={song} 
//                         isLiked={likedSongs.some((s) => s._id === song._id)} 
//                         onSelect={() => handleSelectSong(song)} 
//                         onToggleLike={handleLikeToggle} 
//                     />
//                 ))}
//             </div>

//             <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Saved Playlists:</h2>
//             <div className="flex overflow-x-auto space-x-4 scrollbar-hide">
//                 {savedPlaylists.map((playlist) => (
//                     <div key={playlist._id} className="flex flex-col items-center">
//                         <img
//                             src={playlist.image || defaultImg}
//                             alt={playlist.name}
//                             className="w-32 h-32 object-cover rounded-md mb-2"
//                         />
//                         <p className="text-center">{playlist.name}</p>
//                     </div>
//                 ))}
//             </div>

//             {currentSong && <MusicPlayer song={currentSong} />}

//             {/* Share Modal */}
//          {showShareModal && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//                     <div className="bg-white p-6 rounded-lg max-w-sm w-full text-center">
//                         <h2 className="text-xl font-semibold mb-4">Share this Playlist</h2>
//                         <p className="mb-4">{shareUrl}</p>
//                         <button 
//                             className="bg-blue-500 text-white px-4 py-2 rounded-full mb-4"
//                             onClick={handleCopyLink}
//                         >
//                             Copy Link
//                         </button>
//                         <button 
//                             className="bg-gray-500 text-white px-4 py-2 rounded-full"
//                             onClick={closeModal}
//                         >
//                             Close
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default LibraryPage;
