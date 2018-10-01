const express = require('express');
const router = express.Router();
const util = require('../modules/util');
const User = require('../models/user')
const themeController = require('../controllers/theme')
const templateController = require('../controllers/template')
const accountController = require('../controllers/account')

router.get('/', function(req, res, next) {
  if(res.locals.hasSubDomain) {
      templateController.renderProfile(res.locals.subDomain, res)
  } else {
      res.render('index');
  }
});

router.get('/dashboard', util.isAuthenticated, (req, res) => {
  const username = req.session.steemconnect.name
  User.findOne({user : username}, (err, result) => {
      if (err) throw (err);
      const THEME = !result ? false : result.theme
      res.render('dashboard', {username, selectedTheme : THEME, tag: result.tag, pro: accountController.accountStatus(result) } );
    })
});

router.get('/blog/:permlink', (req, res) => {
  res.render('blog-post', { title: 'Finally Blog', permlink : req.params.permlink} );
});

router.get('/@:username', (req, res) => {
  const username = req.params.username
  if(res.locals.hasSubDomain) {
      res.redirect('/');
  } else {
    templateController.renderProfile(username, res)
  }
});

router.get('/:permlink', (req, res) => {
  const permlink = req.params.permlink
  if(res.locals.hasSubDomain) {
    templateController.renderSingle(res.locals.subDomain, permlink, res)
  } else {
    let err = new Error('Not Found');
    err.status = 404;
  }
});

router.get('/@:username/:permlink', (req, res) => {
  const username = req.params.username
  const permlink = req.params.permlink
  templateController.renderSingle(username, permlink, res)
});

router.post('/api/:username/theme', (req, res) => {
  const username = req.params.username
  const theme = req.body.theme
  const tag = req.body.tag
  User.findOneAndUpdate({user: username}, {theme: theme }, {upsert: true}, (result) => res.json({result}));
});

router.post('/api/:username/update', util.isAuthorized, (req, res) => {
  const username = req.params.username
  const authorizedUser = req.session.steemconnect.name
  const theme = req.body.theme
  const tag = req.body.tag
  if(username === authorizedUser){
    User.findOneAndUpdate({user: username}, {theme: theme, tag: tag }, {upsert: true}, (result) => res.json({result}));
  } else {
    res.json({
      status: 'fail',
      msg: 'Please sign in.'
    })
  }
});


module.exports = router;
