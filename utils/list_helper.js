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

const favoriteBlog = (blogPosts) => {
  let result = {}
  let mostLikes = 0

  if(blogPosts.length === 0) return result

  if(blogPosts.length === 1){
    result =  {
      title: blogPosts[0].title,
      author: blogPosts[0].author,
      likes: blogPosts[0].likes
    }
  } else {
    blogPosts.forEach(blog => {
      if(blog.likes > mostLikes){
        result =  {
          title: blog.title,
          author: blog.author,
          likes: blog.likes
        }
        mostLikes = blog.likes
      }
    })
  }
  return result
}

module.exports = { dummy, totalLikes, favoriteBlog }