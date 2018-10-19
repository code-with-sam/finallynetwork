import "./../scss/make-theme.scss"

import $ from 'jquery'
import moment from 'moment'
import f from './modules/finally-core'
import util from './modules/finally-util'

const make = {
  username: $('main').data('username'),
  navigation: $('main').data('navigation'),

  init() {
    f.init(
      'make',
      make.blogHeaderTemplate,
      make.blogFeedTemplate,
      make.blogFeedItemTemplate,
      make.singlePageTemplate )
  },

  blogHeaderTemplate(profile, navigation){
    const navigationLinks = navigation
      .map(nav => `<a href="#${nav}" class="nav__link" data-tag="${nav}">#${nav}</a>`)
      .join('')

    const navbar = navigation[0] === '' ? '' : `<nav class="nav">
      ${navigationLinks}
    </nav>`

    const avatar  = util.getSteemProfileImage(make.username)

    return `<header class="header">
      <section class="header__title">
        <img class="header__avatar" src="${avatar}" width="120" height="120">
      </section>
    </header>
    <section class="header__tagline"><h2>${profile.about}</h2></section>
    ${navbar}`
  },

  blogFeedTemplate(){
      return `
      <section class="blog-feed"></section>
      <section class="more-posts">
        <a class="load-more-posts" href="#">Load More Posts</a>
      </section>
      `
  },

  blogFeedItemTemplate(post, featureImageSrc, tags, excerpt){
    const resteem = util.isResteem(make.username, post) ? '' : `RESTEEM @${post.author} : `
    const link = util.getPostLink(make.username, post)

    return `
    <div class="blog-feed__item">
      <a class="feed-item__feature" href="${link}">
        <div class="feed-item__overlay">
          <h3 class="feed-item__overlay-title">Read More</h3>
        </div>
        <img src="https://steemitimages.com/900x500/${featureImageSrc}">
      </a>
      <div class="feed-item__tags">${tags}</div>
      <h2 class="feed-item__title"><a href="${link}"">${resteem} ${post.title}</a></h2>
      <div class="feed-item__excerpt">${excerpt}</div>
      <div class="feed-item__interactions">
        <img class="feed-item__heart" src="/img/heart.svg" width="25" height="25">
        <span class="feed-item__votes">${post.net_votes}</span>
      </div>
    </div>`
  },

  singlePageTemplate(post, html){
    const resteem = util.isResteem(make.username, post) ? '' : `<h3 class="content__subtitle">RESTEEM @${post.author}</h3>`

    return `
    <section class="content">
      ${resteem}
      <h2 class="content__title">${post.title}</h2>
      ${html}
    </section>`
  }

}

make.init()
