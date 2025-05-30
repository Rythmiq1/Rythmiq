import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BASE_URL from "../config"; 
const InterestSelector = ({ userId }) => {
    const [selectedArtists, setSelectedArtists] = useState([]); 
    const [artists, setArtists] = useState([]);  // State to store artists
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [shuffledArtists, setShuffledArtists] = useState([]); // Store shuffled artists
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);

        const token = urlParams.get('token');
        const userId = urlParams.get('userId');
        const name = urlParams.get('name');

        // Set items in sessionStorage only if the parameters exist in the URL
        if (token) {
            sessionStorage.setItem('token', token);
        }
        if (userId) {
            sessionStorage.setItem('userId', userId);
        }
        if (name) {
            sessionStorage.setItem('name', name);
        }

        console.log('Session storage set:', { token, userId, name });
    }, []);

    // Fetch artists when the component mounts
    useEffect(() => {
        const fetchArtists = async () => {
            const token = sessionStorage.getItem('token');
            if (!token) {
                setErrorMessage('No token found.');
                return;
            }

            try {
                const response = await fetch(`${BASE_URL}/artist/artists`, {
                    method: 'GET',
                    headers: {
                        'Authorization': token,  // Send token in the header
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Error fetching artists');
                }

                console.log('Fetched artists:', data); // Log the data for debugging
                setArtists(data.data);  // Set the artists into the state
            } catch (error) {
                console.error('Error fetching artists:', error.message);
                setErrorMessage('An error occurred while fetching artists.');
            }
        };

        fetchArtists();
    }, []);

    useEffect(() => {
        // Shuffle artists only after fetching
        if (artists.length > 0) {
            const shuffled = shuffleArray(artists);
            setShuffledArtists(shuffled.slice(0, 10));  // Get random selection of 10
        }
    }, [artists]);  // Trigger this effect when artists are fetched

    const handleArtistClick = (artist) => {
        setSelectedArtists((prev) =>
            prev.includes(artist) ? prev.filter((a) => a !== artist) : [...prev, artist]
        );
    };

    const handleSubmit = async () => {
        const token = sessionStorage.getItem('token') || urlParams.get('token');  // Get the token from session storage
        if (!token) {
            console.error('Token not found in session storage');
            return;  // Exit if no token is found
        }

        // Ensure the user selects at least 3 artists
        if (selectedArtists.length < 3) {
            setErrorMessage('Please select at least 3 artists.');
            return;
        }

        setLoading(true);  // Set loading state to true while submitting

        const requestBody = { artistIds: selectedArtists };  // Prepare the request body

        try {
            const response = await fetch(`${BASE_URL}/auth/select-interest`, {
                method: 'POST',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            // If response is not OK, handle the error
            if (!response.ok) {
                const errorData = await response.text();
                console.error('Error response:', errorData);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();  // Parse the response JSON
            console.log('Success:', data);
            navigate('/home');  // Navigate to home page upon success
        } catch (error) {
            console.error('Error updating interests:', error.message);
            setErrorMessage('An error occurred while submitting your interests.');  // Set error message if any error occurs
        } finally {
            setLoading(false);  // Set loading state back to false after completion
        }
    };

    // Shuffle the artists array
    const shuffleArray = (array) => {
        const shuffledArray = [...array];
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
        }
        return shuffledArray;
    };

    if (!userId) {
        return (
            <div>
                <h1>Select Artists</h1>
                <p>{errorMessage}</p>
                <p>Please log in to select artists.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-8 rounded-lg shadow-lg bg-white">
            <h1 className="text-center text-2xl font-semibold mb-4">Select Artists</h1>
            {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
            <div className="flex flex-wrap gap-8 justify-center bg-white">
                {shuffledArtists.length === 0 ? (
                    <p className="text-center">Loading artists...</p>
                ) : (
                    shuffledArtists.map((artist) => (
                        <div 
                            key={artist._id}  // Assuming artist has a unique _id
                            onClick={() => handleArtistClick(artist._id)}  // Using artist's _id as the identifier
                            className={`cursor-pointer text-center w-32 p-1 rounded-full bg-white border-4 overflow-hidden
                                ${selectedArtists.includes(artist._id) ? 'border-green-500' : 'border-white'}`}
                        >
                            <img
                                src={artist.image}  // Assuming artist has an image field
                                alt={artist.name}
                                className="w-28 h-28 rounded-full border-4 border-white mb-2"
                            />
                            <p className="text-sm truncate font-medium">{artist.name}</p>
                            <p className="text-xs text-gray-500">Artist</p>
                        </div>
                    ))
                )}
            </div>
            <button 
                onClick={handleSubmit} 
                className={`mt-6 block mx-auto px-4 py-2 rounded-lg transition 
                    ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                disabled={loading}
            >
                {loading ? 'Submitting...' : 'Submit Artists'}
            </button>
        </div>
    );
};

export default InterestSelector;
