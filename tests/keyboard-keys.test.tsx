import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { KeyboardKeys } from '@/components/ui/elements'

describe('KeyboardKeys component', () => {
  it('renders with default props', () => {
    const { container } = render(<KeyboardKeys keys={['Ctrl', '+', 'S']} />)

    // Check if component renders all keys
    const keys = container.querySelectorAll('abbr')
    expect(keys.length).toBe(3)

    // Check if each key is rendered correctly
    expect(keys[0]).toHaveTextContent('Ctrl')
    expect(keys[1]).toHaveTextContent('+')
    expect(keys[2]).toHaveTextContent('S')

    // Check default class name and styles
    expect(keys[0]).toHaveClass('text--mono-xs')
    expect(keys[1]).toHaveClass('text--mono-xs border-none')
    expect(keys[2]).toHaveClass('text--mono-xs py-[3px] px-[3px]')

    // Check if title attribute is correctly set
    expect(keys[0]).toHaveAttribute('title', 'Ctrl + S')
  })

  it('renders with custom class name', () => {
    const { container } = render(
      <KeyboardKeys keys={['Enter']} className="custom-class" />,
    )
    const keys = container.querySelectorAll('abbr')

    // Check if custom class name is applied
    expect(container.firstChild).toHaveClass('custom-class')

    // Check if each key still renders correctly
    expect(keys[0]).toHaveTextContent('Enter')
    expect(keys[0]).toHaveClass('text--mono-xs')
  })
})
