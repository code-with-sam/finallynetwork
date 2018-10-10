import $ from 'jquery'
import moment from 'moment'

import f from './modules/finally-core'


const make = {
  username: $('main').data('username'),
  navigation: $('main').data('navigation'),

  init() {
    f.init(
      'make',
      make.blogFeedTemplate,
      make.blogFeedItemTemplate,
      make.singlePageTemplate )
  },

  blogFeedTemplate(profile, navigation){
      console.log('nav', navigation)
      const navigationHTML = navigation
        .map(nav => `<a href="#${nav}" class="nav__link" data-tag="${nav}">#${nav}</a>`)
        .join('')
      return `
      <header class="header">
        <section class="header__title">
          <img class="header__avatar" src="${profile.profile_image}" width="120" height="120">
        </section>
      </header>
      <section class="header__tagline"><h2>${profile.about}</h2></section>
      <nav class="nav">
        ${navigationHTML}
      </nav>
      <section class="blog-feed"></section>
      <section class="more-posts">
        <a class="load-more-posts" href="#">Load More Posts</a>
      </section>
      `
  },

  blogFeedItemTemplate(post, featureImageSrc, tags, excerpt){
    return `
    <div class="blog-feed__item">
      <a class="feed-item__feature" href="/@${make.username}/${post.permlink}">
        <div class="feed-item__overlay">
          <h3 class="feed-item__overlay-title">Read More</h3>
        </div>
        <img src="${featureImageSrc}">
      </a>
      <div class="feed-item__tags">${tags}</div>
      <h2 class="feed-item__title"><a href="/@${make.username}/${post.permlink}"> ${post.title}</a></h2>
      <div class="feed-item__excerpt">${excerpt}</div>
      <div class="feed-item__interactions">
        <img class="feed-item__heart" src="/img/heart.svg" width="25" height="25">
        <span class="feed-item__votes">${post.net_votes}</span>
      </div>
    </div>`
  },

  singlePageTemplate(post, html){
    return `<a href="/@${make.username}/" class="back-btn">⬅</a>
    <h2>${post.title}</h2>
    ${html}`
  }

}

make.init()
