const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogPosts) => {
  let likes = 0
  blogPosts.forEach(post => {
    likes += post.likes
  })
  return likes
}

module.exports = { dummy, totalLikes }