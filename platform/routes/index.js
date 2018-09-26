const express = require('express');
const router = express.Router();
const util = require('../modules/util');
const User = require('../models/user')


const randomTheme = () => {
  const themes = ['hckr', 'lens', 'campfire']
  return themes[Math.floor(Math.random() * 3)]
}

const getThemeFromDbResult = (result) => {
  console.log(result)
  let THEME = randomTheme()
  if(result) {
    THEME = result.theme || randomTheme()
    if(!result.beta) result.remove()
  }
  return THEME
}

const accountStatus = (result) => {
  if(!result) return false
  return result.beta || false
}

const renderProfile = (username, res) => {
  User.findOne({user : username}, (err, result) => {
      if (err) throw (err);
      const THEME = getThemeFromDbResult(result)
      res.render('profile', {username, theme : THEME, tag: result.tag, pro: accountStatus(result) } )
    })
}

const renderSingle = (username, permlink, res) => {
  User.findOne({user : username}, (err, result) => {
      if (err) throw (err);
      const THEME = !result ? randomTheme() : result.theme
      res.render('single', {username, permlink, theme : THEME, pro: accountStatus(result) } );
    })
}

router.get('/', function(req, res, next) {
  const domain = req.headers.host;
  const subDomain = domain.split('.');

  if(subDomain.length > 2) {
      username = subDomain[0]
      renderProfile(username, res)
  } else {
      res.render('index');
  }
});

router.get('/dashboard', util.isAuthenticated, (req, res) => {
  const username = req.session.steemconnect.name
  User.findOne({user : username}, (err, result) => {
      if (err) throw (err);
      const THEME = !result ? false : result.theme
      res.render('dashboard', {username, selectedTheme : THEME, tag: result.tag, pro: accountStatus(result) } );
    })
});

router.get('/blog/:permlink', (req, res) => {
  res.render('blog-post', { title: 'Finally Blog', permlink : req.params.permlink} );
});

router.get('/@:username', (req, res) => {
  const username = req.params.username
  let domain = req.headers.host;
  let subDomain = domain.split('.');

  if(subDomain.length > 2) {
      res.redirect('/');
  } else {
    renderProfile(username, res)
  }
});

router.get('/:permlink', (req, res) => {
  const domain = req.headers.host;
  const subDomain = domain.split('.');
  const username = subDomain[0];
  const permlink = req.params.permlink

  if(subDomain.length > 2) {
    renderSingle(username, permlink, res)
  } else {
    let err = new Error('Not Found');
    err.status = 404;
  }
});

router.get('/@:username/:permlink', (req, res) => {
  const username = req.params.username
  const permlink = req.params.permlink
  renderSingle(username, permlink, res)
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
