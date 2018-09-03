let page;

if($('main').hasClass('profile') ) {
  let template= `
<div class="container full-container full">
    <div class="row full">
    </div>
</div>
`;
  $('main').append(template)
  loadUserPosts(false)

} else {
  loadSinglePost()
}

function loadUserPosts(loadMore) {
  const username = $('main').data('username')
  let query = { tag: username, limit: 9 }
  const listPosts = (posts) => {
    if (posts.length < 10) $('.load-more-posts').remove()
    for (var i = 0; i < posts.length; i++) {
      if(loadMore && i === 0) continue

      if( typeof JSON.parse(posts[i].json_metadata).image === 'undefined' ){
        posts[i].body = replaceMarkdownImagesWithHtml(body)
        image = genImageInHTML(posts[i].body)
      } else {
        image = JSON.parse(posts[i].json_metadata).image[0]
        // image = image.charAt(image.length - 1) === ';' ? image.substring(0,-1) : image
      }

      let templateFirst = `<div class="col-sm-12 hero" style="background-image:  url(${image})">
                    <div class="overlay">
                        <h1 class="animated fadeIn delay-2"><a href="/@${username}/${posts[i].permlink}"> ${posts[i].title}</a></h1>
                            <p class="hero__content animated fadeIn delay-2">{{excerpt words="24"}}</p>
                            <a href="{{url}}"><img src="{{image}}" alt="{{name}}"class="hero__content__avatar animated fadeIn delay-2" alt="{{name}}"></a>
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
  // <div>
  //   <h2><a href="@${username}/${posts[i].permlink}" target="_blank"> ${posts[i].title}</a></h2>
  //   <h3>${moment(posts[i].created).format("DD/MM/YY")  } | comments: ${posts[i].children} | votes: ${posts[i].net_votes}</h3>
  // </div>
  if(loadMore) {
  query = { tag: username, limit: 10, start_author: username,
    start_permlink: $('tr').last().data('permlink') }
  }
  steem.api.getDiscussionsByBlog(query, (err, result) => {
    console.log(result)
    if (err === null) listPosts(result)
  })
}

async function digPosts(username, permlink){
  let posts = await steem.api.getDiscussionsByBlogAsync({ tag: username, limit: 20 })
  let postPermlinks = posts.map( post => post.permlink )
  let index = postPermlinks.indexOf(permlink)
  if (index <= 19 ){

  }
}

async function findBeforeAndAfterPosts(username, permlink){
  let posts = await steem.api.getDiscussionsByBlogAsync({ tag: username, limit: 100 })
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
  // finallycomments.init()
  // finallycomments.loadEmbed('.single-post__finally-comments')
}

async function appendBeforeAfter(username, permlink){
  const footerPostLinks = await findBeforeAndAfterPosts(username, permlink);
  const beforePost = `<div class="col-xs-12 col-sm-5 col-sm-offset-1">
                <a href="/@${username}/${footerPostLinks.before.permlink}" class="read-more read-more--prev">
                    <section class="post">
                        <h3 class="read-more__subtitle"><i class="fa fa-chevron-left"></i>Previous article</h3>
                        <h2 class="read-more__title">${footerPostLinks.before.title}</h2>
                    </section>
                </a>
            </div>`
  const nextPost = footerPostLinks.after ? `<div class="col-xs-12 col-sm-5 ">
                <a href="/@${username}/${footerPostLinks.after.permlink}" class="read-more read-more--next">
                    <section class="post">
                        <h3 class="read-more__subtitle">Next article<i class="fa fa-chevron-right"></i></h3>
                        <h2 class="read-more__title">${footerPostLinks.after.title}</h2>
                    </section>
                </a>
            </div>` : ''

  const template = `
  <section class="post-prev-next">
      <div class="row">
          ${beforePost}
          ${nextPost}
      <div>
  </section>`
  $('main').append(template)

}

async function appendSingePostContent(post) {
  const username = $('main').data('username')
  const permlink = $('main').data('permlink')
  var converter = new showdown.Converter();
  // var html = purify.sanitize(converter.makeHtml(post.body))
  var html = converter.makeHtml(post.body)

  if( typeof JSON.parse(post.json_metadata).image === 'undefined' ){
    post.body = replaceMarkdownImagesWithHtml(body)
    image = genImageInHTML(post.body)
  } else {
    image = JSON.parse(post.json_metadata).image[0]
  }

  steem.api.getContent(username, permlink, function(err, result) {
    console.log(err, result);
    steem.api.getState(`/${result.category}/@${username}/${permlink}`, function(err, result) {
      console.log(err, result);
    });
  });

  let template = `
  <header class="hero-header" style="background-image: url(${image})">
          <div class="overlay hero-header__inner">
              <h1 class="animated fadeIn delay-1">${post.title}</h1>
          </div>
      </div>
      <div class="hero-header__meta">
        <p class="hero-header__tags animated fadeInDown">{{tags separator="&middot;"}}</p>
        <p class="hero-header__author animated fadeInUp">${username}</p>
    </div>
  </header>

  <div class="container">
      <div class="row">
          <div class="col-xs-12 col-md-10 col-md-offset-1 main-content animated fadeIn">
              ${html}
          </div>
      </div>
  </div>
  `
  $('main').append(template)
}

function genImageInHTML(markdown){
    let placeholder = document.createElement('div');
    placeholder.innerHTML = converter.makeHtml(markdown)
    let image = placeholder.querySelector('img');
    return image ? image.src : ''
}

function replaceMarkdownImagesWithHtml(body) {
  var urlRegex = /(https?:\/\/[^\s]+)/g;
  return post.body.replace(urlRegex, (url) => {
    let last = url.slice(-3)
    if(last === 'jpg' || last === 'png' || last === 'peg' || last === 'gif')  {
      return '<img src="' + url + '">';
    } else {
      return url
    }
  })
}
