import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import { Strategy as OAuth2Strategy } from 'passport-google-oauth2';
import jwt from 'jsonwebtoken';
import playlistRouter from './Routes/playlistRouter.js';
import AuthRouter from './Routes/AuthRouter.js';
import songRoutes from './Routes/songRoute.js';
import albumRouter from './Routes/albumRouter.js';
import Userdb from './Models/User.js';
import './Models/db.js';
import http from 'http';
import { Server } from 'socket.io';

// Initialize environment variables
dotenv.config();

const PORT = process.env.PORT || 8080;
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.use(session({
  secret: process.env.CLIENT_SECRET,
  resave: false,
  saveUninitialized: true,
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Passport strategy
passport.use(
  new OAuth2Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    scope: ["profile", "email"],
  },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await Userdb.findOne({ googleId: profile.id });

        if (!user) {
          user = await Userdb.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            image: profile.photos[0].value
          });
          await user.save();
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

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
app.use("/playlist", playlistRouter);
app.use("/song", songRoutes);
app.use("/album", albumRouter);
app.use('/auth', AuthRouter);

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "http://localhost:5173/login" }), async (req, res) => {
  if (req.user) {
    const token = jwt.sign({
      userId: req.user._id,
      name: req.user.name
    }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.redirect(`http://localhost:5173/genre?token=${token}&name=${encodeURIComponent(req.user.name)}&userId=${req.user._id}`);
  } else {
    res.redirect("http://localhost:5173/login");
  }
});

app.get("/login/success", async (req, res) => {
  if (req.user) {
    res.status(200).json({
      message: "User Login",
      user: req.user
    });
  } else {
    res.status(400).json({
      message: "User Not Login"
    });
  }
});

// Socket.io integration
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const rooms = {}; // Room states

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  

  socket.on('joinRoom', ({ roomId, username }) => {
    socket.join(roomId);
    console.log(`User ${username} is joining room ${roomId}`);
    if (!rooms[roomId]) {
      rooms[roomId] = { isPlaying: false, songUrl: '', currentTime: 0, users: [] };
    }
    rooms[roomId].users.push(username);

    io.to(socket.id).emit('roomState', rooms[roomId]);
    io.to(roomId).emit('userJoined', { username, users: rooms[roomId].users });
  });

  socket.on('playSong', ({ roomId, songUrl }) => {
    rooms[roomId].songUrl = songUrl;
    rooms[roomId].isPlaying = true;
    io.to(roomId).emit('playSong', { songUrl });
  });

  socket.on('togglePlay', ({ roomId, isPlaying }) => {
    rooms[roomId].isPlaying = isPlaying;
    io.to(roomId).emit('togglePlay', isPlaying);
  });

  socket.on('syncTime', ({ roomId, currentTime }) => {
    rooms[roomId].currentTime = currentTime;
    io.to(roomId).emit('syncTime', currentTime);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
