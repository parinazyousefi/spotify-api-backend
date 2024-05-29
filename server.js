require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const authRoutes = require('./routes/authRoutes');
const playlistRoutes = require('./routes/playlistRoutes');
const cors = require('cors');

const app = express();
app.use(express.json());

app.use(cors({ origin: 'https://mood-sync.netlify.app', credentials: true }));


app.use(session({ 
    secret: process.env.SESSION_SECRET, 
    resave: false, 
    saveUninitialized: true 
  }));

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      callbackURL: process.env.SPOTIFY_CALLBACK_URL
    },
    function (accessToken, refreshToken, expires_in, profile, done) {
      return done(null, { profile, accessToken });
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

app.use('/', authRoutes);
app.use('/', playlistRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to Spotify Mood Playlist App!');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
