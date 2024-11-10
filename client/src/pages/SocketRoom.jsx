import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

// Establish socket connection
const socket = io('http://localhost:8080', {
  transports: ['websocket', 'polling'],
  withCredentials: true,
});

const SocketRoom = ({ setCurrentSong }) => {
  const [roomId, setRoomId] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [songUrl, setSongUrl] = useState('');
  const [users, setUsers] = useState([]);
  const [musicList, setMusicList] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');
  const userId = sessionStorage.getItem('userId');

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch('http://localhost:8080/song/list');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data.songs)) {
          setMusicList(data.songs);
        } else {
          throw new Error('Data fetched for songs is not an array');
        }
      } catch (error) {
        console.error('Error fetching songs:', error);
        setError(error.message);
      }
    };

    if (userId) {
      // Join user to the room
      socket.emit('join-room', userId);

      socket.on('connect', () => {
        console.log('Connected to socket server with ID:', socket.id);
      });

      // Listen for users in room
      socket.on('userJoined', (data) => {
        setUsers(data.users);
      });

      // Listen for play status toggle
      socket.on('togglePlay', (playing) => {
        setIsPlaying(playing);
      });

      // Listen for playSong event
      socket.on('playSong', (data) => {
        console.log('Received playSong data:', data); // Check this log
        if (data && data.song) {
          setSelectedSong(data.song);
          setCurrentSong(data.song); // Update current song prop in App.jsx
          setSongUrl(data.song.url);
          setIsPlaying(true);
        } else {
          console.error('Received undefined song data in playSong event');
        }
      });
      

      fetchSongs();
    }

    return () => {
      socket.off('userJoined');
      socket.off('togglePlay');
      socket.off('playSong');
    };
  }, [userId, setCurrentSong]);

  const playSong = (song) => {
    if (roomId) {
      setSelectedSong(song);
      setCurrentSong(song);
      setSongUrl(song.file);
      console.log(song.file)
      socket.emit('playSong', { roomId, song, userId }); // Emit the song to everyone in the room
    } else {
      alert('Please create or join a room to play music.');
    }
  };

  const joinRoom = () => {
    if (roomId && userId) {
      setIsJoining(true);
      socket.emit('joinRoom', { roomId, userId }, (response) => {
        if (response && response.success) {
          console.log(`Successfully joined room ${roomId}`);
        } else {
          console.error('Failed to join room');
        }
        setIsJoining(false);
      });
    } else {
      alert('Room ID is required');
    }
  };

  const createRoom = () => {
    if (userId) {
      const newRoomId = generateRoomId();
      setRoomId(newRoomId);
      socket.emit('createRoom', { roomId: newRoomId, userId }, (response) => {
        if (response && response.success) {
          console.log(`Room created with ID: ${newRoomId}`);
        } else {
          console.error('Failed to create room');
        }
      });
    } else {
      alert('User ID is required');
    }
  };

  const togglePlay = () => {
    if (roomId) {
      const newPlayingStatus = !isPlaying;
      setIsPlaying(newPlayingStatus);
      socket.emit('togglePlay', { roomId, isPlaying: newPlayingStatus, userId });
    } else {
      alert('Please create or join a room to play music.');
    }
  };

  const generateRoomId = () => {
    return 'room-' + Math.random().toString(36).substr(2, 9);
  };

  const copyRoomId = () => {
    if (roomId) {
      const textArea = document.createElement('textarea');
      textArea.value = roomId;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Room ID copied to clipboard!');
    }
  };

  return (
    <div className="bg-[url('https://i.pinimg.com/564x/72/2e/86/722e8695d738442928238a422c72421e.jpg')] bg-cover bg-center min-h-screen">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4 text-white">Music Room</h2>

        <div className="flex items-center space-x-4">
          <button onClick={createRoom} className="bg-blue-500 text-white p-2">
            Create Room
          </button>
          {roomId && (
            <>
              <input
                type="text"
                value={roomId}
                readOnly
                className="border p-2 w-48"
                id="roomIdInput"
              />
              <button onClick={copyRoomId} className="bg-green-500 text-white p-2">
                Copy Room ID
              </button>
            </>
          )}
        </div>

        <div className="mt-4">
          <input
            type="text"
            placeholder="Enter Room ID to Join"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="border p-2 mb-2 w-48"
          />
          <button onClick={joinRoom} className="bg-blue-500 text-white p-2" disabled={isJoining}>
            {isJoining ? 'Joining...' : 'Join Room'}
          </button>
        </div>

        {roomId && (
          <div className="mt-4">
            <button onClick={togglePlay} className="bg-green-500 text-white p-2">
              {isPlaying ? 'Pause' : 'Play'}
            </button>
          </div>
        )}

        <div className="mt-4">
          <h3 className="text-lg text-white">Users in room:</h3>
          <ul className="text-white">
            {users.map((user, index) => (
              <li key={index}>{user.userId}</li>
            ))}
          </ul>
        </div>

        {error && (
          <div className="mt-4 text-red-500">
            <h3>Error: {error}</h3>
          </div>
        )}

        <div className="mt-4">
          <h3 className="text-lg text-white">Available Music:</h3>
          <ul className="text-white">
            {musicList.length > 0 ? (
              musicList.map((song, index) => (
                <li
                  key={index}
                  className="cursor-pointer hover:text-blue-500 flex justify-between items-center"
                >
                  {song.name} - {song.artist}
                  <button
                    onClick={() => playSong(song)}
                    className="bg-blue-500 text-white p-2 ml-2"
                  >
                    Play
                  </button>
                </li>
              ))
            ) : (
              <p>No music available</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SocketRoom;
