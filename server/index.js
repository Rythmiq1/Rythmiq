// Import dependencies
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import { Strategy as SpotifyStrategy } from 'passport-spotify';
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

// Initialize Socket.io with CORS configuration

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
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
    callbackURL: "/auth/google/callback",
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

// Spotify Strategy
passport.use(
  new SpotifyStrategy({
    clientID: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/callback/spotify",
    scope: ['user-read-email', 'user-read-private'],
  },
  async (accessToken, refreshToken, expires_in, profile, done) => {
    try {
      let user = await Userdb.findOne({ $or: [{ spotifyId: profile.id }, { email: profile.emails[0].value }] });
      if (user) {
        user.spotifyId = profile.id;
        user.spotifyAccessToken = accessToken;
        user.spotifyRefreshToken = refreshToken;
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
passport.authenticate("google", { failureRedirect: "http://localhost:5173/login" }),
(req, res) => {
    res.redirect(`http://localhost:8080/auth/spotify?googleAccessToken=${req.user.googleAccessToken}`);
  }
);

app.get('/auth/spotify', passport.authenticate('spotify', { scope: ['user-read-email', 'user-read-private'] }));

app.get("/auth/callback/spotify",
passport.authenticate("spotify", { failureRedirect: "http://localhost:5173/login" }),
async (req, res) => {
  const token = jwt.sign(
    {
      userId: req.user._id,
      name: req.user.name,
      googleAccessToken: req.user.googleAccessToken,
      spotifyAccessToken: req.user.spotifyAccessToken
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  res.redirect(`http://localhost:5173/genre?token=${token}&name=${encodeURIComponent(req.user.name)}&userId=${req.user._id}&spotifyAccessToken=${req.user.spotifyAccessToken}`);
}
);

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
    origin: ['http://localhost:5173', 'http://localhost:3000'],  // Allowed origins
    methods: ['GET', 'POST'],  // Allowed methods
    allowedHeaders: ['Content-Type'],  // Allowed headers
    credentials: true,  // Enable credentials
    transports: ['websocket', 'polling'],  // Allowed transport protocols
  }
});

let rooms = {};  // Store rooms and users

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle room joining
  socket.on('joinRoom', ({ roomId, userId }) => {
    socket.join(roomId);  // Join the specific room

    if (!rooms[roomId]) {
      // Initialize the room if it doesn't exist
      rooms[roomId] = { 
        isPlaying: false, 
        song: null,  // Changed to store the full song object
        currentTime: 0, 
        users: [], 
      };
    }

    // Add user to the room if not already present
    if (!rooms[roomId].users.find(user => user.userId === userId)) {
      rooms[roomId].users.push({ userId, socketId: socket.id });
    }

    // Send the current room state to the user who joined
    io.to(socket.id).emit('roomState', rooms[roomId]);

    // Broadcast the user joining to the room
    io.to(roomId).emit('userJoined', { userId, users: rooms[roomId].users });
  });

  // Handle song playback (called when a song is played)
  socket.on('playSong', ({ roomId, song, userId }) => {
    if (rooms[roomId]) {
      rooms[roomId].song = song;  // Store the full song object
      rooms[roomId].isPlaying = true;

      // Log the userId and song details when the song is being sent
      console.log(`User with ID ${userId} is playing song in room ${roomId}: ${song.name}`);

      // Emit the song to all users in the room
      io.to(roomId).emit('playSong', { song, userId });
    } else {
      console.log(`Room ${roomId} does not exist for playSong event.`);
    }
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

  // Handle time sync for the song (called when time sync is required)
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
        // Remove user from the room's user list
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