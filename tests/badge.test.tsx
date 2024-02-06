import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import { Badge } from '@/components/ui/elements'

describe('Badge component', () => {
  it('renders with default props and variant', () => {
    const { container } = render(<Badge>Hello World</Badge>)
    expect(container.firstChild).toHaveClass(
      'bg-light/[0.06] text-light/50 border-light/10',
    )
    expect(container.firstChild).toHaveTextContent('Hello World')
  })
  it('renders with dark variant', () => {
    const { container } = render(<Badge variant="dark">Dark Badge</Badge>)
    expect(container.firstChild).toHaveClass('text-dark border-dark/40')
    expect(container.firstChild).toHaveTextContent('Dark Badge')
  })

  it('renders with custom class name', () => {
    const { container } = render(
      <Badge className="custom-class">Custom Badge</Badge>,
    )
    expect(container.firstChild).toHaveClass('custom-class')
    expect(container.firstChild).toHaveTextContent('Custom Badge')
  })

  it('renders with indicator', () => {
    const { container } = render(<Badge indicator>Badge with Indicator</Badge>)
    const indicatorElement = container.querySelector('.bg-green-500')
    expect(indicatorElement).toBeInTheDocument()
    expect(container.firstChild).toHaveTextContent('Badge with Indicator')
  })

  it('renders with custom HTML attributes', () => {
    const { container } = render(
      <Badge id="custom-id">Badge with Custom ID</Badge>,
    )
    expect(container.firstChild).toHaveAttribute('id', 'custom-id')
    expect(container.firstChild).toHaveTextContent('Badge with Custom ID')
  })
})
