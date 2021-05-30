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

const mostBlogs = (blogs) => {
  const authorObject = {}
  const authorList = {}
  let maxBlogs = 0
  let topAuthor = ''

  if(blogs.length === 0 ) return authorObject

  blogs.forEach(blog => {
    authorList[blog.author] = (authorList[blog.author] + 1) || 1
  })

  Object.keys(authorList).forEach(key => {
    if(authorList[key] > maxBlogs){
      maxBlogs = authorList[key]
      topAuthor = key
    }
  })

  authorObject.author = topAuthor,
  authorObject.blogs = maxBlogs

  return authorObject
}

const mostLikes = (blogs) => {
  const authorObject = {}
  const authorList = {}
  let maxLikes = 0
  let topAuthor = ''

  if(blogs.length === 0) return authorObject
  blogs.forEach(blog => {
    authorList[blog.author] = (authorList[blog.author] + blog.likes) || blog.likes
  })

  Object.keys(authorList).forEach( key => {
    if(authorList[key] > maxLikes){
      maxLikes = authorList[key]
      topAuthor = key
    }
  })

  authorObject.author = topAuthor
  authorObject.likes = maxLikes

  return authorObject
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }