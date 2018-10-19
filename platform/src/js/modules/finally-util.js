import showdown from 'showdown'
import purify from 'dompurify'
import steem from 'steem'
import striptags from 'striptags'

const MARKDOWN_SETTINGS = {tables: true}
const CONVERTER = new showdown.Converter(MARKDOWN_SETTINGS);

module.exports.getPostLink = (username, post) => {
   return username === post.author ? `/@${username}/${post.permlink}` : `/@${username}/resteem/@${post.author}/${post.permlink}`
}

module.exports.isResteem = (username, post ) => {
  return username === post.author
}

module.exports.generatePostFeatureImage = (post) => {
  let image
  if( typeof JSON.parse(post.json_metadata).image === 'undefined' ){
    const placeholder = document.createElement('div');
    const urlInPRegex = /<p>(https?:\/\/[^\s]+)+(\.png|\.jpeg|\.gif|\.jpg)<\/p>/g;
    placeholder.innerHTML = purify.sanitize(CONVERTER.makeHtml(post.body))
    placeholder.innerHTML = placeholder.innerHTML.replace(urlInPRegex, url => '<img src="' + url.substr(3, url.length-7) + '">' )
    let image = placeholder.querySelector('img');
    return image ? image.src : '';
  } else {
    image = JSON.parse(post.json_metadata).image[0]
  }
  return image;
}


module.exports.filterByTag = (posts, tag) => {
  return posts.filter(post => {
    let tags = JSON.parse(post.json_metadata).tags
    if( tags.includes(tag) || post.parent_permlink === tag ) return post
  })
}

module.exports.filterOutResteems = (posts, username) => {
  return posts.filter(post => post.author === username)
}


// Create an array of all posts
// used for prev/next posts
module.exports.digPosts = async (username, permlink, more, postList) => {
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

module.exports.generateSinglePostHtml = (post) => {
  let html = purify.sanitize(CONVERTER.makeHtml(post.body))
  const urlInPRegex = /<p>(https?:\/\/[^\s]+)+(\.png|\.jpeg|\.gif|\.jpg)<\/p>/g;
  const urlRegexImagesNonGif = /(https?:\/\/[^\s]+)+(\.png|\.jpeg|\.jpg)/g;
  html = html.replace(urlInPRegex, url => '<img src="' + url.substr(3, url.length-7) + '">')
  html = html.replace(urlRegexImagesNonGif, url => 'https://steemitimages.com/1500x1500/' + url )
  return html
}

module.exports.getSteemProfileImage = (username) => {
  return `https://steemitimages.com/u/${username}/avatar`
}

module.exports.getPostExcerpt = (post) => {
  let placeholder = document.createElement('div');
  placeholder.innerHTML = CONVERTER.makeHtml(post.body)
  let allParagraphs = placeholder.querySelectorAll('p');
  let firstParagraphWithText = Array.from(allParagraphs).filter(p => p.innerHTML.split(' ').length > 10)[0];
  let excerpt = firstParagraphWithText.innerHTML.split(' ').slice(0, 50).join(' ').trim()
  excerpt = excerpt.substr(excerpt.length-1, excerpt.length) === '.' ?  excerpt : excerpt + '...'
  return excerpt
}
