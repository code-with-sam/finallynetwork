// import steem from 'steem'
import $ from 'jquery'
// import showdown from 'showdown'
// import finallycomments from 'finallycomments'
// import purify from 'dompurify'
import moment from 'moment'

import f from './modules/finally-core'


const make = {
  username: $('main').data('username'),
  init() {
    f.init(
      make.blogFeedTemplate,
      make.blogFeedItemTemplate,
      make.singlePageTemplate )
  },

  blogFeedTemplate(){
      return `
      <header><h1>${make.username}</h1></header>
      <section class="blog-feed"></section>
      <section><a class="load-more-posts" href="#">Load More Posts</a></section>
      `
  },

  blogFeedItemTemplate(post){
    return `<div class="blog-feed__item">
      <h2><a href="/@${make.username}/${post.permlink}"> ${post.title}</a></h2>
      <h3>${moment(post.created).format("DD/MM/YY")  } | comments: ${post.children} | votes: ${post.net_votes}</h3>
    </div>`
  },

  singlePageTemplate(post, html){
    return `<a href="/@${make.username}/" class="back-btn">⬅</a>
    <h2>${post.title}</h2>
    ${html}`
  }


}

make.init()
