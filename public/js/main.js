let page;

if($('main').hasClass('profile') ) {
  page = 'profile'
  loadUserPosts(false)
} else {
  page = 'single'
  loadSinglePost()
}

function loadUserPosts(loadMore) {
  const username = $('main').data('username')
  let query = { tag: username, limit: 10 }
  const listPosts = (posts) => {
    if (posts.length < 10) $('.load-more-posts').remove()
    for (var i = 0; i < posts.length; i++) {
      if(loadMore && i === 0) continue
      let template = `<div>
        <h2><a href="@${username}/${posts[i].permlink}" target="_blank"> ${posts[i].title}</a></h2>
        <h3>${moment(posts[i].created).format("DD/MM/YY")  } | comments: ${posts[i].children} | votes: ${posts[i].net_votes}</h3>
      </div>`
      $('main').append(template)
    }
  }
  if(loadMore) {
  query = { tag: username, limit: 10, start_author: username,
    start_permlink: $('tr').last().data('permlink') }
  }
  steem.api.getDiscussionsByBlog(query, (err, result) => {
    console.log(result)
    if (err === null) listPosts(result)
  })
}

async function loadSinglePost(){
  const permlink = $('main').data('permlink')
  const username = $('main').data('username')
  const postData = await steem.api.getContentAsync(username, permlink)
  appendSingePostContent(postData)
  // finallycomments.init()
  // finallycomments.loadEmbed('.single-post__finally-comments')
}

function appendSingePostContent(post) {
  var converter = new showdown.Converter();
  // var html = purify.sanitize(converter.makeHtml(post.body))
  var html = converter.makeHtml(post.body)
  let template = `<h2>${post.title}</h2>${html}`
  $('main').append(template)
}
