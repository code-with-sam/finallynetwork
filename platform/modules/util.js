module.exports.isAuthenticated = (req, res, next) => {
  if (req.session.steemconnect)
      return next();

  res.redirect('/');
}
