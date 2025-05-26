const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
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
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(n => n.title)
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
      .send(newBlog)
      .expect(400)

    assert.strictEqual(response.status, 400)
  })
})


after(async () => {
  await mongoose.connection.close()
})