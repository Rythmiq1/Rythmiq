import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:8080'); // Define socket instance outside the component

const SocketRoom = () => {
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [users, setUsers] = useState([]);
  const [isJoining, setIsJoining] = useState(false); // Track if joining is in progress

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to socket server with ID:', socket.id);
    });

    socket.on('userJoined', (data) => {
      console.log('User joined:', data);
      setUsers(data.users); // Update the list of users in the room
    });

    socket.on('togglePlay', (playing) => {
      setIsPlaying(playing);
    });

    // Clean up event listeners on component unmount
    return () => {
      socket.off('userJoined');
      socket.off('togglePlay');
    };
  }, []);

  const joinRoom = () => {
    if (roomId && username) {
      setIsJoining(true); // Set joining state to true
      socket.emit('joinRoom', { roomId, username }, (response) => {
        if (response.success) {
          console.log(`Successfully joined room ${roomId} as ${username}`);
        } else {
          console.error('Failed to join room');
        }
        setIsJoining(false); // Reset joining state
      });
    } else {
      alert('Room ID and Username are required');
    }
  };

  const togglePlay = () => {
    const newPlayingStatus = !isPlaying;
    setIsPlaying(newPlayingStatus);
    socket.emit('togglePlay', { roomId, isPlaying: newPlayingStatus });
  };

  return (
    <div className="bg-[url('https://i.pinimg.com/564x/72/2e/86/722e8695d738442928238a422c72421e.jpg')] bg-cover bg-center min-h-screen">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4 text-white">Music Room</h2>
        
        <input
          type="text"
          placeholder="Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="border p-2 mb-2"
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 mb-2"
        />
        <button onClick={joinRoom} className="bg-blue-500 text-white p-2 mb-4" disabled={isJoining}>
          {isJoining ? 'Joining...' : 'Join Room'}
        </button>
        <button onClick={togglePlay} className="bg-green-500 text-white p-2">
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <div className="mt-4">
          <h3 className="text-lg text-white">Users in room:</h3>
          <ul className="text-white">
            {users.map((user, index) => (
              <li key={index}>{user}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SocketRoom;
