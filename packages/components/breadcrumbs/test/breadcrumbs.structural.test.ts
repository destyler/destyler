import { createNormalizer } from '@destyler/types'
import { afterEach, describe, expect, it } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

const cleanups: VoidFunction[] = []
afterEach(() => cleanups.splice(0).forEach(cleanup => cleanup()))
const normalize = createNormalizer(props => props)
const home = { id: 'home', label: 'Home', href: '/' }
const current = { id: 'current', label: 'Current' }

function setup(ids?: { root?: string, list?: string }) {
  const service = machine({ id: 'trail', items: [home, current], ids })
  service.start()
  cleanups.push(() => service.stop())
  return { service, api: () => connect(service.getState(), service.send, normalize) }
}

describe('breadcrumbs structural contracts', () => {
  it('uses its list identity and updates caller-provided IDs independently of the root', () => {
    const { service, api } = setup({ root: 'navigation', list: 'ordered-trail' })
    expect(api().getRootProps().id).toBe('navigation')
    expect(api().getListProps()).toMatchObject({ id: 'ordered-trail', role: 'list' })
    service.setContext({ ids: { root: 'next-navigation', list: 'next-trail' } })
    expect(api().getRootProps().id).toBe('next-navigation')
    expect(api().getListProps().id).toBe('next-trail')
    expect(setup().api().getListProps().id).toBeUndefined()
  })

  it('preserves destination, current-page and decorative separator semantics', () => {
    const { api } = setup()
    expect(api().getRootProps()).toMatchObject({ 'role': 'navigation', 'aria-label': 'breadcrumbs' })
    expect(api().getLinkProps(home)).toMatchObject({ role: 'link', href: '/' })
    expect(api().getLinkProps(home)['aria-current']).toBeUndefined()
    expect(api().getLinkProps(current)).toMatchObject({ 'aria-current': 'page', 'data-current': 'page' })
    expect(api().getLinkProps(current).href).toBeUndefined()
    expect(api().getLinkProps(current).role).toBeUndefined()
    expect(api().getLinkProps(current).tabIndex).toBeUndefined()
    expect(api().getSeparatorProps()['aria-hidden']).toBe(true)
  })

  it('allows an explicit current page with a destination and non-current text items', () => {
    const { api } = setup()
    expect(api().getLinkProps({ ...home, current: true })).toMatchObject({
      'role': 'link',
      'href': '/',
      'aria-current': 'page',
      'data-current': 'page',
    })
    const text = api().getLinkProps({ ...current, current: false })
    expect(text['aria-current']).toBeUndefined()
    expect(text['data-current']).toBeUndefined()
    expect(text.role).toBeUndefined()
    expect(text.tabIndex).toBeUndefined()
    expect(api().getLinkProps({ ...current, current: true })['aria-current']).toBe('page')
    expect(api().getLinkProps({ ...home, current: false })['aria-current']).toBeUndefined()
  })

  it('tracks simultaneous hover and focus without losing either independent state', () => {
    const { api } = setup()
    api().getLinkProps(home).onPointerEnter?.({ defaultPrevented: false })
    api().getLinkProps(current).onFocus?.({ defaultPrevented: false })
    expect(api()).toMatchObject({ hoveredId: 'home', focusedId: 'current' })
    api().getLinkProps(home).onPointerLeave?.({ defaultPrevented: false })
    expect(api()).toMatchObject({ hoveredId: null, focusedId: 'current' })
    api().getLinkProps(current).onBlur?.({ defaultPrevented: false })
    expect(api()).toMatchObject({ hoveredId: null, focusedId: null })
  })

  it('ignores cancelled pointer and focus handlers', () => {
    const { api } = setup()
    api().getLinkProps(home).onPointerEnter?.({ defaultPrevented: true })
    api().getLinkProps(home).onFocus?.({ defaultPrevented: true })
    expect(api()).toMatchObject({ hoveredId: null, focusedId: null })
    api().getLinkProps(home).onPointerEnter?.({ defaultPrevented: false })
    api().getLinkProps(home).onFocus?.({ defaultPrevented: false })
    api().getLinkProps(home).onPointerLeave?.({ defaultPrevented: true })
    api().getLinkProps(home).onBlur?.({ defaultPrevented: true })
    expect(api()).toMatchObject({ hoveredId: 'home', focusedId: 'home' })
  })
})
