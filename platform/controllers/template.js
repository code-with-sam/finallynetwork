const User = require('../models/user')
const themeController = require('../controllers/theme')
const accountController = require('../controllers/account')


module.exports.renderProfile = (username, res) => {
  User.findOne({user : username}, (err, result) => {
    if (err) throw (err);
    const THEME = themeController.checkThemeResult(result)
    const TAG = result.tag ? result.tag : ''
    const NAV = result.navigation ? result.navigation : []

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
    const THEME = !result ? randomTheme() : result.theme
    res.render('single', {
      username,
      permlink,
      theme: THEME,
      pro: accountController.accountStatus(result)
    });
  })
}
