import $ from 'jquery'
import moment from 'moment'

import f from './modules/finally-core'

const hckr = {
  username: $('main').data('username'),

  init() {
    f.init(
      'hckr',
      hckr.blogFeedTemplate,
      hckr.blogFeedItemTemplate,
      hckr.singlePageTemplate )
  },

  blogFeedTemplate(){
      return `
      <header><h1>${hckr.username}</h1></header>
      <section class="blog-feed"></section>
      <section><a class="load-more-posts" href="#">Load More Posts</a></section>
      `
  },

  blogFeedItemTemplate(post){
    return `<div class="blog-feed__item">
      <h2><a href="/@${hckr.username}/${post.permlink}"> ${post.title}</a></h2>
      <h3>${moment(post.created).format("DD/MM/YY")  } | comments: ${post.children} | votes: ${post.net_votes}</h3>
    </div>`
  },

  singlePageTemplate(post, html){
    return `<a href="/@${hckr.username}/" class="back-btn">⬅</a>
    <h2>${post.title}</h2>
    ${html}`
  }


}

hckr.init()
