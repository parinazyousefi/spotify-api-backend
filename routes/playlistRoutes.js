const express = require('express');
const router = express.Router();
const { getRecentlyPlayed, getTopArtists, getTopSongs, getRecommendations, getUser } = require('../controllers/playlistController');

// Middleware function to set CORS headers
const setCorsHeaders = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://mood-sync.netlify.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
};

router.get('/recently-played', setCorsHeaders, getRecentlyPlayed);
router.get('/top-artists', setCorsHeaders, getTopArtists);
router.get('/top-songs', setCorsHeaders, getTopSongs);
router.get('/recommendations', setCorsHeaders, getRecommendations);
router.get('/profile', setCorsHeaders, getUser);

module.exports = router;
