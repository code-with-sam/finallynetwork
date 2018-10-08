
import steem from 'steem'
import $ from 'jquery'
import showdown from 'showdown'
import finallycomments from 'finallycomments'
import purify from 'dompurify'
import moment from 'moment'


let theme = {
  permlink: $('main').data('permlink'),
  username: $('main').data('username'),
  tag: $('main').data('tag'),
  lastPermlink: '',

  init(){
    $('main').addClass('theme-theme')
    theme.uiActions()
    theme.isBlogFeed() ? theme.initBlogFeed(false) : theme.loadSinglePost()
  },

  uiActions() {
    $('main').on('click','.load-more-posts', (e) => {
      e.preventDefault()
      theme.loadUserPosts(true)
    })
  },

  isBlogFeed(){
    return $('main').hasClass('profile')
  },

  async loadSinglePost(){
    finallycomments.init()
    const postData = await steem.api.getContentAsync(theme.username, theme.permlink)
    theme.appendSingePostContent(postData)
    theme.appendSinglePostComments(postData)
  },

  appendSingePostContent(post) {
    var converter = new showdown.Converter();
    var html = purify.sanitize(converter.makeHtml(post.body))
    let template = theme.singlePageTemplate(post, html)
    $('main').append(template)
  },

  appendSinglePostComments(postData) {
    $('main').append(
    `<section class="post__comments"
    data-id="https://steemit.com/${postData.category}/@${postData.author}/${theme.permlink}"
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
    $('main').append(theme.blogFeedTemplate())
    theme.loadUserPosts(false)
  },

  loadUserPosts(loadMore) {
    let query = { tag: theme.username, limit: 15 }
    if(loadMore) {
    query = { tag: theme.username, limit: 10, start_author: theme.username,
      start_permlink: theme.lastPermlink }
    }
    steem.api.getDiscussionsByBlog(query, (err, result) => {
      result = theme.filterOutResteems(result, theme.username)
      let posts = theme.tag !== '' ? theme.filterByTag(result, theme.tag) : result
      if (err === null) theme.loopUserPosts(loadMore, posts)
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
      theme.lastPermlink = posts[posts.length -1].permlink
      if (posts.length < 10) $('.load-more-posts').remove()
      for (var i = 0; i < posts.length; i++) {
        if(loadMore && i === 0) continue
        theme.appendPostItem(posts[i])
      }
  },

  appendPostItem(post){
    let template = theme.blogFeedItemTemplate(post)
    $('.blog-feed').append(template)
  }
}

module.exports.init = (blogFeedTemplate, blogFeedItemTemplate, singlePageTemplate) => {
  theme.blogFeedTemplate = blogFeedTemplate
  theme.blogFeedItemTemplate = blogFeedItemTemplate
  theme.singlePageTemplate = singlePageTemplate
  theme.init()
}
