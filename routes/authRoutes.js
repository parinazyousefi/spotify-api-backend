const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.get('/auth/spotify', authController.spotifyAuth);
router.get('/auth/spotify/callback', authController.spotifyCallback);
router.get('/logout', authController.logout);
module.exports = router;
