// controllers/playlistController.js
const axios = require('axios');

const getRecentlyPlayed = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/auth/spotify');
  }

  try {
    const { accessToken } = req.user;
    const response = await axios.get('https://api.spotify.com/v1/me/player/recently-played', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    const tracks = response.data.items.map(item => item.track);
    res.json(tracks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getRecentlyPlayed
};
