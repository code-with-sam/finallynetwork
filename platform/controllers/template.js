const User = require('../models/user')
const accountController = require('../controllers/account')
const DEFAULT_THEME = 'campfire'

module.exports.renderProfile = (username, res) => {
  User.findOne({user : username}, (err, result) => {
    if (err) throw (err);
    const THEME = result && result.theme ? result.theme : DEFAULT_THEME
    const TAG = result && result.tag ? result.tag : ''
    const NAV = result && result.navigation ? result.navigation : []

    res.render('profile', {
      username,
      theme: THEME,
      tag: TAG,
      nav: NAV,
      pro: accountController.accountStatus(result)
    })
  })
}

module.exports.renderSingle = (username, permlink, res) => {
  User.findOne({user : username}, (err, result) => {
    if (err) throw (err);
    const THEME = result && result.theme ? result.theme : DEFAULT_THEME
    const NAV = result && result.navigation ? result.navigation : []
    res.render('single', {
      username,
      permlink,
      theme: THEME,
      nav: NAV,
      pro: accountController.accountStatus(result)
    });
  })
}
