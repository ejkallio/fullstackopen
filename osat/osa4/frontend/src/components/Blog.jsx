import Togglable from "./Togglable"
import { useState } from "react"
import blogService from '../services/blogs'

const Blog = ({ blog, setBlogs, blogs, onLike }) => {
  const [likes, setLikes] = useState(blog.likes)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: likes + 1,
      user: blog.user.id
    }

    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      setLikes(returnedBlog.likes)
    } catch (error) {
      console.error('Error updating likes:', error)
    }
  }
  return (
  <div style={blogStyle}>
    <div>
      {blog.title} {blog.author}
    </div>
    <div>
      <Togglable buttonLabel="view" hideLabel="hide">
        <div>
          <p>{blog.url}</p>
          <p>{blog.likes} <button onClick={() => onLike(blog)}>like</button></p>
          <p>{blog.user.name}</p>
        </div>
      </Togglable>
    </div>
  </div>  
)}

export default Blog