import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    }
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, layoutId, initial, transition, ...props }) => <div {...props}>{children}</div>,
    span: ({ children, layoutId, initial, transition, ...props }) => <span {...props}>{children}</span>,
    h1: ({ children, layoutId, initial, transition, ...props }) => <h1 {...props}>{children}</h1>,
    h2: ({ children, layoutId, initial, transition, ...props }) => <h2 {...props}>{children}</h2>,
    h3: ({ children, layoutId, initial, transition, ...props }) => <h3 {...props}>{children}</h3>,
    p: ({ children, layoutId, initial, transition, ...props }) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }) => children,
}))

// Mock intersection observer for animations
global.IntersectionObserver = jest.fn(() => ({
  disconnect: jest.fn(),
  observe: jest.fn(),
  unobserve: jest.fn(),
}))

// Mock window.matchMedia for responsive components
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock fetch globally
global.fetch = jest.fn()