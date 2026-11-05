// @vitest-environment happy-dom
import { html, nothing, render } from 'lit'
import { afterEach, describe, expect, it } from 'vitest'
import { spread as litSpread } from '../../../frameworks/lit/src/directives/spread-props'
import { normalizeProps as litNormalize } from '../../../frameworks/lit/src/utils/normalize-props'
import { normalizeProps as vanillaNormalize } from '../../../frameworks/vanilla/src/normalize-props'
import { spreadProps as vanillaSpread } from '../../../frameworks/vanilla/src/spread-props'
import { collection } from '../src/collection'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

// Source normalizer/spread integration only, not controller lifecycle, hydration,
// browser focus, or accessibility-tree coverage for the published adapters.
const cleanups: (() => void)[] = []
afterEach(() => cleanups.splice(0).reverse().forEach(cleanup => cleanup()))

describe.each(['vanilla', 'lit'] as const)('select %s normalized List props', (adapter) => {
  function mount(composite: boolean) {
    const service = machine({
      id: `select-${adapter}`,
      collection: collection({ items: ['apple', 'banana'] }),
      composite,
      highlightedValue: 'apple',
      multiple: true,
    })
    const container = document.createElement('div')
    document.body.append(container)
    const normalize = adapter === 'vanilla' ? vanillaNormalize : litNormalize
    const api = () => connect(service.state, service.send, normalize)
    const view = () => html`<div ${litSpread(api().getListProps())}></div>`
    if (adapter === 'vanilla')
      container.append(document.createElement('div'))
    const update = () => {
      if (adapter === 'vanilla')
        vanillaSpread(container.firstElementChild!, api().getListProps())
      else
        render(view(), container)
    }
    update()
    cleanups.push(() => {
      if (adapter === 'lit')
        render(nothing, container)
      container.remove()
    })
    return { service, update, list: container.firstElementChild! }
  }

  it('omits default-mode List focusability and listbox ownership', () => {
    const { list } = mount(true)
    expect(list.hasAttribute('tabindex')).toBe(false)
    expect(list.hasAttribute('role')).toBe(false)
    expect(list.hasAttribute('aria-activedescendant')).toBe(false)
    expect(list.hasAttribute('aria-multiselectable')).toBe(false)
    expect(list.getAttribute('data-part')).toBe('list')
  })

  it('removes and restores List tabindex on the same element when mode changes', async () => {
    const { service, update, list } = mount(false)
    const check = (composite: boolean) => {
      expect(list.getAttribute('tabindex')).toBe(composite ? null : '0')
      // This guards the candidate's changed attribute only. A separate broader
      // probe records a pre-existing Vanilla role-removal issue on mode changes.
    }
    check(false)
    for (const composite of [true, false, true]) {
      service.setContext({ composite })
      await Promise.resolve()
      update()
      expect(list.parentElement?.firstElementChild).toBe(list)
      check(composite)
    }
  })
})
