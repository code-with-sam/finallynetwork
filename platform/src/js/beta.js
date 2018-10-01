import $ from 'jquery'

const betaPluign = {
  username : $('main').data('username'),
  pro : $('main').data('pro'),

  init() {
    if (!this.pro) this.renderBetaTemplate()
    this.uiActions()
  },

  createBetaTemplate() {
    return `<section class="beta-modal">
      <h2 class="beta-modal__title">Change Theme : <select class="beta-modal__select">
      <option value="lens">Lens</option>
      <option value="hckr">HCKR</option>
      <option value="campfire">Campfire</option>
      </select>
      <input class="beta-modal__submit" type="submit" value="Test">

      </h2>
      <a href="/auth" class="beta-modal__link">Sign in to unlock your account</a>
    </section>`
  },

  renderBetaTemplate() {
    const template = this.createBetaTemplate()
    $('body').append(template)
  },

  uiActions() {
    $('body').on('click', '.beta-modal__submit', (e) => this.submitAction(e) );
  },

  submitAction(e) {
      e.preventDefault()
      let theme = $('.beta-modal__select').val().toLowerCase()
      this.submitThemeChange(this.username, theme)
  },

  submitThemeChange(username, theme){
    $.post({
        url: `/api/${username}/theme`,
        dataType: 'json',
        data: { theme: theme }
      },
      (response) => location.reload())
  }

}

betaPluign.init()
