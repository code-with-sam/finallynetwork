import $ from 'jquery'

const app = {
  init() {
    this.UiActions()
    this.showSelectedThemeInDropdown()
  },

  UiActions() {
    $('.header__beta').on('click', () => $('.modal').fadeIn() )
    $('.modal .submit').on('click', (e) => this.showBetaModal(e) )
    $('.dashboard__save').on('click', (e) => this.updatetheme(e) )
  },

  showBetaModal(e){
      let username = $('.modal .username').val()
      window.location.href = `/@${username}`
      e.preventDefault()
  },

  showSelectedThemeInDropdown(){
    const theme = $('.dashboard').data('theme')
    $(`option[value="${theme}"]`).prop('selected','selected')
  },

  updatetheme(e) {
    const theme = $('.dashboard__theme-select :selected').val();
    const username = $('.dashboard').data('username')
    e.preventDefault()
    $.post({
        url: `/api/${username}/theme`,
        dataType: 'json',
        data: { theme: theme }
      },
      (response) => location.reload())
  }
}

app.init()
