import React from 'react'
import { act } from 'react-dom/test-utils'
import { render, screen } from '@testing-library/react'

import { Button } from '../button'

describe('Test Button', () => {
  test('test render button', async () => {
    render(<Button>Button</Button>)
    screen.getByText('Button')

    render(
      <Button>
        <div>中文按钮</div>
      </Button>
    )
    screen.getByText('中文按钮')
  })

  test('button clickable', async () => {
    let clicked = false
    render(
      <Button
        onClick={() => {
          clicked = true
        }}
      >
        Button
      </Button>
    )
    await act(async () => {
      await screen.getByText('Button').click()
    })
    expect(clicked).toBe(true)
  })

  test('renders button with icon', () => {
    const { getByTestId } = render(
      <Button icon={<span data-testid="icon">Icon</span>}>
        Button with Icon
      </Button>
    )

    const icon = getByTestId('icon')
    expect(icon).toBeInTheDocument()
  })

  test('disabled button', async () => {
    let clicked = false
    render(
      <Button
        disabled
        onClick={() => {
          clicked = true
        }}
      >
        Button
      </Button>
    )
    const button = screen.getByText('Button').parentElement!
    await act(async () => {
      await button.click()
    })
    expect(clicked).toBe(false)
  })
})
