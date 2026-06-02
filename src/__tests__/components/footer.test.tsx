import { render, screen } from '@testing-library/react'
import { Footer } from '@/components/layout/footer'
import { SITE_CONFIG } from '@/lib/constants'

describe('Footer', () => {
  it('lets the contact email wrap in narrow columns', () => {
    render(<Footer />)

    expect(screen.getByText(SITE_CONFIG.email)).toHaveClass('[overflow-wrap:anywhere]')
  })
})
