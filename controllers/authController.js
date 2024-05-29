const passport = require('passport');

const authController = {
  // Initiate the Spotify OAuth flow
  spotifyAuth: passport.authenticate('spotify', {
    scope: [
      'user-read-email', 
      'user-read-recently-played', 
      'playlist-modify-public', 
      'user-read-recently-played',
      'user-top-read',
      'user-follow-read',
      'user-follow-modify',
      'playlist-read-private',
      'playlist-read-collaborative'
    ],
    showDialog: true,
  }),

  // Handle the callback from Spotify
  spotifyCallback: (req, res, next) => {
    passport.authenticate('spotify', { failureRedirect: '/' }, (err, user) => {
      if (err || !user) {
        return res.redirect('/');
      }
      req.logIn(user, (err) => {
        if (err) {
          return res.redirect('/');
        }
        // Successful authentication, redirect to frontend dashboard
        res.redirect('https://mood-sync.netlify.app/dashboard');
      });
    })(req, res, next);
  },

  // Logout the user
  logout: (req, res) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  },
};

module.exports = authController;
