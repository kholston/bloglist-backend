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
})


afterAll(() => {
  mongoose.connection.close()
})