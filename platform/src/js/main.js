import $ from 'jquery'

const app = {
  init() {
    this.UiActions()
  },

  UiActions() {
    $('.header__beta').on('click', () => $('.modal').fadeIn() )
    $('.modal .submit').on('click', (e) => this.showBetaModal(e) )
  },

  showBetaModal(e){
      let username = $('.modal .username').val()
      window.location.href = `/@${username}`
      e.preventDefault()
  }
}

app.init()
