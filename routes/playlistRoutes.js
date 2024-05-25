// routes/playlistRoutes.js
const express = require('express');
const router = express.Router();
const { getRecentlyPlayed, getTopArtists, getTopSongs } = require('../controllers/playlistController');

router.get('/recently-played', getRecentlyPlayed);
router.get('/top-artists',getTopArtists);
router.get('/top-songs',getTopSongs);
module.exports = router;
