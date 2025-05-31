import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BASE_URL from "../config";

const InterestSelector = ({ userId }) => {
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [artists, setArtists] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [shuffledArtists, setShuffledArtists] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const uid = urlParams.get('userId');
    const name = urlParams.get('name');

    if (token) {
      sessionStorage.setItem('token', token);
    }
    if (uid) {
      sessionStorage.setItem('userId', uid);
    }
    if (name) {
      sessionStorage.setItem('name', name);
    }

    console.log('SessionStorage after URL parse:', {
      token: sessionStorage.getItem('token'),
      userId: sessionStorage.getItem('userId'),
      name: sessionStorage.getItem('name'),
    });
  }, []);

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
            Authorization: token,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Error fetching artists');
        }

        console.log('Fetched artists:', data.data);
        setArtists(data.data || []);
      } catch (error) {
        console.error('Error fetching artists:', error);
        setErrorMessage('An error occurred while fetching artists.');
      }
    };

    fetchArtists();
  }, []);

  useEffect(() => {
    if (artists.length > 0) {
      const shuffled = shuffleArray(artists);
      setShuffledArtists(shuffled.slice(0, 10));
    }
  }, [artists]);


  const handleArtistClick = (artistId) => {
    setSelectedArtists((prev) =>
      prev.includes(artistId)
        ? prev.filter((id) => id !== artistId)
        : [...prev, artistId]
    );
  };


  const handleSubmit = async () => {
    const token = sessionStorage.getItem('token');
    const storedUserId = sessionStorage.getItem('userId');

    if (!token) {
      console.error('Token not found in sessionStorage');
      setErrorMessage('Authentication error. Please log in again.');
      return;
    }

    if (!storedUserId) {
      setErrorMessage('User ID missing. Please log in again.');
      return;
    }

    if (selectedArtists.length < 3) {
      setErrorMessage('Please select at least 3 artists.');
      return;
    }

    setLoading(true);

    try {
      const requestBody = { artistIds: selectedArtists };
      const response = await fetch(`${BASE_URL}/auth/select-interest`, {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error(`Error response (status ${response.status}):`, text);
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('Interests saved:', result);
      navigate('/home');
    } catch (error) {
      console.error('Error updating interests:', error);
      setErrorMessage('An error occurred while submitting your interests.');
    } finally {
      setLoading(false);
    }
  };

 
  const shuffleArray = (arr) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  if (!userId) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 scrollbar-hide overflow-auto">
        <h1 className="text-center text-2xl sm:text-3xl font-semibold mb-4">
          Select Artists
        </h1>
        {errorMessage && (
          <p className="text-red-500 text-center mb-2">{errorMessage}</p>
        )}
        <p className="text-center">Please log in to select artists.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 ">
      <h1 className="text-center text-2xl sm:text-3xl font-semibold mb-6">
        Select Artists
      </h1>

      {errorMessage && (
        <p className="text-red-500 text-center mb-4">{errorMessage}</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-items-center">
        {shuffledArtists.length === 0 ? (
          <p className="text-center col-span-full">Loading artists...</p>
        ) : (
          shuffledArtists.map((artist) => (
            <div
              key={artist._id}
              onClick={() => handleArtistClick(artist._id)}
              className={`
                cursor-pointer
                text-center
                w-full max-w-[120px]
                p-1
                rounded-full
                bg-white
                border-4
                scrollbar-hide overflow-auto
                ${
                  selectedArtists.includes(artist._id)
                    ? 'border-green-500'
                    : 'border-gray-200'
                }
              `}
            >
              <img
                src={artist.image}
                alt={artist.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white mb-2 mx-auto object-cover"
              />
              <p className="text-xs sm:text-sm truncate font-medium">
                {artist.name}
              </p>
              <p className="text-[10px] sm:text-xs text-gray-500">Artist</p>
            </div>
          ))
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`
          mt-8
          block
          mx-auto
          px-6 py-2
          rounded-lg
          text-base font-semibold
          transition
          ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}
          text-white
        `}
      >
        {loading ? 'Submitting...' : 'Submit Artists'}
      </button>
    </div>
  );
};

export default InterestSelector;
