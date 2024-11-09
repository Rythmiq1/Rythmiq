// Import dependencies
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import http from "http";
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import { Strategy as SpotifyStrategy } from 'passport-spotify';
import jwt from 'jsonwebtoken';
import { Server } from "socket.io";
import ArtistRouter from './Routes/ArtistRouter.js'
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
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type'],
    credentials: true,
    // Allowed HTTP methods
  }
});
// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', 
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
    console.log("Google profile:", profile);
    
    try {
      // Check if user with Google ID or email already exists
      let user = await Userdb.findOne({ $or: [{ googleId: profile.id }, { email: profile.emails[0].value }] });
      if (!user) {
        // Create new user
        user = await Userdb.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          image: profile.photos[0].value,
          googleAccessToken: accessToken,
        });
        console.log("New user created with Google account:", user);
      } else {
        // Update Google tokens if user already exists
        user.googleId = profile.id;
        user.googleAccessToken = accessToken;
        await user.save();
        console.log("Existing Google user updated:", user);
      }
      return done(null, user);
    } catch (error) {
      console.error("Error with Google login:", error);
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
    console.log("Spotify profile:", profile);
    
    try {
      // Check if user with Spotify ID or email already exists
      let user = await Userdb.findOne({ $or: [{ spotifyId: profile.id }, { email: profile.emails[0].value }] });
      if (!user) {
        // Log or handle if Spotify user email not found
        console.log("No existing user for Spotify profile, Spotify email:", profile.emails[0].value);
      } else {
        // Update Spotify tokens if user exists
        user.spotifyId = profile.id;
        user.spotifyAccessToken = accessToken;
        user.spotifyRefreshToken = refreshToken;
        await user.save();
        console.log("Existing user linked with Spotify account:", user);
      }
      return done(null, user);
    } catch (error) {
      console.error("Error with Spotify login:", error);
      return done(error, null);
    }
  })
);

// Serialize and deserialize
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Routes
app.get('/ping', (req, res) => {
  res.send('pong');
});
// Google Login Route
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google Callback
app.get("/auth/google/callback",
passport.authenticate("google", { failureRedirect: "http://localhost:5173/login" }),
(req, res) => {
  console.log("Google login successful for user:", req.user);
  // Redirect to Spotify authentication
  res.redirect(`http://localhost:8080/auth/spotify?googleAccessToken=${req.user.googleAccessToken}`);
  
}
);

// Spotify Login Route
app.get('/auth/spotify', passport.authenticate('spotify', { scope: ['user-read-email', 'user-read-private'] }));

// Spotify Callback
app.get("/auth/callback/spotify",
passport.authenticate("spotify", { failureRedirect: "http://localhost:5173/login" }),
async (req, res) => {
  if (req.user) {
    console.log("Spotify login successful for user:", req.user);
    
    const token = jwt.sign({
      userId: req.user._id,
      name: req.user.name,
      googleAccessToken: req.user.googleAccessToken,
      spotifyAccessToken: req.user.spotifyAccessToken
    }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    console.log("JWT token generated:", token);
    
    // Redirect to genre page with token and user details
    res.redirect(`http://localhost:5173/genre?token=${token}&name=${encodeURIComponent(req.user.name)}&userId=${req.user._id}&spotifyAccessToken=${req.user.spotifyAccessToken}`);
  } else {
    console.log("User failed to authenticate with Spotify.");
    res.redirect("http://localhost:5173/login");
  }
}
);

// Check if user is logged in
app.get("/login/success", ensureAuthenticated, (req, res) => {
  if (req.user) {
    res.status(200).json({
      message: "User Login Successful",
      user: req.user,
    });
  } else {
    res.status(400).json({
      message: "User Not Logged In",
    });
  }
});

app.use("/playlist", playlistRouter);
app.use("/song", songRouter);
app.use("/album", albumRouter);
app.use('/auth', AuthRouter);
app.use('/artist',ArtistRouter);
// Server setup

app.get("/", (req, res) => {
  res.status(200).json("Server Started");
});
fetch('https://api.spotify.com/v1/search?q=kuch+kuch&type=track', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer YOUR_SPOTIFY_ACCESS_TOKEN`
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for join-room event and join the user’s room
  socket.on('join-room', (userId) => {
      if (userId) {
          socket.join(userId);  // Join a room based on userId
          console.log(`User with ID ${userId} joined their room`);
      }
  });

  // Emit a 'new-song' event to users following the artist
  socket.on('new-song', (songData) => {
      // Logic to send notifications to users following the artist
      console.log('Sending notification:', songData);
      // Example: notify all users following the artist
      io.to(songData.artistId).emit('new-song', songData);
  });

  socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
  });
});

export {io};
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});