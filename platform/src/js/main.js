import "../../node_modules/normalize.css/normalize.css";
import "../scss/main.scss"

import $ from 'jquery'
import steem from 'steem'
import showdown from 'showdown'
import purify from 'dompurify'
import finallycomments from 'finallycomments'

import dashboard from './modules/finally-dashboard'

const app = {
  init() {
    this.UiActions()
    this.pageSpecificInit()
  },

  pageSpecificInit(){
    const page = $('main').attr('class').split(/\s+/)
    if( page.includes('landing') || page.includes('blog')  ) this.loadNewsLinks()
    if( page.includes('blog-single') ) this.loadRecentPosts()
    if( page.includes('dashboard') ) dashboard.init()
  },

  UiActions() {
    $('.header__beta').on('click', () => $('.modal').fadeIn() )
    $('.modal .submit').on('click', (e) => this.showBetaModal(e) )
  },

  showBetaModal(e){
    e.preventDefault()
      let username = $('.modal .username').val()
      let theme = $('.modal__theme-select :selected').val()
      $.post({
          url: `/api/${username}/create`,
          dataType: 'json',
          data: { theme }
        },
        (response) =>  window.location.href = `/@${username}`
      )
  },

  loadNewsLinks(){
    const query = { tag: 'finallynetwork', limit: 5 }
    steem.api.getDiscussionsByBlog(query, (err, result) => {
      if (err === null) this.loopNewsResults(result)
    })
  },

  loopNewsResults(posts){
      posts.forEach( post => this.displayNewsLink(post) )
  },

  displayNewsLink(post) {
    const template = `
    <li class="landing__news__li">
      <a class="landing__news__link" href="/blog/${post.permlink}"> ${post.title}</a>
    </li>`
    $('.landing__news ul').append(template)
  },

  loadRecentPosts(){
    const query = { tag: 'finallynetwork', limit: 5 }
    steem.api.getDiscussionsByBlog(query, (err, result) => {
      if (err === null) this.displaySinglePost(result)
    })
  },

  displaySinglePost(posts){
    const permlink = $('main').data('permlink')
    const post = posts.filter(post => post.permlink === permlink)[0]
    const template = this.singlePostTemplate(post)
    $('main').append(template)
    this.appendSinglePostComments(post)
  },

  singlePostTemplate(post){
    var converter = new showdown.Converter();
    var html = purify.sanitize(converter.makeHtml(post.body))
    return `<h1>${post.title}</h1>${html}`
  },

  appendSinglePostComments(postData) {
    $('main').append(
    `<section class="post__comments"
    data-id="https://steemit.com/${postData.category}/@${postData.author}/${postData.permlink}"
    data-reputation="false"
    data-values="false"
    data-profile="false"
    data-generated="false"
    data-beneficiary="finallycomments"
    data-beneficiaryWeight="25"
    data-guestComments="false">
    </section>`)
      finallycomments.loadEmbed('.post__comments')
  },

  unlockAction(e) {
    e.preventDefault();
    const username = $('.dashboard').data('username')
    const val = $('.dashboard__input--unlock-amount').val()
    const steem = val === '' ? 1 : parseFloat(val)
    const transferUrl = `https://steemconnect.com/sign/transfer?from=${username}&to=finallynetwork&amount=${steem.toFixed(3)}%20STEEM&memo=unlock`
    const transferWindow = window.open(transferUrl,'Steemconnect Transfer','height=700,width=600');
    if (window.focus) transferWindow.focus();
  }

}

app.init()
