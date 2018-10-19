import "./../scss/lens-theme.scss"

import steem from 'steem'
import $ from 'jquery'
import showdown from 'showdown'
import inview from 'jquery-inview'
import finallycomments from 'finallycomments'
import purify from 'dompurify'
import beta from './modules/finally-try'
import util from './modules/finally-util'
beta.init()

const Masonry = require('masonry-layout')
const USERNAME = $('main').data('username');
$('main').append(`<header class="header"><h1 class="header__title">${USERNAME}</h1></header><section class="gallery"></section><section class="overlay"><div class="overlay__content"></div><div class="overlay__faq"></div><div class="overlay__bg"></div></section>`)

const TAG = $('main').data('tag');
let query = { 'tag': USERNAME, 'limit': 15 }
let converter = new showdown.Converter({ tables: true })
let allContent = []
let allUsers = []
let msnry, lastTop;
let $gallery = $('.gallery')
let showRestems = $('main').data('show-resteems')


getBlog(query, true)

$('.gallery').on('click', '.item', (e) => {
    loadPost(e.currentTarget)
})

$('.overlay__bg').on('click', () => {
  $('body').removeClass('noscroll')
  $(window).scrollTop( lastTop );
  $('.overlay, .overlay__bg, .overlay__content, .overlay__faq .overlay__photographers').removeClass('overlay--active')
})


function getBlog(query, initial, callback){
  steem.api.getDiscussionsByBlog(query, (err, result) => {
    if (err) console.log(err)
    result = showRestems ? result : util.filterOutResteems(result, USERNAME)
    let photos = TAG !== '' ? util.filterByTag(result, TAG) : result
    displayImages(photos, initial, initial ? false : callback)
  });
}

function getMoreContent(){
  let lastItem = allContent[allContent.length - 1]
  let query = {
      'tag': USERNAME,
      'limit': 24,
      start_author: lastItem.author,
      start_permlink: lastItem.permlink }

      let callback = (items) => {
          items.forEach((item) => {
              let $item = $(item)
              $gallery.append($item)

              $item.children('img').on('load', (e) => {
                $(e.currentTarget).parent().removeClass('hidden')
                msnry.appended($(e.currentTarget).parent())
              })
          })
          setInfiniteScrollPoint()
      }
      getBlog(query, false, callback)
}

function displayImages(result, initialLoad, callback){
  let items = []
  for (let i = 0; i < result.length ; i++) {
      let post = result[i];

      let image = util.generatePostFeatureImage(post)

      allContent.push(post);

      let itemTemplate = `
        <div class="item hidden" data-url="${post.url}" data-permlink="${ post.permlink }">
          <img class="item__image " src="https://steemitimages.com/480x768/${image}" onerror="this.src='http://placehold.it/500x500&text=error'">
          <div class="item__photographer">
            <span>@${post.author}</span>
          </div>
          <div class="item__like">
            <span class="item__heart">♥</span>
            <span class="item__heart-count">${post.net_votes}</span>
          </div>
          <div class="item__overlay"></div>
        </div>
        `
      items.push(itemTemplate)
  }
  if(initialLoad){
    checkImages(items)
  } else {
    items.shift()
    callback(items)
  }
}

function checkImages(items){

  items.forEach((item) => {
    $gallery.append(item);
  })

  let images = $('img.item__image');
  let loaded = 0;

  images.on('load',() => {
    loaded++;
    if (loaded == images.length )
        initMasonry(images)
  });
}

function initMasonry(images){
  images.parent().removeClass('hidden')

  if( $('.gallery').data('masonry') ) msnry('destroy')

  msnry = new Masonry('.gallery', {
    itemSelector: '.item',
    columnWidth: '.item',
    gutter: 16,
    percentPosition: true
  });
  setInfiniteScrollPoint()
}

function setInfiniteScrollPoint(){
  $('.item').last().on('inview', function(event, isInView) {
    if (isInView) {
      getMoreContent()
      $('.item').last().off('inview')
    }
  });
}

function loadPost(item) {
  let post = $(item).data()
  let rawPost = allContent.filter( x  => x.permlink === post.permlink )[0]
  let allCopy = allUsers.map(x => Object.assign({}, x))
  let user = allCopy.filter( x  => x.name === rawPost.author )[0]
  let html = util.generateSinglePostHtml(rawPost)
  html = html.replace('<p><br></p>', '')
  html = html.replace('<p></p>', '')

  lastTop = $(window).scrollTop();

  $('body').addClass( 'noscroll' ).css( { top: -lastTop } )

  let tags = JSON.parse(rawPost.json_metadata).tags.reduce( (all,tag) => all + `<span>${tag}</span>`, '')
  let header = `
  <div class="overlay__mata cf">
    <div class="overlay__tags">${tags}</div>
  </div>
    <h1 class="overlay__title title">${rawPost.title}</h1>
    <hr class="overlay__border">
  `
  let comments = `<section class="finally-comments" data-id="https://steemit.com/${post.url}" data-reputation="true" data-values="true" data-profile="true" data-generated=false></section>`
  $('.overlay__content').empty()
  $('.overlay__content').append(header + html + comments)
  $('.overlay, .overlay__bg, .overlay__content').addClass('overlay--active')

  finallyComments.init()
  $('.overlay').scrollTop(0)
}
