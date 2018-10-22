import "../../node_modules/normalize.css/normalize.css";
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
    return `<header class="blog-header">
      <h1 class="blog-header__title">${critday.username} Portfolio.</h1>
    </header>`
  },

  blogFeedTemplate(){
    let data = $('main').data('theme-data')

      return `
      <section class="blog-feed"></section>
      <section class="details">
        <h3 class="details__item">
          <span class="details__title">Name</span> ${data.name}</h3>
        <h3 class="details__item">
          <span class="details__title">Instagram</span> <a href="https://instagram.com/@${data.instagram}">${data.instagram}</a></h3>
        <h3 class="details__item">
          <span class="details__title">Course-year</span> ${data['course-year']}</h3>
        <h3 class="details__item">
          <span class="details__title">Project</span> ${data['project-name']}</h3>
        <h3 class="details__item">
          <span class="details__title">Site</span> ${data.site}</h3>
        <h3 class="details__item">
          <span class="details__title">University</span> ${data['university-name']}</h3>
        <h3 class="details__item">
          <span class="details__title">Tutor</span> ${data.tutor}</h3>
        <p class="details__item">${data.bio}</p>
      </section>
      `
  },

  blogFeedItemTemplate(post, featureImageSrc, tags, excerpt){
    const resteem = util.isResteem(critday.username, post) ? '' : `RESTEEM @${post.author} : `
    const link = util.getPostLink(critday.username, post)

    return `<div class="feed-item">
      <div class="feed-item__feature" style="background-image: url(https://steemitimages.com/500x500/${featureImageSrc})">
        <div class="feed-item__overlay"></div>
        <h2 class="feed-item__title">
          <a class="feed-item__link" href="${link}">${resteem} ${post.title}</a>
        </h2>
      </div>
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
