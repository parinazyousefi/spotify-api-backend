// routes/playlistRoutes.js
const express = require('express');
const router = express.Router();
const { getRecentlyPlayed, getTopArtists, getTopSongs, getRecommendations, getUser} = require('../controllers/playlistController');

router.use(require('cors')());

router.get('/recently-played', getRecentlyPlayed);
router.get('/top-artists',getTopArtists);
router.get('/top-songs',getTopSongs);
router.get('/recommendations',getRecommendations);
router.get('/profile',getUser);
module.exports = router;
