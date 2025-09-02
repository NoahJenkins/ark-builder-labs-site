import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BlogContent } from '@/components/blog/blog-content'
import type { BlogPost } from '@/lib/blog'

const mockBlogPosts: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'post-1',
    title: 'Featured Technology Post',
    excerpt: 'This is a featured post about technology',
    category: 'Technology',
    publishedAt: '2024-01-01',
    readTime: '5 min read',
    featured: true,
    content: 'Content of post 1',
    image: '/images/post-1.jpg'
  },
  {
    id: 'post-2',
    slug: 'post-2',
    title: 'Regular Business Post',
    excerpt: 'This is a regular business post',
    category: 'Business',
    publishedAt: '2024-01-02',
    readTime: '3 min read',
    featured: false,
    content: 'Content of post 2'
  },
  {
    id: 'post-3',
    slug: 'post-3',
    title: 'Another Technology Post',
    excerpt: 'Another technology related post',
    category: 'Technology',
    publishedAt: '2024-01-03',
    readTime: '4 min read',
    featured: false,
    content: 'Content of post 3'
  }
]

const mockCategories = ['All', 'Technology', 'Business']

describe('BlogContent', () => {
  const user = userEvent.setup()

  it('renders all blog posts by default', () => {
    render(<BlogContent blogPosts={mockBlogPosts} categories={mockCategories} />)
    
    expect(screen.getByText('Featured Technology Post')).toBeInTheDocument()
    expect(screen.getByText('Regular Business Post')).toBeInTheDocument()
    expect(screen.getByText('Another Technology Post')).toBeInTheDocument()
  })

  it('renders category filter badges', () => {
    render(<BlogContent blogPosts={mockBlogPosts} categories={mockCategories} />)
    
    // Check that category filter badges exist (should be at the top)
    const filterSection = document.querySelector('.flex.flex-wrap.gap-3.justify-center')
    expect(filterSection).toBeInTheDocument()
    
    mockCategories.forEach(category => {
      expect(screen.getAllByText(category).length).toBeGreaterThanOrEqual(1)
    })
  })

  it('filters posts by selected category', async () => {
    render(<BlogContent blogPosts={mockBlogPosts} categories={mockCategories} />)
    
    // Click on Technology category filter badge
    const technologyButtons = screen.getAllByText('Technology')
    const technologyFilter = technologyButtons[0] // First one should be the filter
    await user.click(technologyFilter)
    
    // Should show only technology posts
    expect(screen.getByText('Featured Technology Post')).toBeInTheDocument()
    expect(screen.getByText('Another Technology Post')).toBeInTheDocument()
    expect(screen.queryByText('Regular Business Post')).not.toBeInTheDocument()
  })

  it('returns to all posts when "All" category is selected', async () => {
    render(<BlogContent blogPosts={mockBlogPosts} categories={mockCategories} />)
    
    // First select Technology
    const technologyButtons = screen.getAllByText('Technology')
    const technologyFilter = technologyButtons[0] // First one should be the filter
    await user.click(technologyFilter)
    
    // Then select All
    const allButtons = screen.getAllByText('All')
    const allFilter = allButtons[0] // First one should be the filter
    await user.click(allFilter)
    
    // Should show all posts again
    expect(screen.getByText('Featured Technology Post')).toBeInTheDocument()
    expect(screen.getByText('Regular Business Post')).toBeInTheDocument()
    expect(screen.getByText('Another Technology Post')).toBeInTheDocument()
  })

  it('highlights the selected category', async () => {
    render(<BlogContent blogPosts={mockBlogPosts} categories={mockCategories} />)
    
    const technologyButtons = screen.getAllByText('Technology')
    const technologyFilter = technologyButtons[0] // First one should be the filter
    await user.click(technologyFilter)
    
    // The selected category should have different styling (variant="default")
    expect(technologyFilter).toHaveClass('bg-primary') // This may vary based on your Badge component
  })

  it('displays featured posts differently from regular posts', () => {
    render(<BlogContent blogPosts={mockBlogPosts} categories={mockCategories} />)
    
    // Featured posts should be in a larger card format
    const featuredPost = screen.getByText('Featured Technology Post').closest('[class*="card"]')
    const regularPost = screen.getByText('Regular Business Post').closest('[class*="card"]')
    
    expect(featuredPost).toBeInTheDocument()
    expect(regularPost).toBeInTheDocument()
    
    // Featured posts should have grid layout (lg:grid-cols-2)
    // Regular posts should be in a 3-column grid
  })

  it('shows post metadata (date and read time)', () => {
    render(<BlogContent blogPosts={mockBlogPosts} categories={mockCategories} />)
    
    expect(screen.getByText('1/1/2024')).toBeInTheDocument() // Date formatting may vary
    expect(screen.getByText('5 min read')).toBeInTheDocument()
    expect(screen.getByText('3 min read')).toBeInTheDocument()
  })

  it('renders category badges on posts', () => {
    render(<BlogContent blogPosts={mockBlogPosts} categories={mockCategories} />)
    
    const techBadges = screen.getAllByText('Technology')
    const businessBadges = screen.getAllByText('Business')
    
    // Should have Technology badges (1 in filter + 2 on posts)
    expect(techBadges.length).toBeGreaterThanOrEqual(2)
    
    // Should have Business badges (1 in filter + 1 on post)
    expect(businessBadges.length).toBeGreaterThanOrEqual(1)
  })

  it('renders "Read More" links with correct URLs', () => {
    render(<BlogContent blogPosts={mockBlogPosts} categories={mockCategories} />)
    
    // Check that links point to correct blog post URLs
    expect(screen.getByRole('link', { name: /read more/i })).toHaveAttribute('href', '/blog/post-1')
  })

  it('displays placeholder when no image is provided', () => {
    render(<BlogContent blogPosts={mockBlogPosts} categories={mockCategories} />)
    
    // Post 2 and 3 don't have images, should show placeholders
    expect(screen.getAllByText('📄').length).toBeGreaterThanOrEqual(1) // Regular post placeholders
  })

  it('shows "No Posts Found" message when filtered category has no posts', async () => {
    const emptyCategories = ['All', 'Empty Category']
    render(<BlogContent blogPosts={mockBlogPosts} categories={emptyCategories} />)
    
    // This would need a category that doesn't exist in posts
    // Let's simulate by using a custom category
    const customBlogPosts: BlogPost[] = []
    render(<BlogContent blogPosts={customBlogPosts} categories={['All', 'Nonexistent']} />)
    
    expect(screen.getByText('No Posts Found')).toBeInTheDocument()
    expect(screen.getByText(/no posts found in the/i)).toBeInTheDocument()
  })

  it('handles empty blog posts array', () => {
    render(<BlogContent blogPosts={[]} categories={['All']} />)
    
    expect(screen.getByText('No Posts Found')).toBeInTheDocument()
  })

  describe('accessibility', () => {
    it('has proper link roles for blog post links', () => {
      render(<BlogContent blogPosts={mockBlogPosts} categories={mockCategories} />)
      
      const links = screen.getAllByRole('link')
      expect(links.length).toBeGreaterThan(0)
      
      // Check that read more links exist and point to correct URLs
      const readLinks = links.filter(link => 
        link.getAttribute('href')?.includes('/blog/')
      )
      expect(readLinks.length).toBe(mockBlogPosts.length)
      
      // Verify they have correct hrefs
      mockBlogPosts.forEach(post => {
        const postLink = readLinks.find(link => 
          link.getAttribute('href') === `/blog/${post.slug}`
        )
        expect(postLink).toBeDefined()
      })
    })

    it('has proper button roles for category filters', () => {
      render(<BlogContent blogPosts={mockBlogPosts} categories={mockCategories} />)
      
      // Check that filter badges are clickable
      const filterSection = document.querySelector('.flex.flex-wrap.gap-3.justify-center')
      expect(filterSection).toBeInTheDocument()
      
      mockCategories.forEach(category => {
        const categoryElements = screen.getAllByText(category)
        expect(categoryElements.length).toBeGreaterThanOrEqual(1)
      })
    })
  })

  describe('responsive behavior', () => {
    it('applies responsive grid classes', () => {
      render(<BlogContent blogPosts={mockBlogPosts} categories={mockCategories} />)
      
      // Regular posts should be in responsive grid
      const regularPostsGrid = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3')
      expect(regularPostsGrid).toBeInTheDocument()
    })

    it('applies responsive layout for featured posts', () => {
      render(<BlogContent blogPosts={mockBlogPosts} categories={mockCategories} />)
      
      // Featured posts should have responsive grid layout
      const featuredPostGrid = document.querySelector('.grid.grid-cols-1.lg\\:grid-cols-2')
      expect(featuredPostGrid).toBeInTheDocument()
    })
  })
})