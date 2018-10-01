
function randomTheme() {
  const themes = ['hckr', 'lens', 'campfire']
  return themes[Math.floor(Math.random() * 3)]
}

module.exports.checkThemeResult = (result) => {
  let THEME = randomTheme()
  if(result) {
    THEME = result.theme || randomTheme()
    if(!result.beta) result.remove()
  }
  return THEME
}
