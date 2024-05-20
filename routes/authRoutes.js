// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const {
  spotifyAuth,
  spotifyAuthCallback,
  redirectToDashboard,
  getDashboard
} = require('../controllers/authController');

router.get('/auth/spotify', spotifyAuth);
router.get('/auth/spotify/callback', spotifyAuthCallback, redirectToDashboard);
router.get('/dashboard', getDashboard);

module.exports = router;
