import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { Link } from '../src'

describe('default Link', () => {
  it('should render correctly', () => {
    const { getByTestId } = render({
      components: { Link },
      template: '<Link data-testid="link">Destyler</Link>',
    })
    const link = getByTestId('link')
    expect(link).toHaveAttribute('role', 'link')
  })

  it('should have attribute \'role=link\' when it\'s not a native link', () => {
    const { getByTestId } = render({
      components: { Link },
      template: '<Link data-testid="link" as="div">Link</Link>',
    })

    const link = getByTestId('link')
    expect(link).toHaveAttribute('role', 'link')
  })

  it('should not have attribute \'tabindex=0\' when it\'s a native link ', () => {
    const { getByTestId } = render({
      components: { Link },
      template: '<Link data-testid="link" href="https://destyler.dev">Link</Link>',
    })

    const link = getByTestId('link')

    expect(link).not.toHaveAttribute('tabindex', '0')
  })
})
