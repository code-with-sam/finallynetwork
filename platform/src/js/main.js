import $ from 'jquery'
import steem from 'steem'

const app = {
  init() {
    this.UiActions()
    this.showSelectedThemeInDropdown()
    this.loadNewsLinks()
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
    const tag = $('.dashboard__tag-select').val();
    const username = $('.dashboard').data('username')
    e.preventDefault()
    $.post({
        url: `/api/${username}/update`,
        dataType: 'json',
        data: { theme, tag }
      },
      (response) => location.reload())
  },

  loadNewsLinks(){
    const query = { tag: 'finallynetwork', limit: 5 }
    const listPosts = (posts) => {
      for (var i = 0; i < posts.length; i++) {
        let template = `<li><a href="/blog/${posts[i].url}"> ${posts[i].title}</a></li>`
        $('.landing__news ul').append(template)
      }
    }
    steem.api.getDiscussionsByBlog(query, (err, result) => {
      console.log('ho')
      if (err === null) listPosts(result)
    })

  }

}

app.init()
