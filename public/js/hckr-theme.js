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
    const postData = await steem.api.getContentAsync(hckr.username, hckr.permlink)
    hckr.appendSingePostContent(postData)
    // finallycomments.init()
    // finallycomments.loadEmbed('.single-post__finally-comments')
  },

  appendSingePostContent(post) {
    var converter = new showdown.Converter();
    // var html = purify.sanitize(converter.makeHtml(post.body))
    var html = converter.makeHtml(post.body)
    let template = `<h2>${post.title}</h2>${html}`
    $('main').append(template)
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
    return `<div>
      <h2><a href="@${hckr.username}/${post.permlink}"> ${post.title}</a></h2>
      <h3>${moment(post.created).format("DD/MM/YY")  } | comments: ${post.children} | votes: ${post.net_votes}</h3>
    </div>`
  }

}

hckr.init()
