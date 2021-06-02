const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test-helper')
const Blog = require('../models/blog')
const app = require('../app')

const api = supertest(app)

beforeEach( async() => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))

  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

describe('Blog API', () => {
  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('unique indentifier property is named "id"', async () => {
    const response = await helper.blogsInDb()

    expect(response[0].id).toBeDefined()
  })

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Kal Rogers',
      url: 'www.example.com',
      likes: 10
    }

    await api.post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1 )

    const contents = blogsAtEnd.map(blog => blog.title)
    expect(contents).toContain('Test Blog')
  })

  test('undefined likes defaults to zero', async () => {
    const blogMissingLikes = {
      title: 'Test Blog',
      author: 'Kal Rogers',
      url: 'www.example.com',
    }

    const testBlog = await api.post('/api/blogs')
      .send(blogMissingLikes)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(testBlog.body.likes).toBe(0)
  })

  test('undefined title and url returns bad request', async () => {
    const noTitleNoUrl = {
      author: 'Kal Rogers',
      likes: 10
    }

    await api.post('/api/blogs')
      .send(noTitleNoUrl)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

    const contents = blogsAtEnd.map(blog => blog.title)
    expect(contents).not.toContain(blogToDelete.title)
  })

  test('a blog can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    console.log(blogToUpdate.id)

    const updatedBlog = {
      title: 'This Blog has been updated',
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: 50
    }

    const returnedBlog = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    const contents = await blogsAtEnd.map(blog => blog)
    expect(contents).toContainEqual(returnedBlog.body)

  })
})


afterAll(() => {
  mongoose.connection.close()
})