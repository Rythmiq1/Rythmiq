import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const AlbumPage = () => {
    const { id } = useParams(); // Get the album ID from the URL
    const [album, setAlbum] = useState(null);
    const [songs, setSongs] = useState([]); // To store songs data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAlbum = async () => {
            try {
                const response = await fetch(`http://localhost:8080/album/${id}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json(); // Parse the response
                
                if (data.album && Array.isArray(data.songs)) {
                    setAlbum(data.album); // Set the album data
                    setSongs(data.songs); // Set the songs data
                } else {
                    throw new Error("Album or songs not found");
                }
            } catch (error) {
                console.error("Error fetching album:", error);
                setError(error.message); // Set the error message
            } finally {
                setLoading(false); // Set loading to false when done
            }
        };

        fetchAlbum();
    }, [id]);

    // Conditional rendering for loading and error states
    if (loading) return <div className="text-white text-xl">Loading...</div>;
    if (error) return <div className="text-white text-xl">Error: {error}</div>;

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-gray-800 p-4 mt-16">
            {album ? (
                <>
                    <div className="mt-8 w-full flex flex-col items-start">
                        <h2 className="text-2xl font-semibold text-white mb-4">Songs:</h2>
                        <div className="flex overflow-x-auto space-x-4 scrollbar-hide">
                            {songs.length > 0 ? (
                                songs.map((song) => (
                                    <Card 
                                        key={song._id} // Unique key for each song
                                        name={song.name} // Song title
                                        desc={song.desc} // Song description
                                        image={song.image} // Song image
                                        file={song.file} // Audio file URL
                                        duration={song.duration} // Duration
                                    />
                                ))
                            ) : (
                                <p className="text-white text-lg">No songs available.</p>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <p className="text-white text-lg">No album data available.</p>
            )}
        </div>
    );
};

// Card component to display song details
const Card = ({ name, desc, image, file, duration }) => {
    return (
        <div className='bg-black bg-opacity-40 w-60 px-4 py-2 rounded-lg hover:bg-opacity-50 transition duration-200 scrollbar-hide'>
            <img src={image} alt={name} className='w-full h-40 object-cover rounded-md' />
            <div className='mt-2'>
                <h3 className='text-lg font-semibold text-white'>{name}</h3>
                <p className='text-gray-400'>{desc}</p>
                <p className='text-gray-400'>Duration: {duration}</p>
                <audio controls className='mt-2'>
                    <source src={file} type="audio/mp3" />
                    Your browser does not support the audio element.
                </audio>
            </div>
        </div>
    );
};

export default AlbumPage;
