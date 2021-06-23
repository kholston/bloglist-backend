const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if(blog){
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogRouter.post('/', async (request, response) => {
  const body = request.body


  const user = request.user
  const blog = new Blog({
    title: body.title,
    author: body.author,
    user: user.id,
    url: body.url,
  })

  const createdBlog = await blog.save()
  user.blogs = user.blogs.concat(createdBlog._id)
  await user.save()

  const savedBlog = await Blog.findById(createdBlog.id).populate('user', { username: 1, name: 1 })

  response.json(savedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
  const blogToDelete = await Blog.findById(request.params.id)
  const user = request.user
  if(!user){
    return response.status(401).json({ error: 'user credentials missing' })
  }

  if(blogToDelete.user.toString()  !== user.id){
    return response.status(401).json({ error: 'user credentials don\'t match blog creator' })
  } else {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  }
})

blogRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const update = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  const updatedBlog = await Blog.findById(update._id).populate('user', { username: 1, name: 1 })

  response.json(updatedBlog)
})

module.exports = blogRouter