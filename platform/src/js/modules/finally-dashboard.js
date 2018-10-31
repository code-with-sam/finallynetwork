import $ from 'jquery'

module.exports.init = () => {
  dashboard.UiActions()
  dashboard.showSelectedThemeInDropdown()
}

const dashboard = {

  UiActions() {
    $('.dashboard__save').on('click', (e) => this.updatetheme(e) )
    $('.dashboard__button--unlock').on('click', (e) => this.unlockAction(e) );
  },

  showSelectedThemeInDropdown(){
    const theme = $('.dashboard').data('theme')
    $(`option[value="${theme}"]`).prop('selected','selected')
  },

  updatetheme(e) {
    const theme = $('.dashboard__theme-select :selected').val();
    const tag = $('.dashboard__tag-select').val();
    const nav = $('.dashboard__nav-select').val();
    const showResteems = $('.dashboard__resteem-checkbox').is(':checked')
    const username = $('.dashboard').data('username')
    e.preventDefault()
    $.post({
      url: `/api/${username}/update`,
      dataType: 'json',
      data: { theme, tag, nav, showResteems }
    },
    (response) => location.reload())
  }

}
