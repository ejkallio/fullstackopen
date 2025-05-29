import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])
  
  const loginForm = () => (
    <div>
    <h2>log in to application</h2>

    <Notification message={errorMessage} type="error" />

    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>  
    </div> 
  )

  const blogList = () => (
    <div>
    <h2>blogs</h2>
    {blogs.map(blog =>
      <Blog key={blog.id} blog={blog} />
    )}
    </div>
  )

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogappUser')
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setMessage(`a new blog "${returnedBlog.title}" by ${returnedBlog.author} was added`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
  }

  const blogForm = () => (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            type="text"
            value={newTitle}
            name="Title"
            onChange={({ target }) => setNewTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            type="text"
            value={newAuthor}
            name="Author"
            onChange={({ target }) => setNewAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            type="text"
            value={newUrl}
            name="URL"
            onChange={({ target }) => setNewUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )

  const handleLike = async(blogToUpdate) => {
    const updatedBlog = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1,
      user: blogToUpdate.user.id
    }

    try {
    const returnedBlog = await blogService.update(blogToUpdate.id, updatedBlog)

    const fullBlog = {
      ...returnedBlog,
      user: blogToUpdate.user
    }  
    
    setBlogs(blogs.map(b => b.id !== blogToUpdate.id ? b : fullBlog))
    } catch (error) {
      console.error('Error updating likes:', error)
    }
  }

  const handleRemove = async (blogToRemove) => {
    const confirm = window.confirm(`Remove ${blogToRemove.title} by ${blogToRemove.author}`)
    if (!confirm) return
    
    try {
      await blogService.remove(blogToRemove.id)
      setBlogs(blogs.filter(b => b.id !== blogToRemove.id))
    } catch (error) {
      console.error('Error deleting blog:', error)
    }
  }

  const blogFormRef = useRef()

  if (user === null) {
    return (
      loginForm()
    )
  }

  else return (
    <div>
      <h2>blogs</h2>

      <Notification message={message} type="message" />

      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>

      <Togglable buttonLabel="new blog" hideLabel="cancel" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>


      {blogs
        .slice()
        .sort((a,b) => b.likes - a.likes)
        .map(blog =>
        <Blog key={blog.id} blog={blog} onLike={handleLike} onRemove={handleRemove} />
      )}
    </div>
  )
}

export default App