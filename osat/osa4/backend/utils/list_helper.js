const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }

  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (prev, current) => {
    return (prev && prev.likes > current.likes)
      ? prev
      : current
  }

  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 1)
}

const mostBlogs = (blogs) => {
  const authorCount = {}

  blogs.forEach(blog => {
    authorCount[blog.author] = (authorCount[blog.author] || 0) + 1
  })

  let maxAuthor = null
  let maxBlogs = 0

  for (const author in authorCount) {
    if (authorCount[author] > maxBlogs) {
      maxAuthor = author
      maxBlogs = authorCount[author]
    }
  }

  return blogs.length === 0
  	? 0
	:  { author: maxAuthor, blogs: maxBlogs }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}