import "./../scss/motion-theme.scss"

import $ from 'jquery'
import moment from 'moment'

import f from './modules/finally-core'
import util from './modules/finally-util'

const motion = {
  username: $('main').data('username'),

  init() {
    f.init(
      'motion',
      motion.blogHeaderTemplate,
      motion.blogFeedTemplate,
      motion.blogFeedItemTemplate,
      motion.singlePageTemplate )
  },

  blogHeaderTemplate(profile, navigation){
    return `<header><h1>${motion.username}</h1></header>`
  },

  blogFeedTemplate(){
      return `
      <section class="blog-feed"></section>
      <section><a class="load-more-posts" href="#">Load More Posts</a></section>
      `
  },

  blogFeedItemTemplate(post, featureImageSrc, tags, excerpt){
    const resteem = util.isResteem(motion.username, post) ? '' : `RESTEEM @${post.author} : `
    const link = util.getPostLink(motion.username, post)

    return `<div class="blog-feed__item">
      <h2><a href="${link}">${resteem} ${post.title}</a></h2>
      <h3>${moment(post.created).format("DD/MM/YY")  } | comments: ${post.children} | votes: ${post.net_votes}</h3>
    </div>`
  },

  singlePageTemplate(post, html){
    const resteem = util.isResteem(motion.username, post) ? '' : `RESTEEM @${post.author} : `
    return `<a href="/@${motion.username}/" class="back-btn">⬅</a>
    <h2>${resteem}${post.title}</h2>

    ${html}`
  }


}

motion.init()
