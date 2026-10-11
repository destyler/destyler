import type { PropTypes } from '@destyler/types'
import { createNormalizer } from '@destyler/types'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

const normalize = createNormalizer<PropTypes>(value => value)
const cleanups: VoidFunction[] = []
const firstSrc = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>'
const secondSrc = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="2" height="2"/>'
const settle = () => new Promise(resolve => setTimeout(resolve, 0))

afterEach(() => {
  cleanups.splice(0).reverse().forEach(cleanup => cleanup())
})

function setup(imageId = 'image:set-src:image') {
  const onStatusChange = vi.fn()
  const service = machine({ id: 'set-src', ids: { image: imageId }, onStatusChange })
  const api = () => connect(service.state, service.send, normalize)
  const root = document.createElement('div')
  root.id = api().getRootProps().id!
  const image = document.createElement('img')
  image.id = imageId
  // Separate source routing from network/decode scheduling, which is native-browser only.
  Object.defineProperty(image, 'complete', { configurable: true, value: false })
  root.append(image)
  document.body.append(root)
  cleanups.push(() => root.remove(), () => service.stop())
  service.start()
  return { service, api, root, image, onStatusChange }
}

describe('image public setSrc', () => {
  it.each(['loading', 'loaded', 'error'] as const)('updates the owned image from %s and follows its existing status lifecycle', async (initial) => {
    const { service, api, image, onStatusChange } = setup()
    if (initial === 'loaded')
      api().setLoaded()
    if (initial === 'error')
      api().setError()
    onStatusChange.mockClear()
    api().setSrc(firstSrc)
    expect(image.getAttribute('src')).toBe(firstSrc)
    await settle()
    expect(service.state.matches('loading')).toBe(true)
    expect(api().getFallbackProps().hidden).toBe(false)
    expect(onStatusChange).not.toHaveBeenCalled()
    api().setLoaded()
    expect(onStatusChange).toHaveBeenCalledExactlyOnceWith({ status: 'loaded' })
    expect(api().getFallbackProps().hidden).toBe(true)
  })

  it('honors custom IDs and supports repeated source changes', async () => {
    const { api, image, service } = setup('image"custom[id]')
    api().setSrc(firstSrc)
    await settle()
    api().setLoaded()
    api().setSrc(secondSrc)
    await settle()
    expect(image.getAttribute('src')).toBe(secondSrc)
    expect(service.state.matches('loading')).toBe(true)
  })

  it('still observes direct DOM source changes as a control', async () => {
    const { api, image, service } = setup()
    api().setLoaded()
    image.setAttribute('src', firstSrc)
    await settle()
    expect(service.state.matches('loading')).toBe(true)
  })

  it('does not mutate the old DOM after the service stops', () => {
    const { api, service, image } = setup()
    service.stop()
    api().setSrc(firstSrc)
    expect(image.hasAttribute('src')).toBe(false)
  })

  it('remains safe when no owned image is mounted', () => {
    const { api, image, service } = setup()
    image.remove()
    expect(() => api().setSrc(firstSrc)).not.toThrow()
    expect(service.state.matches('loading')).toBe(true)
  })
})
