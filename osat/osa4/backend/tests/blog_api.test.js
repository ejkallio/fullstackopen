const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

let token

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()

  const loginResponse = await api
    .post('/api/login')
    .send({
      username: 'root',
      password: 'sekret'
    })

  token = loginResponse.body.token

  const userId = user._id
  const blogObjects = helper.initialBlogs
    .map(blog => new Blog({ ...blog, user:userId }))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test.only('each blog as an id property', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach(blog => {
    assert.ok(blog.id, 'Id field is incorrectly named')
  })
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Test Blog',
    author: 'Elias Kallio',
    url: 'none',
    likes: '100'
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(b => b.title)
  assert(titles.includes('Test Blog'))
})

test('likes is given the value 0 if undefined', async () => {
  const newBlog = {
    title: 'Test Blog',
    author: 'Elias Kallio',
    url: 'none',
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const savedBlog = response.body

  assert.strictEqual(savedBlog.likes, 0)
})

describe('POST with missing fields', () => {
  test('error if title is undefined', async () => {
    const newBlog = {
      author: 'Elias Kallio',
      url: 'none',
    }

    newBlog.title = undefined

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    assert.strictEqual(response.status, 400)
  })

  test('error if url is undefined', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Elias Kallio',
    }

    newBlog.url = undefined

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    assert.strictEqual(response.status, 400)
  })
})

describe('Deletion of a Blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    const titles = blogsAtEnd.map(b => b.title)
    assert(!titles.includes(blogToDelete.title))

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
  })
})

describe('Editing a blog', () => {
  test('a blogs likes can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToEdit = blogsAtStart[0]

    const editedLikes = { likes: blogToEdit.likes + 1}

    const response = await api
      .put('/api/blogs/' + blogToEdit.id)
      .send(editedLikes)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, editedLikes.likes)

    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlog = blogsAtEnd.find(b => b.id === blogToEdit.id)
    assert.strictEqual(updatedBlog.likes, editedLikes.likes)
  })
})

after(async () => {
  await mongoose.connection.close()
})