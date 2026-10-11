import type { PropTypes } from '@destyler/types'
import { connect, machine } from '@destyler/toggle'
import { createNormalizer } from '@destyler/types'
import { expect, it } from 'vitest'
import { page } from 'vitest/browser'
import './set-value.test'

it('the public built API replaces and clears selection from a native consumer button', async () => {
  const service = machine({ id: 'public-toggle-setter', orientation: 'horizontal', loopFocus: true, multiple: true, defaultValue: ['a'] })
  const normalize = createNormalizer<PropTypes>(props => props)
  const api = () => connect(service.getState(), service.send, normalize)
  const root = document.createElement('div')
  const setButton = document.createElement('button')
  setButton.textContent = 'Set to B'
  setButton.dataset.testid = 'toggle-set-b'
  const clearButton = document.createElement('button')
  clearButton.textContent = 'Clear'
  clearButton.dataset.testid = 'toggle-clear'
  const items = ['a', 'b'].map((value) => {
    const button = document.createElement('button')
    button.dataset.value = value
    return button
  })
  const render = () => {
    for (const button of items) {
      const props = api().getItemProps({ value: button.dataset.value! })
      button.setAttribute('data-state', props['data-state']!)
      button.setAttribute('aria-pressed', String(props['aria-pressed']))
    }
  }
  setButton.addEventListener('click', () => {
    api().setValue(['b'])
    render()
  })
  clearButton.addEventListener('click', () => {
    api().setValue([])
    render()
  })
  root.append(setButton, clearButton, ...items)
  document.body.append(root)
  try {
    service.start()
    render()
    expect(items.map(button => button.getAttribute('data-state'))).toEqual(['on', 'off'])
    await page.getByTestId('toggle-set-b').click()
    expect(api().value).toEqual(['b'])
    expect(items.map(button => button.getAttribute('aria-pressed'))).toEqual(['false', 'true'])
    await page.getByTestId('toggle-clear').click()
    expect(api().value).toEqual([])
    expect(items.map(button => button.getAttribute('data-state'))).toEqual(['off', 'off'])
  }
  finally {
    service.stop()
    root.remove()
  }
})
