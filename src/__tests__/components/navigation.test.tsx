import { render, screen } from '@testing-library/react'
import { Navigation } from '@/components/layout/navigation'
import { NAVIGATION_ITEMS, SITE_CONFIG } from '@/lib/constants'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}))

describe('Navigation', () => {
  beforeEach(() => {
    const { usePathname } = jest.requireMock('next/navigation')
    usePathname.mockReturnValue('/')
  })

  it('renders the site logo and name', () => {
    render(<Navigation />)
    
    expect(screen.getByText(SITE_CONFIG.name)).toBeInTheDocument()
    expect(screen.getByText('A')).toBeInTheDocument() // Logo initial
  })

  it('renders all navigation items', () => {
    render(<Navigation />)
    
    NAVIGATION_ITEMS.forEach(item => {
      const navLink = screen.getByRole('link', { name: item.name })
      expect(navLink).toBeInTheDocument()
      expect(navLink).toHaveAttribute('href', item.href)
    })
  })

  it('renders the Get Started button', () => {
    render(<Navigation />)
    
    const getStartedButton = screen.getByRole('link', { name: 'Get Started' })
    expect(getStartedButton).toBeInTheDocument()
    expect(getStartedButton).toHaveAttribute('href', '/contact')
  })

  it('highlights active navigation item', () => {
    const { usePathname } = jest.requireMock('next/navigation')
    usePathname.mockReturnValue('/about')
    
    render(<Navigation />)
    
    const aboutLink = screen.getByRole('link', { name: 'About' })
    expect(aboutLink).toHaveClass('text-primary')
  })

  it('applies default styling to inactive navigation items', () => {
    const { usePathname } = jest.requireMock('next/navigation')
    usePathname.mockReturnValue('/about')
    
    render(<Navigation />)
    
    const homeLink = screen.getByRole('link', { name: 'Home' })
    expect(homeLink).toHaveClass('text-muted-foreground')
  })

  it('has proper accessibility attributes', () => {
    render(<Navigation />)
    
    const header = document.querySelector('header')
    expect(header).toBeInTheDocument()
    
    const nav = document.querySelector('nav')
    expect(nav).toBeInTheDocument()
  })

  describe('responsive behavior', () => {
    it('hides desktop navigation on mobile and shows mobile navigation', () => {
      render(<Navigation />)
      
      const desktopNav = document.querySelector('.hidden.md\\:flex')
      expect(desktopNav).toBeInTheDocument()
    })

    it('shows desktop Get Started button only on larger screens', () => {
      render(<Navigation />)
      
      const getStartedContainer = document.querySelector('.hidden.md\\:block')
      expect(getStartedContainer).toBeInTheDocument()
    })
  })
})