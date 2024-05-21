const passport = require('passport');

const authController = {
  spotifyAuth: passport.authenticate('spotify', {
    scope: ['user-read-email', 'user-read-recently-played', 'playlist-modify-public', 'user-read-recently-played',' user-top-read',' user-follow-read',' user-follow-modify',' playlist-read-private ','playlist-read-collaborative'],
    showDialog: true,
  }),

  spotifyCallback: (req, res) => {
    passport.authenticate('spotify', { failureRedirect: '/' }, (err, user) => {
      if (err || !user) {
        return res.redirect('/');
      }
      req.logIn(user, (err) => {
        if (err) {
          return res.redirect('/');
        }
        // Successful authentication, redirect to frontend dashboard
        res.redirect('http://localhost:3000/dashboard');
      });
    })(req, res);
  },

  logout: (req, res) => {
    req.logout(() => {
      res.redirect('/');
    });
  },
};

module.exports = authController;
