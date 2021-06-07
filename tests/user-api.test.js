const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const helper = require('./test-helper')
const app = require('../app')


const api = supertest(app)

describe('User API Tests', () => {
  beforeAll(async() => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('password', 10)
    const user = new User({ username:'root', name:'superuser', passwordHash })
    await user.save()
  })

  describe('with one user in the database', () => {
    test('creation succeeds with fresh username', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'testUser',
        name: 'john doe',
        password:'basicPassword'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

      const usernames = usersAtEnd.map(user => user.username)
      expect(usernames).toContain('testUser')
    })
    test('creation fails with proper status code and message if username is missing', async() => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        name:'invalid username',
        password:'invalid'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('`username` is required.' )

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)

      const names = usersAtEnd.map(user => user.names)
      expect(names).not.toContain('invalid username')

    })

    test('creation fails with proper status code and message if username is invalid', async() => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username:'in',
        name:'invalid username',
        password:'invalid'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('`username` (`in`) is shorter than the minimum allowed length (3).' )

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)

      const usernames = usersAtEnd.map(user => user.username)
      expect(usernames).not.toContain('in')

    })

    test('creation fails with proper status code and message if password is missing', async() => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username:'invalidPassword',
        name:'invalid password',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('password is required')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)

      const usernames = usersAtEnd.map(user => user.username)
      expect(usernames).not.toContain('in')

    })

    test('creation fails with proper status code and message if password is invalid', async() => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username:'invalidPassword',
        name:'invalid password',
        password: 'in'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('password must be at least 3 characters')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)

      const usernames = usersAtEnd.map(user => user.username)
      expect(usernames).not.toContain('in')

    })
  })


  afterAll(() => {
    mongoose.connection.close()
  })
})