import fs from 'fs'
import path from 'path'
import { getBlogPosts, getBlogPost, getBlogCategories } from '@/lib/blog'

// Mock fs module
jest.mock('fs')
jest.mock('path')

// Mock gray-matter
jest.mock('gray-matter', () => {
  return jest.fn((content: string) => {
    if (content.includes('title: Test Post 1')) {
      return {
        data: {
          title: 'Test Post 1',
          excerpt: 'This is the first test post',
          category: 'Technology',
          publishedAt: '2024-01-01',
          readTime: '5 min read',
          featured: true,
          image: '/test-image-1.jpg'
        },
        content: 'This is the content of test post 1'
      }
    }
    if (content.includes('title: Test Post 2')) {
      return {
        data: {
          title: 'Test Post 2',
          excerpt: 'This is the second test post',
          category: 'Business',
          publishedAt: '2024-01-02',
          readTime: '3 min read',
          featured: false
        },
        content: 'This is the content of test post 2'
      }
    }
    return {
      data: {},
      content: ''
    }
  })
})

const mockFs = fs as jest.Mocked<typeof fs>
const mockPath = path as jest.Mocked<typeof path>

describe('Blog functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Setup path mocks
    mockPath.join.mockImplementation((...args) => args.join('/'))
    
    // Mock process.cwd()
    jest.spyOn(process, 'cwd').mockReturnValue('/mock/project')
  })

  describe('getBlogPosts', () => {
    it('returns empty array when blog directory does not exist', () => {
      mockFs.existsSync.mockReturnValue(false)
      
      const posts = getBlogPosts()
      expect(posts).toEqual([])
    })

    it('returns empty array when no MDX files exist', () => {
      mockFs.existsSync.mockReturnValue(true)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(mockFs.readdirSync as any).mockReturnValue(['README.md', 'other-file.txt'])
      
      const posts = getBlogPosts()
      expect(posts).toEqual([])
    })

    it('returns blog posts sorted by date', () => {
      mockFs.existsSync.mockReturnValue(true)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(mockFs.readdirSync as any).mockReturnValue(['post1.mdx', 'post2.mdx'])
      mockFs.readFileSync
        .mockReturnValueOnce('title: Test Post 1\n---\nContent 1')
        .mockReturnValueOnce('title: Test Post 2\n---\nContent 2')
      
      const posts = getBlogPosts()
      
      expect(posts).toHaveLength(2)
      
      // Should be sorted by date (newest first)
      expect(posts[0].title).toBe('Test Post 2') // 2024-01-02
      expect(posts[1].title).toBe('Test Post 1') // 2024-01-01
      
      // Check post structure
      expect(posts[0]).toMatchObject({
        id: 'post2',
        slug: 'post2',
        title: 'Test Post 2',
        excerpt: 'This is the second test post',
        category: 'Business',
        publishedAt: '2024-01-02',
        readTime: '3 min read',
        featured: false,
        content: 'This is the content of test post 2'
      })
    })

    it('applies default values for missing frontmatter', () => {
      mockFs.existsSync.mockReturnValue(true)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(mockFs.readdirSync as any).mockReturnValue(['minimal-post.mdx'])
      mockFs.readFileSync.mockReturnValue('---\nContent only')
      
      const posts = getBlogPosts()
      
      expect(posts[0]).toMatchObject({
        id: 'minimal-post',
        slug: 'minimal-post',
        title: 'Untitled',
        excerpt: '',
        category: 'General',
        readTime: '5 min read',
        featured: false
      })
      
      // Should have a default publishedAt date
      expect(posts[0].publishedAt).toMatch(/\d{4}-\d{2}-\d{2}/)
    })

    it('handles file system errors gracefully', () => {
      mockFs.existsSync.mockImplementation(() => {
        throw new Error('File system error')
      })
      
      // Mock console.error to avoid test output pollution
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      
      const posts = getBlogPosts()
      
      expect(posts).toEqual([])
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error reading blog posts:', expect.any(Error))
      
      consoleErrorSpy.mockRestore()
    })
  })

  describe('getBlogPost', () => {
    it('returns null when post file does not exist', () => {
      mockFs.existsSync.mockReturnValue(false)
      
      const post = getBlogPost('non-existent')
      expect(post).toBeNull()
    })

    it('returns a single blog post when it exists', () => {
      mockFs.existsSync.mockReturnValue(true)
      mockFs.readFileSync.mockReturnValue('title: Test Post 1\n---\nContent 1')
      
      const post = getBlogPost('test-post-1')
      
      expect(post).toMatchObject({
        id: 'test-post-1',
        slug: 'test-post-1',
        title: 'Test Post 1',
        excerpt: 'This is the first test post',
        category: 'Technology',
        publishedAt: '2024-01-01',
        readTime: '5 min read',
        featured: true,
        image: '/test-image-1.jpg',
        content: 'This is the content of test post 1'
      })
    })

    it('handles file read errors gracefully', () => {
      mockFs.existsSync.mockReturnValue(true)
      mockFs.readFileSync.mockImplementation(() => {
        throw new Error('Read error')
      })
      
      // Mock console.error to avoid test output pollution
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      
      const post = getBlogPost('error-post')
      
      expect(post).toBeNull()
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error reading blog post error-post:', expect.any(Error))
      
      consoleErrorSpy.mockRestore()
    })
  })

  describe('getBlogCategories', () => {
    it('returns categories with "All" as first option', () => {
      mockFs.existsSync.mockReturnValue(true)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(mockFs.readdirSync as any).mockReturnValue(['post1.mdx', 'post2.mdx'])
      mockFs.readFileSync
        .mockReturnValueOnce('title: Test Post 1\n---\nContent 1')
        .mockReturnValueOnce('title: Test Post 2\n---\nContent 2')
      
      const categories = getBlogCategories()
      
      expect(categories).toEqual(['All', 'Business', 'Technology'])
      expect(categories[0]).toBe('All')
    })

    it('removes duplicate categories', () => {
      mockFs.existsSync.mockReturnValue(true)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(mockFs.readdirSync as any).mockReturnValue(['post1.mdx', 'post2.mdx', 'post3.mdx'])
      mockFs.readFileSync
        .mockReturnValueOnce('title: Test Post 1\n---\nContent 1') // Technology
        .mockReturnValueOnce('title: Test Post 2\n---\nContent 2') // Business
        .mockReturnValueOnce('title: Test Post 1\n---\nContent 1') // Technology (duplicate)
      
      const categories = getBlogCategories()
      
      expect(categories).toEqual(['All', 'Business', 'Technology'])
    })

    it('returns only "All" when no posts exist', () => {
      mockFs.existsSync.mockReturnValue(false)
      
      const categories = getBlogCategories()
      
      expect(categories).toEqual(['All'])
    })
  })
})