import "./../scss/motion-theme.scss"

import $ from 'jquery'
import moment from 'moment'
import finallycomments from 'finallycomments'

import f from './modules/finally-core'
import util from './modules/finally-util'

const motion = {
  username: $('main').data('username'),
  themeData: $('main').data('theme-data'),

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
  enableOverlay(e) {
    const permlink = $(e.currentTarget).data('video')
    const username = $(e.currentTarget).data('username')
    const category = $(e.currentTarget).data('category')
    $('#video-frame').attr('src', `https://emb.d.tube/#!/${username}/${permlink}/true`)
    $('.overlay').width($('#video-frame').width())
    
    if(motion.themeData.motionShowComments){
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
    }
  },
  clearOverlay(){
    $('.overlay, .overlay-bg, .overlay-container').fadeOut()
    $('#video-frame').attr('src', '')
    $('post__comments').remove()
  },
  videoOnLoad() {
    if ($('#video-frame').attr('src') === '') return
    $('.overlay-container').fadeIn()
    setTimeout(()=> {
      $('.overlay').fadeIn()
    }, 400)
  },

  themeActions() {
    // add non standard templates (those not used on every theme) to the HTML 
    $('main').append(motion.additionalTemplate())
    //init actions related to non standard html
    if (window.innerWidth <= 850) motion.setVideoDimentions()
    $('#video-frame').on('load', () => motion.videoOnLoad());
    $( window ).resize(() => motion.setVideoDimentions());
    $('body').on('click', '.overlay-bg', (e) => motion.clearOverlay() )
    $('body').on('click', '.blog-feed__item-feature', (e) => motion.enableOverlay(e))
    // include finally comments if setting in dashboard is enabled
    if(motion.themeData.motionShowComments) finallycomments.init()
  }

}

motion.init()
motion.themeActions()
