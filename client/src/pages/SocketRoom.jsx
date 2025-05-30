import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { FaMusic, FaPlay } from 'react-icons/fa';
import BASE_URL from "../config";

const socket = io(BASE_URL, {
  transports: ['websocket', 'polling'],
  withCredentials: true,
});

const SocketRoom = ({ setCurrentSong }) => {
  // —— refs & state —— 
  const audioRef = useRef(null);
  const [roomId, setRoomId] = useState('');
  const [users, setUsers] = useState([]);
  const [musicList, setMusicList] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [adminId, setAdminId] = useState(null);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');
  const [showRoomPanel, setShowRoomPanel] = useState(false);
  const [showMusicPanel, setShowMusicPanel] = useState(false);

  const userId = sessionStorage.getItem('userId') || '';


  useEffect(() => {
    if (!userId) return;

    
    fetch(`${BASE_URL}/song/list`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data.songs)) setMusicList(data.songs);
      })
      .catch(e => setError(e.message));

    socket.on('connect', () =>
      console.log('Socket connected:', socket.id)
    );

    socket.on('userJoined', data => setUsers(data.users));

    socket.on('playSong', ({ song, roomId: rid }) => {
      if (song) {
        setSelectedSong(song);
        setCurrentSong(song);
        setIsPlaying(true);
      }
    });

    // **time sync**  
    socket.on('updateTime', ({ roomId: rid, newTime }) => {
      if (rid === roomId) {
        setCurrentTime(newTime);
        if (audioRef.current) {
          audioRef.current.currentTime = newTime;
        }
      }
    });

    return () => {
      socket.off('userJoined');
      socket.off('playSong');
      socket.off('updateTime');
    };
  }, [userId, roomId, setCurrentSong]);

  const generateRoomId = () =>
    'room-' + Math.random().toString(36).substr(2, 9);

  const createRoom = () => {
    if (!userId) return alert('Login first');
    const rid = generateRoomId();
    setRoomId(rid);
    setAdminId(userId);
    socket.emit('createRoom', { roomId: rid, userId }, resp => {
      if (!resp.success) setError('Create room failed');
    });
  };

  const joinRoom = () => {
    if (!roomId) return alert('Room ID required');
    setIsJoining(true);
    socket.emit('joinRoom', { roomId, userId }, resp => {
      setIsJoining(false);
      if (resp.success) setAdminId(resp.adminId);
      else setError('Join failed');
    });
  };

  const playSong = song => {
    if (userId !== adminId) return alert('Only admin can play');
    setSelectedSong(song);
    setCurrentSong(song);
    setIsPlaying(true);
    socket.emit('playSong', { roomId, song, userId });
  };

  const handleTimeUpdate = newTime => {
  setCurrentTime(newTime);
  if (audioRef.current) audioRef.current.currentTime = newTime;

  socket.emit('updateTime', {
    roomId,
    userId,     
    newTime
  });
};



  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/originals/e7/56/11/e7561144d424e4a76f087d3fb4d3a2ae.gif')"
      }}
    >
      <div className="container mx-auto px-4 py-6">
        {/* 1) AUDIO ELEMENT */}
        <audio
          ref={audioRef}
          src={selectedSong?.file}
          autoPlay={isPlaying}
          onTimeUpdate={e => {
            const t = e.target.currentTime;
            setCurrentTime(t);
          }}
          className="hidden"
        />

        <h1 className="text-4xl font-extrabold text-white text-center drop-shadow-lg mb-8">
          Music Room
        </h1>

        {/* 2) TOGGLE BUTTONS */}
        <div className="flex justify-center space-x-6 mb-8">
          <button
            onClick={() => {
              setShowRoomPanel(v => !v);
              setShowMusicPanel(false);
            }}
            className="px-6 py-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-2xl transform hover:scale-105 transition"
          >
            {showRoomPanel ? 'Hide Room' : 'Show Room'}
          </button>
          <button
            onClick={() => {
              setShowMusicPanel(v => !v);
              setShowRoomPanel(false);
            }}
            className="px-6 py-3 bg-gradient-to-br from-green-400 to-teal-600 rounded-full shadow-2xl transform hover:scale-105 transition"
          >
            {showMusicPanel ? 'Hide Music' : 'Show Music'}
          </button>
        </div>

        {/* 3) ROOM PANEL */}
        {showRoomPanel && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Create Room */}
            <div className="bg-white bg-opacity-20 backdrop-blur-xl rounded-2xl p-6 shadow-2xl flex flex-col items-center">
              <h2 className="text-white text-xl font-semibold mb-4">
                Create Room
              </h2>
              <button
                onClick={createRoom}
                className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition"
              >
                Create
              </button>
              {roomId && (
                <>
                  <input
                    readOnly
                    value={roomId}
                    className="mt-4 w-full p-2 bg-white bg-opacity-80 rounded-md text-center text-gray-800"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(roomId);
                      alert('Copied!');
                    }}
                    className="mt-2 w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
                  >
                    Copy ID
                  </button>
                </>
              )}
            </div>

            {/* Join Room */}
            <div className="bg-white bg-opacity-20 backdrop-blur-xl rounded-2xl p-6 shadow-2xl flex flex-col items-center">
              <h2 className="text-white text-xl font-semibold mb-4">
                Join Room
              </h2>
              <input
                type="text"
                placeholder="Room ID"
                value={roomId}
                onChange={e => setRoomId(e.target.value)}
                className="w-full p-2 bg-white bg-opacity-80 rounded-md text-gray-800 mb-4"
              />
              <button
                onClick={joinRoom}
                disabled={isJoining}
                className="w-full py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition disabled:opacity-50"
              >
                {isJoining ? 'Joining…' : 'Join'}
              </button>
            </div>

            {/* Users */}
            <div className="bg-white bg-opacity-20 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">
              <h2 className="text-white text-xl font-semibold mb-4 text-center">
                Users
              </h2>
              <ul className="divide-y divide-white/50">
                {users.length ? (
                  users.map((u, i) => (
                    <li
                      key={i}
                      className="py-2 text-center text-white font-medium"
                    >
                      {u.userId}
                    </li>
                  ))
                ) : (
                  <li className="py-2 text-center text-white/70">
                    No users
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}

        {error && (
          <div className="max-w-lg mx-auto bg-red-600 bg-opacity-80 text-white p-4 rounded-lg text-center mb-8">
            {error}
          </div>
        )}

        {/* 4) MUSIC PANEL */}
        {showMusicPanel && (
          <div className="max-w-3xl mx-auto bg-white bg-opacity-20 backdrop-blur-xl rounded-2xl p-6 shadow-2xl mb-8">
            <h2 className="text-white text-2xl font-bold mb-6 text-center">
              Top Playlist
            </h2>
            <ul className="space-y-4 max-h-80 overflow-y-auto scrollbar-hide">
              {musicList.length ? (
                musicList.map((song, i) => (
                  <li
                    key={i}
                    className="flex justify-between items-center bg-white bg-opacity-30 rounded-xl p-4 hover:bg-opacity-50 transition"
                  >
                    <div>
                      <p className="text-lg font-semibold text-white">
                        {song.name}
                      </p>
                      <p className="text-sm text-white/80">
                        {song.artist}
                      </p>
                    </div>
                    {userId === adminId && (
                      <FaPlay
                        onClick={() => playSong(song)}
                        className="text-2xl text-white hover:text-teal-300 transition cursor-pointer"
                      />
                    )}
                  </li>
                ))
              ) : (
                <p className="text-center text-white/70">No music found</p>
              )}
            </ul>

            {selectedSong && (
              <div className="mt-6">
                <input
                  type="range"
                  value={currentTime}
                  max={selectedSong.duration || 100}
                  onChange={e => handleTimeUpdate(+e.target.value)}
                  className="w-full h-2 rounded-lg appearance-none bg-white bg-opacity-50"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SocketRoom;
