import "../../node_modules/bootstrap/dist/css/bootstrap.css";
import "./../scss/campfire-theme.scss";

import steem from 'steem'
import $ from 'jquery'
import showdown from 'showdown'
import purify from 'dompurify'
import finallycomments from 'finallycomments'
import beta from './modules/finally-try'
beta.init()

const converter = new showdown.Converter({ tables: true })
const showRestems = $('main').data('show-resteems')

let page;

if($('main').hasClass('profile') ) {
  let template= `
  <div class="container full-container full">
      <div class="row full">
      </div>
  </div>`
  $('main').append(template)
  loadUserPosts(false)
} else {
  loadSinglePost()
}

async function loadUserPosts(loadMore) {
  const username = $('main').data('username')
  const profileImage = await getSteemProfileImage(username)
  const TAG = $('main').data('tag');

  let query = { tag: username, limit: 15 }
  const listPosts = (posts) => {
    if (posts.length < 10) $('.load-more-posts').remove()
    for (var i = 0; i < posts.length; i++) {
      if(loadMore && i === 0) continue
      let image;

      if( typeof JSON.parse(posts[i].json_metadata).image === 'undefined' ){
        posts[i].body = replaceMarkdownImagesWithHtml(posts[i].body)
        image = genImageInHTML(posts[i].body)
      } else {
        image = JSON.parse(posts[i].json_metadata).image[0]
      }


      let templateFirst = `<div class="col-sm-12 hero" style="background-image:  url(${image})">
                    <div class="overlay">
                            <h1 class="animated fadeIn delay-2">
                            <a href="/@${username}/${posts[i].permlink}"> ${posts[i].title}</a>
                            </h1>
                            <p class="hero__content animated fadeIn delay-2">${generateExcerpt(posts[i].body)}...</p>
                            <img src="${profileImage}" alt="{$username}"class="hero__content__avatar animated fadeIn delay-2">
                        <p class="hero__content post-preview__meta animated fadeIn delay-2">Posted by ${username} in ${posts[i].category}</p>
                    </div>
                </div>`
      let templateGeneral = `
      <div class="col-sm-6 col-md-4 col-lg-3 post-preview" style="background-image: url(${image})">
          <div class="overlay">
              <div class="post-preview__info animated fadeInUp delay-3">
                  <div class="inner">
                      <h2><a href="/@${username}/${posts[i].permlink}"> ${posts[i].title}</a></h2>
                      <p class="post-preview__meta">Posted in ${posts[i].category}</p>
                  </div>
              </div>
          </div>
      </div>`
      let template = i == 0 ? templateFirst : templateGeneral
      $('main .container .row').append(template)
    }
  }
  if(loadMore) {
  query = { tag: username, limit: 10, start_author: username,
    start_permlink: $('tr').last().data('permlink') }
  }
  steem.api.getDiscussionsByBlog(query, (err, result) => {
    result = showRestems ? result : filterOutResteems(result, username)
    let posts = TAG !== '' ? filterByTag(result, TAG) : result
    if (err === null) listPosts(posts)
  })
}

function filterOutResteems(posts, username){
  return posts.filter(post => post.author === username)
}

function filterByTag(posts, tag){
  return posts.filter(post => {
    let tags = JSON.parse(post.json_metadata).tags
    if( tags.includes(tag) || post.parent_permlink === tag ) return post
  })
}

// Create an array of all posts
// used for prev/next posts
async function digPosts(username, permlink, more, postList){
  let currentResult;
  if(more){
    currentResult = await steem.api.getDiscussionsByBlogAsync({ tag: username, limit: 20, start_author: username,
      start_permlink: postList[postList.length -1].permlink })
  } else {
    currentResult = await steem.api.getDiscussionsByBlogAsync({ tag: username, limit: 20 })
  }
  if(more) currentResult.shift()
  postList = postList.concat(currentResult)
  const postPermlinks = postList.map( post => post.permlink )
  let index = postPermlinks.indexOf(permlink)
  if (index > -1 && index < postList.length - 1){
    return postList
  } else {
    if( more === true && currentResult < 19 ) {
      console.log(postList)
      return postList
    }
    return await digPosts(username, permlink, true, postList)
  }
}

async function findBeforeAndAfterPosts(username, permlink){
  let posts = await digPosts(username, permlink, false, [])
  let postPermlinks = posts.map( post => post.permlink )
  let index = postPermlinks.indexOf(permlink)
  return {
    before: posts[index+1],
    after: index > 0 ? posts[index-1] : false
  }
}

async function loadSinglePost(){
  const permlink = $('main').data('permlink')
  const username = $('main').data('username')
  const postData = await steem.api.getContentAsync(username, permlink)
  appendSingePostContent(postData)
  appendBeforeAfter(username, permlink)
}

async function appendBeforeAfter(username, permlink){
  const footerPostLinks = await findBeforeAndAfterPosts(username, permlink);
  const beforePost = footerPostLinks.before ? `<div class="col-xs-12 col-sm-5 col-sm-offset-1">
                <a href="/@${footerPostLinks.before.author}/${footerPostLinks.before.permlink}" class="read-more read-more--prev">
                    <section class="post">
                        <h3 class="read-more__subtitle">
                        <i class="chevron chevron-left">
                        <img src="/img/chevron-left.svg">

                        </i>Previous article</h3>
                        <h2 class="read-more__title">${footerPostLinks.before.title}</h2>
                    </section>
                </a>
            </div>` : ''
  const nextPost = footerPostLinks.after ? `<div class="col-xs-12 col-sm-5 ">
                <a href="/@${footerPostLinks.after.author}/${footerPostLinks.after.permlink}" class="read-more read-more--next">
                    <section class="post">
                        <h3 class="read-more__subtitle">Next article<i class="chevron chevron-right"><img src="/img/chevron-right.svg"></i></h3>
                        <h2 class="read-more__title">${footerPostLinks.after.title}</h2>
                    </section>
                </a>
            </div>` : ''

  const template = `
  <section class="post-prev-next">
      <div class="container">
        <div class="row">
        ${beforePost}
        ${nextPost}
        <div>
      </div>
  </section>`
  $('main').append(template)

}

async function appendSingePostContent(post) {
  finallycomments.init()
  const username = $('main').data('username')
  const permlink = $('main').data('permlink')

  var html = purify.sanitize(converter.makeHtml(post.body))
  let image;

  if( typeof JSON.parse(post.json_metadata) === 'undefined' ){
    post.body = replaceMarkdownImagesWithHtml(post.body)
    image = genImageInHTML(post.body)
  } else {
    image = JSON.parse(post.json_metadata).image[0]
  }

  let tags =  JSON.parse(post.json_metadata).tags.slice(0,2)

  let template = `
  <header class="hero-header" style="background-image: url(${image})">
          <div class="overlay hero-header__inner">
              <h1 class="animated fadeIn delay-1">${post.title}</h1>
          </div>
      </div>
      <div class="hero-header__meta">
        <p class="hero-header__tags animated fadeInDown">${tags.join(' &middot; ')}</p>
        <p class="hero-header__author animated fadeInUp">${username}</p>
    </div>
  </header>

  <div class="container">
      <div class="row">
          <div class="col-xs-12 col-md-10 col-md-offset-1 main-content animated fadeIn">
              ${html}
          </div>
      </div>
  </div>`

  $('main').append(template)

  $('.main-content').append(
  `<section class="post__comments"
  data-id="https://steemit.com/${post.category}/@${post.author}/${permlink}"
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

function genImageInHTML(markdown){
    let placeholder = document.createElement('div');
    placeholder.innerHTML = converter.makeHtml(markdown)
    let image = placeholder.querySelector('img');
    return image ? image.src : ''
}

function replaceMarkdownImagesWithHtml(body) {
  var urlRegex = /(https?:\/\/[^\s]+)/g;
  return body.replace(urlRegex, (url) => {
    let last = url.slice(-3)
    if(last === 'jpg' || last === 'png' || last === 'peg' || last === 'gif')  {
      return '<img src="' + url + '">';
    } else {
      return url
    }
  })
}

function generateExcerpt(body){
  let placeholder = document.createElement('div');
  placeholder.innerHTML = converter.makeHtml(body)
  let allParagraphs = placeholder.querySelectorAll('p');
  let firstParagraphWithText = Array.from(allParagraphs).filter(p => p.innerHTML.split(' ').length > 10)[0];
  let excerpt = firstParagraphWithText.innerHTML.split(' ').slice(0, 25).join(' ')
  return excerpt
}

async function getSteemProfileImage(username){
  let profileImage = 'img/default-user.jpg';
  const account = await steem.api.getAccountsAsync([username])
  let profile = {}
  try {
    if (account[0].json_metadata === '' || typeof account[0].json_metadata === 'undefined' ) {
      profile = { profile_image : false }
    } else {
      profile = JSON.parse(account[0].json_metadata).profile
    }
    profileImage = profile.profile_image ? 'https://steemitimages.com/128x128/' + profile.profile_image : '';

  } catch(err){
    console.log(err)
  }
  return profileImage
}
