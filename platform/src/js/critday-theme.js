import "./../scss/critday-theme.scss"

import $ from 'jquery'
import moment from 'moment'

import f from './modules/finally-core'
import util from './modules/finally-util'

const critday = {
  username: $('main').data('username'),

  init() {
    f.init(
      'critday',
      critday.blogHeaderTemplate,
      critday.blogFeedTemplate,
      critday.blogFeedItemTemplate,
      critday.singlePageTemplate )
  },

  blogHeaderTemplate(profile, navigation){
    return `<header><h1>${critday.username} Portfolio</h1></header>`
  },

  blogFeedTemplate(){
      return `
      <section class="blog-feed"></section>
      <section><a class="load-more-posts" href="#">Load More Posts</a></section>
      `
  },

  blogFeedItemTemplate(post, featureImageSrc, tags, excerpt){
    const resteem = util.isResteem(critday.username, post) ? '' : `RESTEEM @${post.author} : `
    const link = util.getPostLink(critday.username, post)

    return `<div class="feed-item">
      <div class="feed-item__feature" style="background-image: url(https://steemitimages.com/500x500/${featureImageSrc})"></div>
      <h2><a href="${link}">${resteem} ${post.title}</a></h2>
    </div>`
  },

  singlePageTemplate(post, html){
    const resteem = util.isResteem(critday.username, post) ? '' : `RESTEEM @${post.author} : `
    return `<a href="/@${critday.username}/" class="back-btn">⬅</a>
    <h2>${resteem}${post.title}</h2>

    ${html}`
  }


}

critday.init()
