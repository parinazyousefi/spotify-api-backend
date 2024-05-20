// routes/playlistRoutes.js
const express = require('express');
const router = express.Router();
const { getRecentlyPlayed } = require('../controllers/playlistController');

router.get('/recently-played', getRecentlyPlayed);

module.exports = router;
