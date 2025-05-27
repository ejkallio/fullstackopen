const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')
//const getTokenFrom = request => {
//  const authorization = request.get('authorization')
//  if (authorization && authorization.startsWith('Bearer ')) {
//    return authorization.replace('Bearer ', '')
//  }
//  return null
//}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  if (!request.body.title || !request.body.url) {
    return response.status(400).json({error: 'title and url fields are required'})
  }
  const body = request.body
  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes,
    user: user._id
  })
    
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user

  const blog = await Blog.findById(request.params.id)

  if (blog.user.toString() !== user._id.toString()) {
    return response.status(403).json({ error: 'you are not authorized to delete another users notes' })
  }

  await blog.deleteOne()
  //await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const { likes } = request.body

  
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { likes },
    {new: true, runValidators: true, context: 'query'}
  )

  response.json(updatedBlog)
})

module.exports = blogsRouter