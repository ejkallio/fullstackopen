const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Elias Kallio',
        username: 'ejkallio',
        password: 'testi123'
      }
    })

    await page.goto('http://localhost:3003')
  })

  test('Login form is shown', async ({ page }) => {  
    await expect(page.getByTestId('username')).toBeVisible()
    
    await expect(page.getByTestId('password')).toBeVisible()

    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'ejkallio', 'testi123')

      await expect(page.getByText('Elias Kallio logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'ejkallio', 'testi124')

      await expect(page.getByText('wrong credentials')).toBeVisible()

      await expect(page.getByTestId('username')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async({ page }) => {
      await loginWith(page, 'ejkallio', 'testi123')

      await createBlog(page, 'Test blog', 'Test author', 'test.url')
    })

    test('a new blog can be created', async ({ page })  => {
      const blogItems = page.getByTestId('blog-item')
      const lastBlog = blogItems.last()

      await expect(lastBlog).toContainText('Test blog')
      await expect(lastBlog).toContainText('Test author')
    })
    
    test('a blog can be liked', async ({ page }) => {
      const blogItems = page.getByTestId('blog-item')
      const lastBlog = blogItems.last()

      await lastBlog.getByRole('button', { name: 'view' }).click()

      const likeButton = lastBlog.getByRole('button', { name: 'like' })
      const likesText = lastBlog.getByTestId('likes')

      await expect(likesText).toHaveText('0 like')

      await likeButton.click()

      await expect(likesText).toHaveText('1 like')
    })

    test('a blog can be deleted', async ({ page }) => {
      const lastBlog = page.getByTestId('blog-item').last()
      await lastBlog.getByRole('button', { name: 'view' }).click()

      page.once('dialog', async dialog => {
        expect(dialog.message()).toContain('Remove Test blog')
        await dialog.accept()
      })

      await lastBlog.getByRole('button', { name: 'remove' }).click()

      await expect(lastBlog).not.toBeVisible()
    })

    test('remove button is visible only to the owner of the blog', async ({ page, request }) => {
      await page.getByTestId('blog-item').last().getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()

      await page.getByRole('button', { name: 'logout' }).click()

      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Test User',
          username: 'testuser',
          password: 'testpass'
        }
      })

      await loginWith(page, 'testuser', 'testpass')

      await page.getByTestId('blog-item').last().getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })

    test('blogs are sorted in descending order of likes', async ({ page, request }) => {
      await createBlog(page, 'Second Blog', 'Author 2', 'blog2.url')
      await createBlog(page, 'Third Blog', 'Author 3', 'blog3.url')

      const blogItems = await page.getByTestId('blog-item').all()

      await blogItems[1].getByRole('button', { name: 'view' }).click()
      await blogItems[1].getByRole('button', { name: 'like' }).click()
      await blogItems[1].getByRole('button', { name: 'like' }).click()
      await blogItems[0].getByRole('button', { name: 'hide' }).click()

      await blogItems[2].getByRole('button', { name: 'view' }).click()
      await blogItems[2].getByRole('button', { name: 'like' }).click()
      await blogItems[2].getByRole('button', { name: 'hide' }).click()

      const sortedBlogs = await page.getByTestId('blog-item').allInnerTexts()

      expect(sortedBlogs[0]).toContain('Second Blog')
      expect(sortedBlogs[1]).toContain('Third Blog')
      expect(sortedBlogs[2]).toContain('Test blog')
    })
  })
})