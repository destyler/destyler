import type { UserDefinedContext } from '../src/types'
import { createNormalizer } from '@destyler/types'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

const normalize = createNormalizer(value => value)
const cleanups: VoidFunction[] = []
afterEach(() => cleanups.splice(0).reverse().forEach(cleanup => cleanup()))

function mount(context: Partial<UserDefinedContext> = {}, cancelClick = false) {
  const onValueChange = vi.fn(context.onValueChange)
  const onSelect = vi.fn()
  const service = machine({ id: 'navigation-dom-notifications', ...context, onValueChange }).start()
  const api = () => connect(service.getState(), service.send, normalize)
  const root = document.createElement('nav')
  const select = document.createElement('button')
  select.type = 'button'
  select.textContent = 'Open products'
  const link = document.createElement('a')
  link.href = '#notification-test'
  link.textContent = 'Choose link'
  const events = new AbortController()
  select.addEventListener('click', () => api().setValue('products'), { signal: events.signal })
  link.addEventListener('click', (event) => {
    if (cancelClick)
      event.preventDefault()
    const props = api().getLinkProps({ value: 'docs', onSelect })
    Reflect.apply(props.onClick!, link, [event])
    // These cases test notification ownership, not hyperlink navigation.
    event.preventDefault()
  }, { signal: events.signal })
  root.append(select, link)
  document.body.append(root)
  const unsubscribe = service.subscribe(() => root.dataset.state = api().open ? 'open' : 'closed')
  cleanups.push(() => root.remove(), () => service.stop(), unsubscribe, () => events.abort())
  return { service, api, root, select, link, onValueChange, onSelect }
}

describe('navigationMenu connected notification ownership', () => {
  it('reports one public setter change from an actual DOM click', async () => {
    const fixture = mount()
    fixture.select.click()
    await Promise.resolve()
    await expect.poll(() => fixture.root.dataset.state).toBe('open')
    expect(fixture.api().value).toBe('products')
    expect(fixture.onValueChange.mock.calls).toEqual([[{ value: 'products' }]])
  })

  it('reports one close after selecting a link from open uncontrolled content', async () => {
    const fixture = mount({ defaultValue: 'products' })
    fixture.link.click()
    await Promise.resolve()
    expect(fixture.onSelect).toHaveBeenCalledTimes(1)
    expect(fixture.onValueChange.mock.calls).toEqual([[{ value: null }]])
    await expect.poll(() => fixture.root.dataset.state).toBe('closed')
  })

  it('selects a top-level link without announcing an unchanged closed value', () => {
    const fixture = mount()
    fixture.link.click()
    expect(fixture.onSelect).toHaveBeenCalledTimes(1)
    expect(fixture.onValueChange).not.toHaveBeenCalled()
    expect(fixture.api().value).toBe(null)
  })

  it('preserves consumer cancellation before the connector handler', () => {
    const fixture = mount({ defaultValue: 'products' }, true)
    fixture.link.click()
    expect(fixture.onSelect).not.toHaveBeenCalled()
    expect(fixture.onValueChange).not.toHaveBeenCalled()
    expect(fixture.api().value).toBe('products')
  })

  it('keeps controlled link-close requests vetoable and accepts delayed context without echo', async () => {
    const fixture = mount({ value: 'products' })
    fixture.link.click()
    await Promise.resolve()
    expect(fixture.api().value).toBe('products')
    await expect.poll(() => fixture.root.dataset.state).toBe('open')
    expect(fixture.onSelect).toHaveBeenCalledTimes(1)
    expect(fixture.onValueChange.mock.calls).toEqual([[{ value: null }]])
    fixture.service.setContext({ value: null })
    await Promise.resolve()
    await expect.poll(() => fixture.root.dataset.state).toBe('closed')
    expect(fixture.onValueChange).toHaveBeenCalledTimes(1)
  })

  it('preserves immediate controlled acceptance without repeated link selection or callback', async () => {
    const fixture = mount({ value: 'products', onValueChange: ({ value }) => fixture.service.setContext({ value }) })
    fixture.link.click()
    await Promise.resolve()
    expect(fixture.api().value).toBe(null)
    expect(fixture.onSelect).toHaveBeenCalledTimes(1)
    expect(fixture.onValueChange).toHaveBeenCalledExactlyOnceWith({ value: null })
  })
})
