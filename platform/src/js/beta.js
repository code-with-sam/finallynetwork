import $ from 'jquery'

const betaPluign = {
  pro : $('main').data('pro'),

  init() {
    if (!this.pro) this.renderBetaTemplate()
  },

  createBetaTemplate() {
    return `<section class="powered">
      <a href="https://finally.network" class="powered__link">
        <span class="powered__tagline">Powered By Finally</span>
        <img class="powered__logo" src="/img/f-logo.png" alt="Finally Network Logo" title="Finally Network">
      </a>
    </section>`
  },

  renderBetaTemplate() {
    const template = this.createBetaTemplate()
    $('body').append(template);
  }
}

module.exports.init = () => {
  betaPluign.init()
}
