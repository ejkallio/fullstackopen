const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {

  if (!request.body.title || !request.body.url) {
    return response.status(400).json({error: 'title and url fields are required'})
  }
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes
  })
    
  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
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