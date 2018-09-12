import $ from 'jquery'

const betaPluign = {
  username : $('main').data('username'),

  init() {
    this.renderTemplate()
    this.uiActions()
  },

  createTemplate() {
    return `<section class="beta-modal">
      <h2 class="beta-modal__title">Theme : <select class="beta-modal__select">
      <option value="lens">Lens</option>
      <option value="hckr">HCKR</option>
      <option value="campfire">Campfire</option>
      </select>
      <input class="beta-modal__submit" type="submit" value="Update">
      </h2>
    </section>`
  },

  renderTemplate() {
    const template = this.createTemplate()
    $('body').append(template)
  },

  uiActions() {
    $('body').on('click', '.beta-modal__submit', (e) => {
      console.log('dsff')
      e.preventDefault()
      let theme = $('.beta-modal__select').val().toLowerCase()
      this.submitThemeChange(this.username, theme)
    });
  },

  submitThemeChange(username, theme){
    $.post({
        url: `/api/${username}/theme`,
        dataType: 'json',
      data: { theme: theme }
      },
      (response) => console.log(response))
  }
}

betaPluign.init()
