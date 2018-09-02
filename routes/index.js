var express = require('express');
var router = express.Router();
let utopian = require('utopian-api');
var rp = require('request-promise');

/* GET home page. */
router.get('/', function(req, res, next) {
  const domain = req.headers.host;
  const subDomain = domain.split('.');

  if(subDomain.length > 2) {
      username = subDomain[0]
      res.render('profile', {username} );
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
      res.render('profile', {username} );
  }
});

router.get('/:permlink', (req, res) => {
  const domain = req.headers.host;
  const subDomain = domain.split('.');
  const username = subDomain[0];
  const permlink = req.params.permlink

  if(subDomain.length > 2) {
    res.render('single', {username, permlink} );
  } else {
    let err = new Error('Not Found');
    err.status = 404;
  }
});

router.get('/@:username/:permlink', (req, res) => {
  const username = req.params.username
  const permlink = req.params.permlink
  res.render('single', {username, permlink} );
});

module.exports = router;
