var express = require('express');
var router = express.Router();
// testing
const THEME = 'hckr'

/* GET home page. */
router.get('/', function(req, res, next) {
  const domain = req.headers.host;
  const subDomain = domain.split('.');

  if(subDomain.length > 2) {
      username = subDomain[0]
      res.render('profile', {username, theme : THEME } );
  } else {
      res.render('index');
  }
});

router.get('/@:username', (req, res) => {
  const username = req.params.username

  let domain = req.headers.host;
  let subDomain = domain.split('.');

  if(subDomain.length > 2) {
      res.redirect('/');
  } else {
      res.render('profile', {username, theme : THEME } );
  }
});

router.get('/:permlink', (req, res) => {
  const domain = req.headers.host;
  const subDomain = domain.split('.');
  const username = subDomain[0];
  const permlink = req.params.permlink

  if(subDomain.length > 2) {
    res.render('single', {username, permlink, theme : THEME } );
  } else {
    let err = new Error('Not Found');
    err.status = 404;
  }
});

router.get('/@:username/:permlink', (req, res) => {
  const username = req.params.username
  const permlink = req.params.permlink
  res.render('single', {username, permlink, theme : THEME } );
});

module.exports = router;
