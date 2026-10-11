import { afterEach, expect, it, vi } from 'vitest'

afterEach(() => {
  document.body.replaceChildren()
})

it('native HTMLElement.click suppresses same-element reentry and permits a later activation', () => {
  const item = document.createElement('div')
  const onClick = vi.fn(() => {
    if (onClick.mock.calls.length === 1)
      item.click()
  })
  item.addEventListener('click', onClick)
  document.body.append(item)

  // The platform guard runs before any menu handler can receive a nested click.
  // https://html.spec.whatwg.org/multipage/interaction.html#dom-click
  item.click()
  expect(onClick).toHaveBeenCalledTimes(1)

  // The guard resets after dispatch, so a later activation is still delivered.
  item.click()
  expect(onClick).toHaveBeenCalledTimes(2)
})
