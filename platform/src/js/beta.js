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
      <h2 class="beta-modal__title">Theme : <select class="beta-modal__select">
      <option value="lens">Lens</option>
      <option value="hckr">HCKR</option>
      <option value="campfire">Campfire</option>
      </select>
      <input class="beta-modal__submit" type="submit" value="Test">
      <input class="beta-modal__unlock" type="submit" value="Unlock">
      </h2>
    </section>`
  },

  unlockModalTemplate (){
    return `<section class="beta-unlock">
      <div class="beta-unlock__frame">
        <h2 class="beta-unlock__title">Beta Unlock</h2>
        <p class="beta-unlock__details">Themes change randomly on load. Unlocking beta access will set the template for your site.</p>
        <p class="beta-unlock__details">Pay what you want</p>
        <input class="beta-unlock__number" placeholder="STEEM" type="number">
        <span class="beta-unlock__username"></span>
        <a class="beta-unlock__submit" href="#">Unlock With Steemconnect</a>
      </div>
    </section>`
  },

  renderBetaTemplate() {
    const template = this.createBetaTemplate()
    $('body').append(template)
  },

  renderUnlockModal (){
    const template = this.unlockModalTemplate()
    $('body').append(template)
  },

  uiActions() {
    $('body').on('click', '.beta-modal__submit', (e) => this.submitAction(e) );
    $('body').on('click', '.beta-modal__unlock', (e) => this.loadUnlockModal(e) );
    $('body').on('click', '.beta-unlock__submit', (e) => this.unlockAction(e) );
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
  },

  loadUnlockModal(e) {
    this.renderUnlockModal()
  },

  unlockAction(e) {
    e.preventDefault();
    let val = $('.beta-unlock__number').val()
    let steem = val === '' ? 1 : parseFloat(val)
    let transferUrl = `https://steemconnect.com/sign/transfer?from=${this.username}&to=finallynetwork&amount=${steem.toFixed(3)}%20STEEM&memo=unlock`
    let transferWindow = window.open(transferUrl,'Steemconnect Transfer','height=700,width=600');
    if (window.focus) transferWindow.focus();
  }

}

betaPluign.init()
