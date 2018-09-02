var express = require('express');
var router = express.Router();
let utopian = require('utopian-api');
var rp = require('request-promise');

/* GET home page. */
router.get('/', function(req, res, next) {
  //  res.render('profile-example', {
  //     title: 'Utopian Dashy'
  //  });
   res.render('index');
});

router.get('/@:username', (req, res) => {
  const username = req.params.username
  res.render('profile', {username} );
});


router.get('/@:username/:permlink', (req, res) => {
  const username = req.params.username
  const permlink = req.params.permlink
  res.render('single', {username, permlink} );
});

module.exports = router;
