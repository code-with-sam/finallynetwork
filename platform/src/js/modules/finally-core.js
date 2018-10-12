
import steem from 'steem'
import $ from 'jquery'
import showdown from 'showdown'
import finallycomments from 'finallycomments'
import purify from 'dompurify'
import moment from 'moment'
import striptags from 'striptags'
import beta from '../beta.js'

const POST_LIMIT = 15;
const MARKDOWN_SETTINGS = {tables: true}
let USE_BACKGROUND_PHOTO = false;

let theme = {
  permlink: $('main').data('permlink'),
  username: $('main').data('username'),
  name: $('main').data('theme'),
  tag: $('main').data('tag'),
  lastPermlink: '',

  init(){
    beta.init()
    $('main').addClass(`${theme.name}-theme`)
    theme.uiActions()
    theme.isBlogFeed() ? theme.initBlogFeed() : theme.loadSinglePost()
    USE_BACKGROUND_PHOTO = theme.name === 'make'
  },

  uiActions() {
    $('main').on('click','.load-more-posts', (e) => {
      e.preventDefault()
      theme.loadUserPosts(true)
    })
    $('main').on('click','.nav__link', (e) => {
      const tag = $(e.currentTarget).data('tag')
      theme.reloadWithHashtag(tag)
    })
  },
  reloadWithHashtag(tag){
    theme.tag = tag
    $('main').empty()
    theme.initBlogFeed()
  },

  isBlogFeed(){
    return $('main').hasClass('profile')
  },

  async loadSinglePost(){
    finallycomments.init()
    const postData = await steem.api.getContentAsync(theme.username, theme.permlink)
    await theme.appendSingePostContent(postData)
    theme.appendSinglePostComments(postData)
  },

  async appendSingePostContent(post) {
    let html = theme.generateSinglePostHtml(post)
    let userProfile = await theme.getSteemProfile(theme.username)
    let navigation = $('main').data('nav').split(',')
    if(USE_BACKGROUND_PHOTO) theme.setBackgroundData(userProfile)
    $('main').append(theme.blogHeaderTemplate(userProfile, navigation))
    $('main').append(theme.singlePageTemplate(post, html))
  },

  generateSinglePostHtml(post){
    let converter = new showdown.Converter(MARKDOWN_SETTINGS);
    let html = purify.sanitize(converter.makeHtml(post.body))
    const urlInPRegex = /<p>(https?:\/\/[^\s]+)+(\.png|\.jpeg|\.gif|\.jpg)<\/p>/g;
    const urlRegexImagesNonGif = /(https?:\/\/[^\s]+)+(\.png|\.jpeg|\.jpg)/g;
    html = html.replace(urlInPRegex, url => '<img src="' + url.substr(3, url.length-4) + '">')
    html = html.replace(urlRegexImagesNonGif, url => 'https://steemitimages.com/1500x1500/' + url )
    return html
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

  async initBlogFeed(){
    let userProfile = await theme.getSteemProfile(theme.username)
    let navigation = $('main').data('nav').split(',')
    if(USE_BACKGROUND_PHOTO) theme.setBackgroundData(userProfile)
    $('main').append(theme.blogHeaderTemplate(userProfile, navigation))
    $('main').append(theme.blogFeedTemplate())
    theme.loadUserPosts(false)
  },

  setBackgroundData(userProfile){
    $('body').css('background-image', `url(https://steemitimages.com/1500x1500/${userProfile.cover_image})`)
  },

  loadUserPosts(loadMore) {
    let query = { tag: theme.username, limit: POST_LIMIT }
    if(loadMore) {
    query = { tag: theme.username, limit: POST_LIMIT, start_author: theme.username,
      start_permlink: theme.lastPermlink }
    }
    steem.api.getDiscussionsByBlog(query, (err, result) => {
      console.log(result)
      let resultLessResteems = theme.filterOutResteems(result, theme.username)
      let posts = theme.tag !== '' ? theme.filterByTag(resultLessResteems, theme.tag) : resultLessResteems
      if (err === null) theme.loopUserPosts(loadMore, posts, result.length)
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

  loopUserPosts(loadMore, posts, resultTotal){
      if (theme.lastPermlink == posts[posts.length -1].permlink) $('.load-more-posts').remove()
      theme.lastPermlink = posts[posts.length -1].permlink
      if (resultTotal < POST_LIMIT) $('.load-more-posts').remove()
      for (var i = 0; i < posts.length; i++) {
        if(loadMore && i === 0) continue
        theme.appendPostItem(posts[i])
      }
  },

  appendPostItem(post){
    const tags = theme.getPostTags(post)
    const excerpt = theme.getPostExcerpt(post)
    const featureImageSrc = theme.generatePostFeatureImage(post)
    const template = theme.blogFeedItemTemplate(post, featureImageSrc, tags, excerpt)
    $('.blog-feed').append(template)
  },

  getPostTags(post){
    const tags = JSON.parse(post.json_metadata).tags
    return tags.map( t => `<span class="tag">${t}</span>`).join(' ')
  },

  getPostExcerpt(post){
    const converter = new showdown.Converter(MARKDOWN_SETTINGS);
    let placeholder = document.createElement('div');
    placeholder.innerHTML = purify.sanitize(converter.makeHtml(post.body))
    placeholder = placeholder.querySelector('p').innerHTML;
    return striptags(placeholder)
  },


  generatePostFeatureImage(post){
    let image
    if( typeof JSON.parse(post.json_metadata).image === 'undefined' ){
      const converter = new showdown.Converter(MARKDOWN_SETTINGS);
      const placeholder = document.createElement('div');
      placeholder.innerHTML = purify.sanitize(converter.makeHtml(post.body))
      let image = placeholder.querySelector('img');
      return image ? image.src : '';
    } else {
      image = JSON.parse(post.json_metadata).image[0]
    }
    return image;
  },

  async getSteemProfile(username){
    let account = await steem.api.getAccountsAsync([username])
    return JSON.parse(account[0].json_metadata).profile
  }

}

module.exports.init = (name, blogHeaderTemplate, blogFeedTemplate, blogFeedItemTemplate, singlePageTemplate) => {
  theme.name = name
  theme.blogHeaderTemplate = blogHeaderTemplate
  theme.blogFeedTemplate = blogFeedTemplate
  theme.blogFeedItemTemplate = blogFeedItemTemplate
  theme.singlePageTemplate = singlePageTemplate
  theme.init()
}
