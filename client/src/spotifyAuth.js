// src/spotifyAuth.js
import axios from 'axios';
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
const AUTH_ENDPOINT = import.meta.env.VITE_SPOTIFY_AUTH_ENDPOINT || 'https://accounts.spotify.com/api/token';
const REDIRECT_URI =
  import.meta.env.MODE === 'development'
    ? import.meta.env.VITE_SPOTIFY_REDIRECT_URI_DEV
    : import.meta.env.VITE_SPOTIFY_REDIRECT_URI_PROD;

    // console.log(import.meta.env); 
    
// console.log(CLIENT_ID, CLIENT_SECRET, AUTH_ENDPOINT, REDIRECT_URI);

const SCOPES = [
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-library-read',
  'user-top-read',
  'user-read-private',
  'streaming',
  'user-read-currently-playing'
].join('%20');

// Function to generate authorization URL
export const getAuthUrl = () => {
  return `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=${SCOPES}`;
};

// Function to get Spotify Access Token using Client Credentials Flow
export const getSpotifyToken = async () => {
  try {
    const data = new URLSearchParams();
    data.append('grant_type', 'client_credentials');

    const response = await axios.post(AUTH_ENDPOINT, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`, 
      },
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching Spotify token:', error);
    throw new Error('Could not fetch Spotify access token');
  }
};

