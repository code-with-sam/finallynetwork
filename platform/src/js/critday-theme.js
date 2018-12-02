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
          <span class="details__title">Name</span> ${data.critdayName}</h3>
        <h3 class="details__item">
          <span class="details__title">Instagram</span> <a href="https://instagram.com/@${data.critdayInstagram}">@${data.critdayInstagram}</a></h3>
        <h3 class="details__item">
          <span class="details__title">Course-year</span> ${data.critdayCourse}</h3>
        <h3 class="details__item">
          <span class="details__title">Project</span> ${data.critdayProject}</h3>
        <h3 class="details__item">
          <span class="details__title">Site</span> ${data.critdaySite}</h3>
        <h3 class="details__item">
          <span class="details__title">University</span> ${data.critdayUniversity}</h3>
        <h3 class="details__item">
          <span class="details__title">Tutor</span> ${data.critdayTutor}</h3>
        <p class="details__item">${data.critdayBio}</p>
      </section>
      `
  },

  blogFeedItemTemplate(post, featureImageSrc, tags, excerpt){
    const resteem = util.isResteem(critday.username, post) ? '' : `RESTEEM @${post.author} : `
    const link = util.getPostLink(critday.username, post)

    return `<a class="feed-item" href="${link}">
        <div class="feed-item__feature" style="background-image: url(https://steemitimages.com/500x500/${featureImageSrc})">
          <div class="feed-item__overlay"></div>
          <h2 class="feed-item__title">
            <span class="feed-item__title-detail">${post.title}</span>
          </h2>
        </div>
      </a>`
  },

  singlePageTemplate(post, html){
    const resteem = util.isResteem(critday.username, post) ? '' : `RESTEEM @${post.author} : `
    return `<a href="/@${critday.username}/" class="back-btn">⬅</a>
    ${html}`
  }


}

critday.init()
