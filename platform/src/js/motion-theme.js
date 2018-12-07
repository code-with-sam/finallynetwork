import "./../scss/motion-theme.scss"

import $ from 'jquery'
import moment from 'moment'
import finallycomments from 'finallycomments'

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
          data-username="${post.author}"
          data-category="${post.parent_permlink}">
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
    return `<section class="overlay-container">
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
      if ($('#video-frame').attr('src') === '') return
      $('.overlay-container').fadeIn()
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
      const category = $(e.currentTarget).data('category')
      $('#video-frame').attr('src', `https://emb.d.tube/#!/${username}/${permlink}/true`)
      $('.overlay').width($('#video-frame').width())
 
      $('.overlay').append(
      `<section class="post__comments"
      data-id="https://steemit.com/${category}/@${username}/${permlink}"
      data-reputation="false"
      data-values="false"
      data-profile="false"
      data-generated="false"
      data-beneficiary="finallycomments"
      data-beneficiaryWeight="25"
      data-guestComments="false">
      </section>`)
      
      finallycomments.loadEmbed('.post__comments')
    })
  },  

  themeActions() {
    $('main').append(motion.additionalTemplate())
    motion.setVideoFrameActions()
    finallycomments.init()

    $('body').on('click', '.overlay-bg', (e) => {
      $('.overlay, .overlay-bg, .overlay-container').fadeOut()
      $('#video-frame').attr('src', '')
    })
  }

}

motion.init()
motion.themeActions()
