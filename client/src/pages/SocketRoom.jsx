import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import {
  FaLock,
  FaLink,
  FaMusic,
  FaUser,
  FaPause,
  FaPlay,
  FaExpand
} from 'react-icons/fa';
import BASE_URL from '../config';

const socket = io(BASE_URL, {
  transports: ['websocket', 'polling'],
  withCredentials: true,
});

const SocketRoom = () => {
  const [roomId, setRoomId] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [adminId, setAdminId] = useState(null);
  const [users, setUsers] = useState([]);
  const [musicList, setMusicList] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState('');
  const [showRoomPanel, setShowRoomPanel] = useState(false);
  const [showMusicPanel, setShowMusicPanel] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
const [chatInput, setChatInput] = useState('');
  const [showChatPanel, setShowChatPanel] = useState(false);

  const userId = localStorage.getItem('userId');
  const audioRef = useRef();

  
  const handlePlayClick = song => {

    setSelectedSong(song);
    setCurrentTime(0);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = song.file;
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
   
    socket.emit('playSong', {
      roomId,
      song,
      userId,
      newTime: 0
    });
  };

 
  const handlePlay = () => {
    if (userId !== adminId || !selectedSong) return;
    const time = audioRef.current?.currentTime || 0;
    socket.emit('playSong', {
      roomId,
      song: selectedSong,
      userId,
      newTime: time
    });
  };

  const handlePause = () => {
    if (userId !== adminId || !selectedSong) return;
    const ts = audioRef.current.currentTime;
   
    setIsPlaying(false);
    audioRef.current.pause();
   
    socket.emit('pauseSong', { roomId, userId, currentTime: ts });
  };

  const handleTimeUpdate = val => {
    setCurrentTime(val);
    if (userId === adminId) {
      socket.emit('updateTime', { roomId, userId, newTime: val });
      if (audioRef.current) audioRef.current.currentTime = val;
    }
  };

  const selectSong = song => {
    setSelectedSong(song);
    setCurrentTime(0);
    setIsPlaying(false);
  };

useEffect(() => {
  if (!userId) return;

  socket.emit('join-room', userId);

  fetch(`${BASE_URL}/song/list`)
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data.songs)) setMusicList(data.songs);
    })
    .catch(err => setError(err.message));

  socket.on('userJoined', ({ users }) => setUsers(users));

  socket.on('playSong', ({ song, newTime }) => {
    setSelectedSong(song);
    setIsPlaying(true);
    setCurrentTime(newTime || 0);
    if (audioRef.current) {
      audioRef.current.src = song.file;
      audioRef.current.currentTime = newTime || 0;
      audioRef.current.play();
    }
  });

  socket.on('pauseSong', ({ currentTime: ts }) => {
    setIsPlaying(false);
    setCurrentTime(ts);
    if (audioRef.current) {
      audioRef.current.currentTime = ts;
      audioRef.current.pause();
    }
  });

  socket.on('updateTime', ({ newTime }) => {
    setCurrentTime(newTime);
    if (audioRef.current) audioRef.current.currentTime = newTime;
  });

  // Chat event listeners outside of other listeners
  socket.on('chatHistory', (history) => {
    setChatMessages(history);
  });

  socket.on('newMessage', (message) => {
    setChatMessages(prev => [...prev, message]);
  });

  // Clean up listeners on unmount or userId change
  return () => {
    socket.off('userJoined');
    socket.off('playSong');
    socket.off('pauseSong');
    socket.off('updateTime');
    socket.off('chatHistory');
    socket.off('newMessage');
  };
}, [userId]);


  const sendMessage = () => {
  if (!chatInput.trim() || !roomId || !userId) return;
  console.log('Sending message:', chatInput);
  socket.emit('sendMessage', { roomId, userId, message: chatInput.trim() });
  setChatInput('');
};

  const createRoom = () => {
    if (!userId) return alert('Login required');
    const id = 'room-' + Math.random().toString(36).substr(2, 9);
    setRoomId(id);
    setAdminId(userId);
    socket.emit('createRoom', { roomId: id, userId }, res => {
      if (!res.success) console.error('Create failed');
    });
  };

  const joinRoom = () => {
    if (!roomId || !userId) return alert('Room ID & login required');
    setIsJoining(true);
    socket.emit('joinRoom', { roomId, userId }, res => {
      if (res.success) setAdminId(res.adminId);
      setIsJoining(false);
    });
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    alert('Room ID copied!');
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center hide-scrollbar"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/originals/e7/56/11/e7561144d424e4a76f087d3fb4d3a2ae.gif')",
      }}
    >
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-4xl font-extrabold text-white text-center drop-shadow-lg mb-8">
          Music Room
        </h1>
        {/* Toggle Chat Button */}
<button
  onClick={() => setShowChatPanel(prev => !prev)}
  className="fixed bottom-24 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg focus:outline-none"
  title="Toggle Chat"
>
  💬
</button>

       
        <div className="flex justify-center space-x-6 mb-8">
          <button
            onClick={() => {
              setShowRoomPanel(p => !p);
              if (showMusicPanel) setShowMusicPanel(false);
            }}
            className="px-6 py-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-2xl transform hover:scale-105 transition"
          >
            {showRoomPanel ? 'Hide Room' : 'Show Room'}
          </button>
          <button
            onClick={() => {
              setShowMusicPanel(p => !p);
              if (showRoomPanel) setShowRoomPanel(false);
            }}
            className="px-6 py-3 bg-gradient-to-br from-green-400 to-teal-600 rounded-full shadow-2xl transform hover:scale-105 transition"
          >
            {showMusicPanel ? 'Hide Music' : 'Show Music'}
          </button>
        </div>

      
        {showRoomPanel && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           
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
                    onClick={copyRoomId}
                    className="mt-2 w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
                  >
                    Copy ID
                  </button>
                </>
              )}
            </div>

           
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
                    No users yet
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
                    onClick={() => selectSong(song)}
                    className={`flex justify-between items-center rounded-xl p-4 transition cursor-pointer
                      ${selectedSong === song ? 'bg-white bg-opacity-50' : 'bg-white bg-opacity-30 hover:bg-opacity-50'}`}
                  >
                    <div>
                      <p className="text-lg font-semibold text-white">
                        {song.name}
                      </p>
                      <p className="text-sm text-white/80">{song.artist}</p>
                    </div>
                   
                    {userId === adminId && selectedSong === song && !isPlaying && (
                      <FaPlay
                        onClick={e => {
                          e.stopPropagation();
                          handlePlayClick(song);
                        }}
                        className="text-2xl text-white hover:text-teal-300 transition"
                      />
                    )}
                    {userId === adminId && selectedSong === song && isPlaying && (
                      <FaPause
                        onClick={e => {
                          e.stopPropagation();
                          handlePause();
                        }}
                        className="text-2xl text-white hover:text-red-400 transition"
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
                  className="w-full h-2 rounded-lg appearance-none bg-white bg-opacity-50 transition"
                />
              </div>
            )}
          </div>
        )}
      </div>
        {showChatPanel && roomId && (
  <div className="fixed bottom-24 right-6 z-40 max-w-xs w-80 max-h-96 bg-white bg-opacity-90 backdrop-blur-xl rounded-xl p-4 shadow-2xl flex flex-col">
    <h2 className="text-gray-900 text-xl font-bold mb-3 text-center">Room Chat</h2>
    <div className="flex-1 overflow-y-auto mb-4 px-2 space-y-2 bg-gray-50 rounded-md">
      {chatMessages.length === 0 ? (
        <p className="text-gray-600 text-center my-3">No messages yet</p>
      ) : (
        chatMessages.map((msg, idx) => (
          <div key={idx} className="text-gray-900 text-sm">
            <strong>{msg.username || msg.userId}:</strong> {msg.message}

            <span className="text-gray-500 text-xs ml-2">{new Date(msg.timestamp).toLocaleTimeString()}</span>
          </div>
        ))
      )}
    </div>
    <div className="flex space-x-2">
      <input
        type="text"
        value={chatInput}
        onChange={(e) => setChatInput(e.target.value)}
        className="flex-1 p-2 rounded-md text-gray-900 border border-gray-300"
        placeholder="Type your message..."
        onKeyDown={e => e.key === 'Enter' && sendMessage()}
      />
      <button
        onClick={sendMessage}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-md"
      >
        Send
      </button>
    </div>
  </div>
)}

      
      <div className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-lg py-3 px-6 flex items-center justify-between space-x-4 shadow-inner">
        
        <div className="flex-1 overflow-hidden">
          <div className="text-white font-semibold truncate">
            {selectedSong ? selectedSong.name : 'No song playing'}
          </div>
          <div className="text-gray-300 text-sm truncate">
            {selectedSong ? selectedSong.artist : ''}
          </div>
        </div>

        
        <input
          type="range"
          min={0}
          max={selectedSong?.duration || 100}
          value={currentTime}
          onChange={e => handleTimeUpdate(+e.target.value)}
          className="w-2/5 h-1 rounded-lg appearance-none bg-white bg-opacity-50 hover:bg-opacity-70 transition"
        />

       
        <div className="flex items-center space-x-4">
          {selectedSong && (
            isPlaying ? (
              <button
                onClick={handlePause}
                disabled={userId !== adminId}
                className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition"
              >
                <FaPause size={20} className="text-white" />
              </button>
            ) : (
              <button
                onClick={handlePlay}
                disabled={userId !== adminId}
                className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition"
              >
                <FaPlay size={20} className="text-white" />
              </button>
            )
          )}
          <button className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition">
            <FaExpand size={18} className="text-white" />
          </button>
        </div>
      </div>

      <audio ref={audioRef} style={{ display: 'none' }} />
    </div>
  );
};

export default SocketRoom;
