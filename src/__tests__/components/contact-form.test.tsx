import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactForm } from '@/components/forms/contact-form'
import { SERVICES } from '@/lib/constants'

describe('ContactForm', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    // Mock fetch globally
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders all form fields', () => {
    render(<ContactForm />)
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/company/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/service path/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/project note/i)).toBeInTheDocument()
  })

  it('renders all service options', () => {
    render(<ContactForm />)
    
    // Check that default option exists
    expect(screen.getByDisplayValue('Choose the closest path')).toBeInTheDocument()
    
    // Check that all services are available
    SERVICES.forEach(service => {
      const option = screen.getByRole('option', { name: service.title })
      expect(option).toBeInTheDocument()
      expect(option).toHaveValue(service.id)
    })
    
    // Check general inquiry option
    expect(screen.getByRole('option', { name: 'General Inquiry' })).toBeInTheDocument()
  })

  it('shows validation errors for required fields', async () => {
    render(<ContactForm />)
    
    const submitButton = screen.getByRole('button', { name: /send project note/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument()
      expect(screen.getByText('Email is required')).toBeInTheDocument()
      expect(screen.getByText('Please select a service')).toBeInTheDocument()
      expect(screen.getByText('Message is required')).toBeInTheDocument()
    })
  })

  it('accepts valid form input', async () => {
    render(<ContactForm />)
    
    // Fill out the form with valid data
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/company/i), 'Test Company')
    await user.selectOptions(screen.getByLabelText(/service path/i), 'web-mobile')
    await user.type(screen.getByLabelText(/project note/i), 'Test message')
    
    // Form should accept valid input without errors
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Test Company')).toBeInTheDocument()
    
    // Check that the select option is selected
    const serviceSelect = screen.getByLabelText(/service path/i) as HTMLSelectElement
    expect(serviceSelect.value).toBe('web-mobile')
    
    expect(screen.getByDisplayValue('Test message')).toBeInTheDocument()
  })

  it('displays email contact information', () => {
    render(<ContactForm />)
    
    const emailLink = screen.getByRole('link', { name: /contact@arkbuilderlabs.com/i })
    expect(emailLink).toBeInTheDocument()
    expect(emailLink).toHaveAttribute('href', 'mailto:contact@arkbuilderlabs.com')
  })

  it('renders submit button', () => {
    render(<ContactForm />)
    
    const submitButton = screen.getByRole('button', { name: /send project note/i })
    expect(submitButton).toBeInTheDocument()
    expect(submitButton).toBeEnabled()
  })

  it('displays form title and description', () => {
    render(<ContactForm />)
    
    expect(screen.getByText('Tell us about the work.')).toBeInTheDocument()
    expect(screen.getByText(/share the goal/i)).toBeInTheDocument()
  })
})
