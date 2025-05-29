import Togglable from "./Togglable"
import { useState } from "react"
import blogService from '../services/blogs'

const Blog = ({ blog, onLike, onRemove, currentUser }) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const isOwner = blog.user?.username === currentUser?.username

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
          {isOwner &&<button onClick={() => onRemove(blog)}>remove</button>}
        </div>
      </Togglable>
    </div>
  </div>  
)}

export default Blog