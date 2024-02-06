import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import { Button } from '@/components/ui/elements'

describe('Button component', () => {
  it('renders with default props and variant', () => {
    const { container } = render(<Button>Click Me</Button>)
    expect(container.firstChild).toHaveClass(
      'bg-light text-dark hover:bg-offwhite',
    )
    expect(container.firstChild).toHaveTextContent('Click Me')
  })

  it('renders with ghost variant', () => {
    const { container } = render(<Button variant="ghost">Ghost Button</Button>)
    expect(container.firstChild).toHaveClass('bg-transparent text-light')
    expect(container.firstChild).toHaveTextContent('Ghost Button')
  })

  it('renders with custom class name', () => {
    const { container } = render(
      <Button className="custom-class">Custom Button</Button>,
    )
    expect(container.firstChild).toHaveClass('custom-class')
    expect(container.firstChild).toHaveTextContent('Custom Button')
  })

  it('renders with disabled state', () => {
    const { container } = render(<Button disabled>Disabled Button</Button>)
    expect(container.firstChild).toBeDisabled()
    expect(container.firstChild).toHaveTextContent('Disabled Button')
  })

  it('renders with loading state', () => {
    const { container } = render(<Button loading>Loading...</Button>)
    const loaderElement = container.querySelector('.animate-spin')
    expect(loaderElement).toBeInTheDocument()
    expect(container.firstChild).toHaveTextContent('Loading...')
  })

  it('renders with custom HTML attributes', () => {
    const { container } = render(
      <Button id="custom-id">Button with Custom ID</Button>,
    )
    expect(container.firstChild).toHaveAttribute('id', 'custom-id')
    expect(container.firstChild).toHaveTextContent('Button with Custom ID')
  })
})
