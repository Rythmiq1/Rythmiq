import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';
import ArtistRouter from './Routes/ArtistRouter.js';
import playlistRouter from './Routes/playlistRouter.js';
import AuthRouter from './Routes/AuthRouter.js';
import albumRouter from './Routes/albumRouter.js';
import Userdb from './Models/User.js';
import './Models/db.js';
import songRouter from './Routes/songRoute.js';
import { ensureAuthenticated } from './Middlewares/Auth.js';

dotenv.config();

const PORT = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app);

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000','https://rythmiq.onrender.com'],
  credentials: true,
}));

app.use(session({
  secret: process.env.CLIENT_SECRET,
  resave: false,
  saveUninitialized: true,
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Google Strategy
passport.use(
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://rythmiq-backend.onrender.com/auth/google/callback",
    scope: ["profile", "email"],
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await Userdb.findOne({ $or: [{ googleId: profile.id }, { email: profile.emails[0].value }] });
      if (!user) {
        user = await Userdb.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          image: profile.photos[0].value,
          googleAccessToken: accessToken,
        });
      } else {
        user.googleId = profile.id;
        user.googleAccessToken = accessToken;
        await user.save();
      }
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  })
);

// Serialize and deserialize
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Routes
app.get('/ping', (req, res) => res.send('pong'));
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get("/auth/google/callback",
passport.authenticate("google", { failureRedirect: "https://rythmiq.onrender.com/login" }),
async (req, res) => {
  const user = req.user;
  const token = jwt.sign(
    {
      userId: user._id,
      name: user.name,
      googleAccessToken: user.googleAccessToken
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  const isNewUser = user.interests.length === 0;
  if (isNewUser) {
    res.redirect(`https://rythmiq.onrender.com/interest?token=${token}&name=${encodeURIComponent(user.name)}&userId=${user._id}`);
  } else {
    res.redirect(`https://rythmiq.onrender.com/home?token=${token}&name=${encodeURIComponent(user.name)}&userId=${user._id}`);
  }
});


app.get("/login/success", ensureAuthenticated, (req, res) => {
  if (req.user) {
    res.status(200).json({
      message: "User Login Successful",
      user: req.user,
    });
  } else {
    res.status(400).json({ message: "User Not Logged In" });
  }
});

app.use("/playlist", playlistRouter);
app.use("/song", songRouter);
app.use("/album", albumRouter);
app.use('/auth', AuthRouter);
app.use('/artist', ArtistRouter);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000','https://rythmiq.onrender.com'], 
    methods: ['GET', 'POST'], 
    allowedHeaders: ['Content-Type'], 
    credentials: true,  
  },
  transports: ['websocket', 'polling'],  
});


let rooms = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (userId) => {
    if (userId) {
      socket.join(userId);
      console.log(`User with ID ${userId} joined their room`);
    }
  });

  socket.on('new-song', (songData) => {
    if (songData && songData.artistId) {
      console.log('Sending new song notification:', songData);
      io.to(songData.artistId).emit('new-song', songData);
    }
  });

  socket.on('joinRoom', ({ roomId, userId }) => {
    socket.join(roomId);  

    if (!rooms[roomId]) {
      rooms[roomId] = { 
        isPlaying: false, 
        song: null, 
        currentTime: 0, 
        users: [],
      };
    }

    if (!rooms[roomId].users.find(user => user.userId === userId)) {
      rooms[roomId].users.push({ userId, socketId: socket.id });
    }

    // Send the current room state to the user who joined
    io.to(socket.id).emit('roomState', rooms[roomId]);

    // Broadcast the user joining to the room
    io.to(roomId).emit('userJoined', { userId, users: rooms[roomId].users });
  });

  socket.on('playSong', ({ roomId, song, userId, newTime = 0 }) => {
    if (!rooms[roomId]) return console.warn(`Room ${roomId} missing`);
    rooms[roomId].song = song;
    rooms[roomId].isPlaying = true;
    rooms[roomId].currentTime = newTime;

    console.log(`▶️ [${roomId}] ${userId} played "${song.name}" @ ${newTime}s`);

    // Broadcast to everyone: playSong with the timestamp
    io.to(roomId).emit('playSong', { song, newTime });
  });

  // Handle pause — admin must send their currentTime
  socket.on('pauseSong', ({ roomId, userId, currentTime }) => {
    if (!rooms[roomId]) return console.warn(`Room ${roomId} missing`);
    rooms[roomId].isPlaying = false;
    rooms[roomId].currentTime = currentTime;

    console.log(`⏸️ [${roomId}] ${userId} paused @ ${currentTime}s`);

    // Broadcast pause + the exact time
    io.to(roomId).emit('pauseSong', { currentTime });
  });

  // Keep the existing updateTime so dragging the slider still works
  socket.on('updateTime', ({ roomId, userId, newTime }) => {
    if (!rooms[roomId]) return;
    rooms[roomId].currentTime = newTime;
    socket.to(roomId).emit('updateTime', { newTime });
  });

  // Handle play/pause toggle (called when play/pause is toggled)
  socket.on('togglePlay', ({ roomId, isPlaying, userId }) => {
    if (rooms[roomId]) {
      rooms[roomId].isPlaying = isPlaying;

      // Emit the play/pause state to all users in the room
      io.to(roomId).emit('togglePlay', isPlaying);
      console.log(`User with ID ${userId} changed play/pause state in room ${roomId}: ${isPlaying}`);
    } else {
      console.log(`Room ${roomId} does not exist for togglePlay event.`);
    }
  });

  // Handle sync time (called when time sync is required)
  socket.on('syncTime', ({ roomId, currentTime }) => {
    if (rooms[roomId]) {
      rooms[roomId].currentTime = currentTime;

      // Emit the sync time to all users in the room
      io.to(roomId).emit('syncTime', currentTime);
    } else {
      console.log(`Room ${roomId} does not exist for syncTime event.`);
    }
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    // Loop through rooms and remove the user from any room they were in
    for (let roomId in rooms) {
      const userIndex = rooms[roomId].users.findIndex(user => user.socketId === socket.id);
      if (userIndex > -1) {
        const user = rooms[roomId].users[userIndex];
        rooms[roomId].users.splice(userIndex, 1);
        io.to(roomId).emit('userLeft', { userId: user.userId, users: rooms[roomId].users });

        // Optionally, remove the room if there are no users left
        if (rooms[roomId].users.length === 0) {
          delete rooms[roomId]; // Remove the room from memory
        }
      }
    }
  });
});

// Export io for use in other files
export { io };

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.status(200).json("Server Started");
});