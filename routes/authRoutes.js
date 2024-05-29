const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
router.use(require('cors')());

router.get('/auth/spotify', authController.spotifyAuth);
router.get('/auth/spotify/callback', authController.spotifyCallback);
router.get('/logout', authController.logout);
module.exports = router;
