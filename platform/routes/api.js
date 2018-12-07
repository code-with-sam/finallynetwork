const express = require('express');
const router = express.Router();
const User = require('../models/user')
const util = require('../modules/util');

router.post('/:username/create', (req, res) => {
  const username = req.params.username
  const theme = req.body.theme
  User.create({user: username, theme: theme}, (err, result) => res.json({result}))
});


router.post('/:username/update', util.isAuthorized, (req, res) => {
  const username = req.params.username
  const authorizedUser = req.session.steemconnect.name
  const theme = req.body.theme
  const tag = util.removeFirstCharIfHash(req.body.tag)
  const nav = req.body.nav.split(',').map(n => n.trim().toLowerCase())
  const showResteems = req.body.showResteems

  if(username === authorizedUser){
    User.findOneAndUpdate({user: username}, {
        theme: theme,
        tag: tag,
        navigation: nav,
        showResteems: showResteems,
        data: {
          critdayName: req.body.critdayName,
          critdayInstagram: req.body.critdayInstagram,
          critdayCourse: req.body.critdayCourse,
          critdayProject: req.body.critdayProject,
          critdaySite: req.body.critdaySite,
          critdayUniversity: req.body.critdayUniversity,
          critdayTutor: req.body.critdayTutor,
          critdayBio: req.body.critdayBio,
          motionShowComments: req.body.motionShowComments
        }
    }, {upsert: true}, (result) => res.json({result}));
  } else {
    res.json({
      status: 'fail',
      msg: 'Please sign in.'
    })
  }
});

module.exports = router;
