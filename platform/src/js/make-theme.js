import $ from 'jquery'
import moment from 'moment'

import f from './modules/finally-core'


const make = {
  username: $('main').data('username'),

  init() {
    f.init(
      'make',
      make.blogFeedTemplate,
      make.blogFeedItemTemplate,
      make.singlePageTemplate )
  },

  blogFeedTemplate(){
      return `
      <header class="header">
        <section class="header__social">
          <span class="header__social-icon"><a href=""><img src="http://placehold.it/40x40"></a></span>
          <span class="header__social-icon"><a href=""><img src="http://placehold.it/40x40"></a></span>
          <span class="header__social-icon"><a href=""><img src="http://placehold.it/40x40"></a></span>
          <span class="header__social-icon"><a href=""><img src="http://placehold.it/40x40"></a></span>
        </section>
        <section class="header__title">
          <img class="header__avatar" src="http://placehold.it/150x150">
        </section>
        <section class="header__mail">
          <span class="header__social-icon"><a href=""><img src="http://placehold.it/40x40"></a></span>
        </section>
      </header>
      <section class="header__tagline"><h2>BECAUSE FOOD TASTES BETTER WITH MORE FOOD...</h2></section>
      <nav class="nav">
        <a class="nav__link">LINK ONE</a>
        <a class="nav__link">LINK TWO</a>
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
      <h3>${post.net_votes}</h3>
    </div>`
  },

  singlePageTemplate(post, html){
    return `<a href="/@${make.username}/" class="back-btn">⬅</a>
    <h2>${post.title}</h2>
    ${html}`
  }

}

make.init()
