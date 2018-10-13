const User = require('../models/user')
const accountController = require('../controllers/account')
const DEFAULT_THEME = 'campfire'

module.exports.renderProfile = (username, res) => {
  User.findOne({user : username}, (err, result) => {
    if (result === null ) res.render('profile', { username, theme : DEFAULT_THEME, tag: '', nav : [], pro :false })
    if (err) throw (err);

    res.render('profile', {
      username,
      theme: result.theme,
      tag: result.tag,
      nav: result.navigation,
      showResteems: result.showResteems,
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

module.exports.renderResteem = (username, author, permlink, res) => {
  User.findOne({user : username}, (err, result) => {
    if (err) throw (err);
    const THEME = result && result.theme ? result.theme : DEFAULT_THEME
    const NAV = result && result.navigation ? result.navigation : []
    res.render('resteem', {
      username,
      author,
      permlink,
      theme: THEME,
      nav: NAV,
      pro: accountController.accountStatus(result)
    });
  })
}
