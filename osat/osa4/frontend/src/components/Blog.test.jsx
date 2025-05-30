import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'Testi',
    author: 'Test Author',
    url: 'testi.com',
    likes: 5,
    user: { username: 'testuser', name: 'Test User' },
  }

  const mockOnLike = vi.fn()
  const mockOnRemove = vi.fn()
  const currentUser = { username: 'testuser', name: 'Test User' }

  test('renders blog title and author', () => {
    render(
      <Blog
        blog={blog}
        onLike={mockOnLike}
        onRemove={mockOnRemove}
        currentUser={currentUser}
      />
    )


    const blogElement = screen.getByText(/Testi Test Author/i)
    expect(blogElement).toBeDefined()
  })

  test('displays url, likes and user name when view button is pressed', async () => {
    render(
      <Blog
        blog={blog}
        onLike={mockOnLike}
        onRemove={mockOnRemove}
        currentUser={currentUser}
      />
    )

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    expect(screen.getByText(blog.url)).toBeDefined()
    expect(screen.getByText(`${blog.likes}`)).toBeDefined()
    expect(screen.getByText(blog.user.name)).toBeDefined()
  })

  test('calls onLike twice if like button is clicked twice', async () => {
    render(
      <Blog
        blog={blog}
        onLike={mockOnLike}
        onRemove={mockOnRemove}
        currentUser={currentUser}
      />
    )

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockOnLike).toHaveBeenCalledTimes(2)
  })
})