module.exports.isAuthenticated = (req, res, next) => {
  if (req.session.steemconnect)
      return next();

  res.redirect('/');
}

module.exports.isAuthorized = (req, res, next) => {
  if (req.session.access_token)
      return next();

  res.json({
    status: 'fail',
    msg: 'Please sign in.'
  })
}

module.exports.subdomainCheck = (req, res, next) => {
  const domain = req.headers.host;
  const subDomain = domain.split('.');
  const hasSubDomain = subDomain.length > 2
  res.locals.subDomain = subDomain[0]
  res.locals.hasSubDomain = hasSubDomain
  next();
}
