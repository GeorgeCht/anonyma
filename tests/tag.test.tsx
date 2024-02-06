import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import { Tag } from '@/components/ui/elements'

describe('Tag component', () => {
  it('renders with light theme by default', () => {
    const { container } = render(<Tag>Light Tag</Tag>)
    const tagElement = container.firstChild

    // Check if tag element is rendered with default light theme
    expect(tagElement).toHaveClass('text-light/60 border-light/10')
    expect(tagElement).toHaveTextContent('Light Tag')
  })

  it('renders with dark theme', () => {
    const { container } = render(<Tag theme="dark">Dark Tag</Tag>)
    const tagElement = container.firstChild

    // Check if tag element is rendered with dark theme
    expect(tagElement).toHaveClass('text-dark/60 border-dark/10')
    expect(tagElement).toHaveTextContent('Dark Tag')
  })
})
