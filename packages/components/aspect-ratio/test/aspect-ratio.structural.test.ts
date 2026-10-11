import { createNormalizer } from '@destyler/types'
import { afterEach, describe, expect, it } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

const cleanups: VoidFunction[] = []
afterEach(() => cleanups.splice(0).forEach(cleanup => cleanup()))
const normalize = createNormalizer(props => props)

describe('aspect-ratio prop contracts (not physical layout)', () => {
  it('exposes matching containing-block and fill styles with separate custom IDs', () => {
    const service = machine({ id: 'frame', ratio: 16 / 9, dir: 'rtl', ids: { root: 'frame-root', content: 'frame-content' } })
    service.start()
    cleanups.push(() => service.stop())
    const api = () => connect(service.getState(), service.send, normalize)
    expect(api().getRootProps()).toMatchObject({ id: 'frame-root', dir: 'rtl', style: { position: 'relative', width: '100%', paddingBottom: '56.25%' } })
    expect(api().getContentProps()).toMatchObject({ id: 'frame-content', dir: 'rtl', style: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 } })
    api().setRatio(2)
    expect(api().getRootProps().style.paddingBottom).toBe('50%')
    service.setContext({ ratio: 0.5, ids: { root: 'next-root', content: 'next-content' } })
    expect(api().getRootProps()).toMatchObject({ id: 'next-root', style: { paddingBottom: '200%' } })
    expect(api().getContentProps().id).toBe('next-content')
  })

  it('defaults to a square and keeps generated IDs stable across ratio changes', () => {
    const service = machine({ id: 'square' })
    service.start()
    cleanups.push(() => service.stop())
    const api = () => connect(service.getState(), service.send, normalize)
    expect(api().getRootProps()).toMatchObject({ id: 'aspect-ratio:square', style: { paddingBottom: '100%' } })
    api().setRatio(4 / 3)
    expect(api().getRootProps()).toMatchObject({ id: 'aspect-ratio:square', style: { paddingBottom: '75%' } })
    expect(api().getContentProps().id).toBe('aspect-ratio:square:content')
  })
})
