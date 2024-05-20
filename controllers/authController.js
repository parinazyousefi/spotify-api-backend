// controllers/authController.js
const passport = require('passport');

const spotifyAuth = passport.authenticate('spotify', {
  scope: ['user-read-email', 'user-read-recently-played', 'playlist-modify-public', 'playlist-modify-private']
});

const spotifyAuthCallback = passport.authenticate('spotify', { failureRedirect: '/' });

const redirectToDashboard = (req, res) => {
  res.redirect('/dashboard');
};

const getDashboard = (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/auth/spotify');
  }
  res.send(`Hello ${req.user.profile.displayName}`);
};

module.exports = {
  spotifyAuth,
  spotifyAuthCallback,
  redirectToDashboard,
  getDashboard
};
