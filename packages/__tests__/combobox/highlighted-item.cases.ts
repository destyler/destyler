import { normalizeProps, spreadProps } from '@destyler/vanilla'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { collection } from '../../components/combobox/src/collection'
import { connect } from '../../components/combobox/src/connect'
import { machine } from '../../components/combobox/src/machine'

const cleanups: VoidFunction[] = []
afterEach(() => {
  for (const cleanup of cleanups.splice(0).reverse())
    cleanup()
  vi.restoreAllMocks()
})

function renderCombobox(composite: boolean, value: string) {
  const items = ['First', value, 'Last']
  const root = document.createElement('div')
  const control = document.createElement('div')
  const input = document.createElement('input')
  const positioner = document.createElement('div')
  const content = document.createElement('div')
  const list = document.createElement('div')
  const options = items.map((item) => {
    const option = document.createElement('a')
    option.href = '#selected-item'
    option.textContent = item
    return option
  })
  const scrolls = options.map(option => vi.spyOn(option, 'scrollIntoView').mockImplementation(() => {}))
  content.style.overflow = 'auto'
  // Give both DOM emulators and browsers the same scrollable viewport.
  Object.defineProperties(content, {
    scrollHeight: { value: 300 },
    clientHeight: { value: 100 },
  })
  list.append(...options)
  content.append(list)
  if (composite)
    control.append(input)
  else
    content.prepend(input)
  positioner.append(content)
  root.append(control, positioner)
  document.body.append(root)

  const navigate = vi.fn()
  const service = machine({
    id: 'highlighted-item',
    composite,
    collection: collection({ items }),
    navigate,
  })
  service.start()
  const api = () => connect(service.getState(), service.send, normalizeProps)
  const render = () => {
    const current = api()
    spreadProps(root, current.getRootProps())
    spreadProps(control, current.getControlProps())
    spreadProps(input, current.getInputProps())
    spreadProps(positioner, current.getPositionerProps())
    spreadProps(content, current.getContentProps())
    spreadProps(list, current.getListProps())
    options.forEach((option, index) => spreadProps(option, current.getItemProps({ item: items[index] })))
  }
  render()
  const unsubscribe = service.subscribe(render)
  cleanups.push(() => {
    unsubscribe()
    service.stop()
    root.remove()
  })
  const keydown = (key: string) => {
    input.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))
  }
  return { api, input, content, options, scrolls, navigate, keydown }
}

export function testHighlightedItems(values: string[]) {
  describe.each([true, false])('combobox highlighted item (composite=%s)', (composite) => {
    it.each(values)(
      'scrolls to and navigates the keyboard-selected option %s across repeated opens',
      async (value) => {
        const { api, input, content, options, scrolls, navigate, keydown } = renderCombobox(composite, value)
        for (let cycle = 0; cycle < 2; cycle++) {
          api().setOpen(true)
          await expect.poll(() => content.hidden).toBe(false)
          input.focus()
          keydown('Home')
          await expect.poll(() => api().highlightedValue).toBe('First')
          await expect.poll(() => scrolls[0].mock.calls.length).toBeGreaterThan(0)
          keydown('End')
          await expect.poll(() => api().highlightedValue).toBe('Last')
          await expect.poll(() => scrolls[2].mock.calls.length).toBeGreaterThan(0)
          scrolls[1].mockClear()
          keydown('ArrowUp')
          await expect.poll(() => api().highlightedValue).toBe(value)
          expect(input.getAttribute('aria-activedescendant')).toBe(options[1].id)
          expect(document.activeElement).toBe(input)
          await expect.poll(() => scrolls[1].mock.calls).toContainEqual([{ block: 'nearest' }])
          keydown('Enter')
          await expect.poll(() => api().value).toEqual([value])
          expect(navigate).toHaveBeenLastCalledWith({ value, node: options[1] })
          expect(navigate).toHaveBeenCalledTimes(cycle + 1)
          await expect.poll(() => input.value).toBe(value)
          await expect.poll(() => content.hidden).toBe(true)
          for (const scroll of scrolls)
            scroll.mockClear()
        }
      },
    )
  })
}
