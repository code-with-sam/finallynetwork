module.exports.getPostLink = (username, post) => {
   return username === post.author ? `/@${username}/${post.permlink}` : `/@${username}/resteem/@${post.author}/${post.permlink}`
}

module.exports.isResteem = (username, post ) => {
  return username === post.author
}
