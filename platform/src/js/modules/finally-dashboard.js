import $ from 'jquery'

module.exports.init = () => {
  dashboard.UiActions()
  dashboard.showCurrentThemeInDashboardSettings()
}

const dashboard = {

  UiActions() {
    $('.dashboard__save').on('click', (e) => this.updatetheme(e) )
    $('.dashboard__button--unlock').on('click', (e) => this.unlockAction(e) );
    $('.dashboard__theme-select').change( (e) => this.enablethemeSettings(e) );
  },

  showCurrentThemeInDashboardSettings(){
    const theme = $('.dashboard').data('theme')
    $(`option[value="${theme}"]`).prop('selected','selected')
    $(`.custom__settings--${theme}-theme`).show();
  },

  enablethemeSettings() {
    const theme = $('.dashboard__theme-select').find(":selected").val()
    console.log(theme, `.custom__settings--${theme}-theme`)
    $(`.custom__settings--${theme}-theme`).show();
  },

  updatetheme(e) {
    const theme = $('.dashboard__theme-select :selected').val();
    const tag = $('.dashboard__tag-select').val();
    const nav = $('.dashboard__nav-select').val();
    const showResteems = $('.dashboard__resteem-checkbox').is(':checked')
    const username = $('.dashboard').data('username')
    const userData = Object.assign( { theme, tag, nav, showResteems }, this.setUserData())

    e.preventDefault()
    $.post({
      url: `/api/${username}/update`,
      dataType: 'json',
      data: userData
    },
    (response) => location.reload())
  },

  setUserData() {
    return {
        critdayName: $('.dashboard__critday-name').val(),
        critdayInstagram: $('.dashboard__critday-instagram').val(),
        critdayCourse: $('.dashboard__critday-course').val(),
        critdayProject: $('.dashboard__critday-project').val(),
        critdaySite: $('.dashboard__critday-site').val(),
        critdayUniversity: $('.dashboard__critday-university').val(),
        critdayTutor: $('.dashboard__critday-tutor').val(),
        critdayBio: $('.dashboard__critday-bio').val()
    }
  }
  
}
