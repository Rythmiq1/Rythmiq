import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

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
  const [currentTime, setCurrentTime] = useState(0); // Track current time
  const [adminId, setAdminId] = useState(null); // Track the room admin

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
          setSongUrl(data.song.file);
          setIsPlaying(true);
        } else {
          console.error('Received undefined song data in playSong event');
        }
      });

      // Listen for time updates
      socket.on('updateTime', (data) => {
        if (data.roomId === roomId && data.userId !== userId) {
          setCurrentTime(data.newTime); // Update the time for other users
        }
      });

      fetchSongs();
    }

    return () => {
      socket.off('userJoined');
      socket.off('togglePlay');
      socket.off('playSong');
      socket.off('updateTime');
    };
  }, [userId, roomId, setCurrentSong]);

  const playSong = (song) => {
    if (roomId && userId === adminId) { // Check if current user is the admin
      setSelectedSong(song);
      setCurrentSong(song);
      setSongUrl(song.file);
      console.log(song.file)
      socket.emit('playSong', { roomId, song, userId }); // Emit the song to everyone in the room
    } else {
      alert('Only the room admin can play or change the song.');
    }
  };

  const joinRoom = () => {
    if (roomId && userId) {
      setIsJoining(true);
      socket.emit('joinRoom', { roomId, userId }, (response) => {
        if (response && response.success) {
          console.log(`Successfully joined room ${roomId}`);
          setAdminId(response.adminId); // Set the admin ID when joining
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
      setAdminId(userId); // Set the creator as the admin
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
    if (roomId && userId === adminId) { // Check if current user is the admin
      const newPlayingStatus = !isPlaying;
      setIsPlaying(newPlayingStatus);
      socket.emit('togglePlay', { roomId, isPlaying: newPlayingStatus, userId });
    } else {
      alert('Only the room admin can control playback.');
    }
  };

  const handleTimeUpdate = (newTime) => {
    setCurrentTime(newTime);
    if (roomId && userId) {
      socket.emit('updateTime', { roomId, userId, newTime }); // Emit time update to server
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
    <div className="bg-[url('https://i.pinimg.com/originals/e7/56/11/e7561144d424e4a76f087d3fb4d3a2ae.gif')] bg-cover bg-center min-h-screen">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4 text-white">Music Room</h2>
          
        <div className="flex items-center ml-[45%] space-x-4 px-10 rounded-full bg-white/30 backdrop-blur-md shadow-xl transition-all w-52 group">
  <div className="relative group flex items-center space-x-2 p-2 rounded-full transition-all hover:bg-white/20">
    <span className="text-2xl">🔒</span> 
  </div>

  <div className="relative group flex items-center space-x-2 p-2 rounded-full transition-all hover:bg-white/20">
    <span className="text-2xl">🔗</span>
  </div>

  {/* The content that will appear on hover */}
  <div className="absolute top-0 left-0 mt-0 w-full h-full flex justify-center items-center group-hover:opacity-100 opacity-0 transition-opacity duration-300">
    <div className="flex justify-center items-center space-x-8">
      {/* Outer Container with Light Transparent Background */}
      <div className="flex space-x-8 p-6 rounded-lg bg-white/30 backdrop-blur-md shadow-xl">
  
        {/* Create Room Component */}
        <div className="flex flex-col bg-gray-100/80 w-80 h-60 justify-center items-center rounded-lg shadow-lg p-4">
          <h2 className="text-black font-bold text-lg mb-4">Create Room</h2>
          <button 
            onClick={createRoom} 
            className="bg-blue-500 text-white p-2 w-48 rounded-lg hover:bg-blue-600"
          >
            Create Room
          </button>
          {roomId && (
            <>
              <input
                type="text"
                value={roomId}
                readOnly
                className="border p-2 w-48 my-4 text-center rounded-lg"
                id="roomIdInput"
              />
              <button 
                onClick={copyRoomId} 
                className="bg-green-500 text-white p-2 w-48 rounded-lg hover:bg-green-600"
              >
                Copy Room ID
              </button>
            </>
          )}
        </div>
  
        {/* Join Room Component */}
        <div className="flex flex-col bg-gray-100/80 w-80 h-60 justify-center items-center rounded-lg shadow-lg p-4">
          <h2 className="text-black font-bold text-lg mb-4">Join Room</h2>
          <input
            type="text"
            placeholder="Enter Room ID to Join"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="border p-2 w-48 mb-4 text-center rounded-lg"
          />
          <button 
            onClick={joinRoom} 
            className="bg-blue-500 text-white p-2 w-48 rounded-lg hover:bg-blue-600"
            disabled={isJoining}
          >
            {isJoining ? 'Joining...' : 'Join Room'}
          </button>
        </div>
  
      </div>
    </div>
  </div>
</div>


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

<div className="bg-white bg-opacity-20 backdrop-blur-md p-6 rounded-lg shadow-lg w-10/12 mx-auto mt-20">
  <h3 className="text-2xl font-semibold text-white mb-4">Top Playlist</h3>
  <ul className="space-y-4 w-full h-[600px] overflow-y-auto scrollbar-hide">
    {musicList.length > 0 ? (
      musicList.map((song, index) => (
        <li
          key={index}
          className="flex items-center justify-between bg-white bg-opacity-60 rounded-md p-4 hover:bg-opacity-80 transition duration-300"
        >
          <div className="flex items-center space-x-4">
            <div>
              <p className="text-lg font-medium text-gray-900">{song.name}</p>
              <p className="text-sm text-gray-600">{song.artist}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{song.duration}</span>
            {userId === adminId && (
              <button
                onClick={() => playSong(song)}
                className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
              >
                ▶
              </button>
            )}
           
          </div>
        </li>
      ))
    ) : (
      <p className="text-gray-600">No music available</p>
    )}
  </ul>

  {selectedSong && (
    <div className="mt-6">
      <input
        type="range"
        value={currentTime}
        max={selectedSong.duration || 100}
        onChange={(e) => handleTimeUpdate(Number(e.target.value))}
        className="w-full mt-2 appearance-none bg-gray-300 rounded-lg h-2"
      />
    </div>
  )}
</div>
</div>
    </div>
  );
};

export default SocketRoom;