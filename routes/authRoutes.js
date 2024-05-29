const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Spotify authentication routes
router.get('/spotify', authController.spotifyAuth);
router.get('/spotify/callback', authController.spotifyCallback);
router.get('/logout', authController.logout);

module.exports = router;
