
import steem from 'steem'
import $ from 'jquery'
import showdown from 'showdown'
import finallycomments from 'finallycomments'
import purify from 'dompurify'
import moment from 'moment'


module.exports.theme = {
  permlink: $('main').data('permlink'),
  username: $('main').data('username'),
  tag: $('main').data('tag'),
  lastPermlink: '',

  init(){
    $('main').addClass('theme-theme')
    module.exports.theme.uiActions()
    module.exports.theme.isBlogFeed() ? module.exports.theme.initBlogFeed(false) : module.exports.theme.loadSinglePost()
  },

  uiActions() {
    $('main').on('click','.load-more-posts', (e) => {
      e.preventDefault()
      module.exports.theme.loadUserPosts(true)
    })
  },

  isBlogFeed(){
    return $('main').hasClass('profile')
  },

  async loadSinglePost(){
    finallycomments.init()
    const postData = await steem.api.getContentAsync(module.exports.theme.username, module.exports.theme.permlink)
    module.exports.theme.appendSingePostContent(postData)
    module.exports.theme.appendSinglePostComments(postData)
  },

  appendSingePostContent(post) {
    var converter = new showdown.Converter();
    var html = purify.sanitize(converter.makeHtml(post.body))
    let template = `<a href="/@${module.exports.theme.username}/" class="back-btn">⬅</a><h2>${post.title}</h2>${html}`
    $('main').append(template)
  },

  appendSinglePostComments(postData) {
    $('main').append(
    `<section class="post__comments"
    data-id="https://steemit.com/${postData.category}/@${postData.author}/${module.exports.theme.permlink}"
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
    $('main').append(module.exports.theme.blogFeedTemplate())
    module.exports.theme.loadUserPosts(false)
  },

  loadUserPosts(loadMore) {
    let query = { tag: module.exports.theme.username, limit: 15 }
    if(loadMore) {
    query = { tag: module.exports.theme.username, limit: 10, start_author: module.exports.theme.username,
      start_permlink: module.exports.theme.lastPermlink }
    }
    steem.api.getDiscussionsByBlog(query, (err, result) => {
      result = module.exports.theme.filterOutResteems(result, module.exports.theme.username)
      let posts = module.exports.theme.tag !== '' ? module.exports.theme.filterByTag(result, module.exports.theme.tag) : result
      if (err === null) module.exports.theme.loopUserPosts(loadMore, posts)
    })
  },

  filterByTag(posts, tag){
    return posts.filter(post => {
      let tags = JSON.parse(post.json_metadata).tags
      if( tags.includes(tag) || post.parent_permlink === tag ) return post
    })
  },

  filterOutResteems(posts, username){
    return posts.filter(post => post.author === username)
  },

  loopUserPosts(loadMore, posts){
      module.exports.theme.lastPermlink = posts[posts.length -1].permlink
      if (posts.length < 10) $('.load-more-posts').remove()
      for (var i = 0; i < posts.length; i++) {
        if(loadMore && i === 0) continue
        module.exports.theme.appendPostItem(posts[i])
      }
  },

  appendPostItem(post){
    let template = module.exports.theme.blogFeedItemTemplate(post)
    $('.blog-feed').append(template)
  },

  blogFeedTemplate(){
      return `
      <header><h1>${module.exports.theme.username}</h1></header>
      <section class="blog-feed"></section>
      <section><a class="load-more-posts" href="#">Load More Posts</a></section>
      `
  },

  blogFeedItemTemplate(post){
    return `<div class="blog-feed__item">
      <h2><a href="/@${module.exports.theme.username}/${post.permlink}"> ${post.title}</a></h2>
      <h3>${moment(post.created).format("DD/MM/YY")  } | comments: ${post.children} | votes: ${post.net_votes}</h3>
    </div>`
  }

}

// module.exports.theme.init()
