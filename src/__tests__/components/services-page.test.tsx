import { render, screen, within } from '@testing-library/react'
import { ServicesPageContent } from '@/components/pages/services-page'
import { SERVICES } from '@/lib/constants'
import { encodePathSegment } from '@/lib/security'

describe('ServicesPageContent', () => {
  it('frames the page around stewardship and the existing service paths', () => {
    render(<ServicesPageContent />)

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /services built with stewardship/i,
      })
    ).toBeInTheDocument()

    SERVICES.forEach((service, index) => {
      const servicePath = screen.getByRole('article', {
        name: `${service.title} service path`,
      })

      expect(within(servicePath).getByText(String(index + 1).padStart(2, '0'))).toBeInTheDocument()
      expect(within(servicePath).getByRole('heading', { name: service.title })).toBeInTheDocument()
      expect(
        within(servicePath).getByRole('link', {
          name: new RegExp(`learn more about ${service.title}`, 'i'),
        })
      ).toHaveAttribute('href', `/services/${encodePathSegment(service.id)}`)
    })
  })

  it('keeps the primary contact paths available', () => {
    render(<ServicesPageContent />)

    expect(screen.getByRole('link', { name: /start a conversation/i })).toHaveAttribute(
      'href',
      '/contact'
    )
    expect(screen.getByRole('link', { name: /request a quote/i })).toHaveAttribute(
      'href',
      '/contact'
    )
  })
})
