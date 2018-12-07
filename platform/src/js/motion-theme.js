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
    return `<header><h1 class="blog-title">@${motion.username}</h1></header>`
  },

  blogFeedTemplate(){
      return `
      <section class="blog-feed"></section>
      <section><a class="load-more-posts" href="#">More Videos</a></section>
      `
  },

  blogFeedItemTemplate(post, featureImageSrc, tags, excerpt){
    const resteem = util.isResteem(motion.username, post) ? '' : `RESTEEM @${post.author} : `
    const link = util.getPostLink(motion.username, post)
    const dtubePermlink = JSON.parse(post.json_metadata).video.info.permlink

    return `<div class="blog-feed__item">
        <div class="blog-feed__item-feature"
          style="background-image: url(${featureImageSrc});"
          data-video="${dtubePermlink}"
          data-username="${post.author}">
           <img class="item-feature__play" src="/img/motion-play.png">
        </div>
        <h2 class="blog-feed__item-title">${post.title}</h2> 
    </div>`
  },

  singlePageTemplate(post, html){
    const resteem = util.isResteem(motion.username, post) ? '' : `RESTEEM @${post.author} : `
    return `<a href="/@${motion.username}/" class="back-btn">⬅</a>
    <h2>${resteem}${post.title}</h2>

    ${html}`
  },

  additionalTemplate(){
    return `<section>
      <div class="overlay-bg"></div>
      <div class="overlay">
        <iframe id="video-frame" width="854" height="480" src="" allowfullscreen></iframe>
      </div>
    </section>`
  },

  setVideoDimentions(){
    if (window.innerWidth <= 850) {
      $('#video-frame').width(window.innerWidth * 0.85)
      $('#video-frame').height( ((window.innerWidth * 0.85)/16)*9 )
    }
  },

  setVideoFrameActions(){
    if (window.innerWidth <= 850) motion.setVideoDimentions()

    $('#video-frame').on('load', () => {
      $('.overlay-bg').fadeIn()
      setTimeout(()=> {
        $('.overlay').fadeIn()
      }, 400)
    });

    $( window ).resize(function() {
      motion.setVideoDimentions()
    });

    $('body').on('click', '.blog-feed__item-feature', (e) => {
      const permlink = $(e.currentTarget).data('video')
      const username = $(e.currentTarget).data('username')
      $('#video-frame').attr('src', `https://emb.d.tube/#!/${username}/${permlink}/true`)
    })
  },

  themeActions() {
    $('main').append(motion.additionalTemplate())
    motion.setVideoFrameActions()
  }

}

motion.init()
motion.themeActions()
