
import steem from 'steem'
import $ from 'jquery'
import showdown from 'showdown'
import finallycomments from 'finallycomments'
import purify from 'dompurify'
import moment from 'moment'


const hckr = {
  permlink: $('main').data('permlink'),
  username: $('main').data('username'),
  lastPermlink: '',

  init(){
    $('main').addClass('hckr-theme')
    hckr.uiActions()
    hckr.isBlogFeed() ? hckr.initBlogFeed(false) : hckr.loadSinglePost()

  },

  uiActions() {
    $('main').on('click','.load-more-posts', (e) => {
      e.preventDefault()
      hckr.loadUserPosts(true)
    })
  },

  isBlogFeed(){
    return $('main').hasClass('profile')
  },

  async loadSinglePost(){
    finallycomments.init()
    const postData = await steem.api.getContentAsync(hckr.username, hckr.permlink)
    hckr.appendSingePostContent(postData)
    hckr.appendSinglePostComments(postData)
  },

  appendSingePostContent(post) {
    var converter = new showdown.Converter();
    var html = purify.sanitize(converter.makeHtml(post.body))
    let template = `<a href="/@${hckr.username}/" class="back-btn">⬅</a><h2>${post.title}</h2>${html}`
    $('main').append(template)
  },

  appendSinglePostComments(postData) {
    $('main').append(
    `<section class="post__comments"
    data-id="https://steemit.com/${postData.category}/@${postData.author}/${hckr.permlink}"
    data-reputation="false"
    data-values="false"
    data-profile="false"
    data-generated="false"
    data-beneficiary="finallycomments"
    data-beneficiaryWeight="25"
    data-guestComments="false">
    </section>`)
      finallycomments.loadEmbed('.post__comments')
  },

  initBlogFeed(){
    $('main').append(hckr.blogFeedTemplate())
    hckr.loadUserPosts(false)
  },

  loadUserPosts(loadMore) {
    let query = { tag: hckr.username, limit: 10 }
    if(loadMore) {
    query = { tag: hckr.username, limit: 10, start_author: hckr.username,
      start_permlink: hckr.lastPermlink }
    }
    steem.api.getDiscussionsByBlog(query, (err, result) => {
      console.log(result)
      if (err === null) hckr.loopUserPosts(loadMore, result)
    })
  },

  loopUserPosts(loadMore, posts){
      hckr.lastPermlink = posts[posts.length -1].permlink
      if (posts.length < 10) $('.load-more-posts').remove()
      for (var i = 0; i < posts.length; i++) {
        if(loadMore && i === 0) continue
        hckr.appendPostItem(posts[i])
      }
  },

  appendPostItem(post){
    let template = hckr.blogFeedItemTemplate(post)
    $('.blog-feed').append(template)
  },

  blogFeedTemplate(){
      return `
      <header><h1>${hckr.username}</h1></header>
      <section class="blog-feed"></section>
      <section><a class="load-more-posts" href="#">Load More Posts</a></section>
      `
  },

  blogFeedItemTemplate(post){
    return `<div class="blog-feed__item">
      <h2><a href="/@${hckr.username}/${post.permlink}"> ${post.title}</a></h2>
      <h3>${moment(post.created).format("DD/MM/YY")  } | comments: ${post.children} | votes: ${post.net_votes}</h3>
    </div>`
  }

}

hckr.init()
