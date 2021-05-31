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


})

afterAll(() => {
  mongoose.connection.close()
})