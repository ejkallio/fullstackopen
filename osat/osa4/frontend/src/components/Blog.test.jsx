import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
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
})