// src/spotifyAuth.js
import axios from 'axios';
const CLIENT_ID = '10e99669687e4b34a11eb058743ef1fe';
const CLIENT_SECRET = 'fbc74cdef53948e19b0c3061184bd622';
export const getSpotifyToken = async () => {
    try {

        const data = new URLSearchParams();
        data.append('grant_type', 'client_credentials');

        const response = await axios.post('https://accounts.spotify.com/api/token', data, {
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
