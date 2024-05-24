// routes/playlistRoutes.js
const express = require('express');
const router = express.Router();
const { getRecentlyPlayed, getTopArtists } = require('../controllers/playlistController');

router.get('/recently-played', getRecentlyPlayed);
router.get('/top-artists',getTopArtists);

module.exports = router;
