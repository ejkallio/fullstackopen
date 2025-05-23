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
    return (prev && prev.y > current.y)
      ? prev
      : current
  }

  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 1)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}