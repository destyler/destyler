import type { PropTypes } from '@destyler/types'
import type { UserDefinedContext } from '../src/types'
import { createNormalizer } from '@destyler/types'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

const normalize = createNormalizer<PropTypes>(value => value)
const cleanups: VoidFunction[] = []

afterEach(() => {
  cleanups.splice(0).reverse().forEach(cleanup => cleanup())
})

function setup(context: Partial<UserDefinedContext> = {}) {
  const service = machine({ id: 'removal', ...context })
  const api = () => connect(service.state, service.send, normalize)
  const root = document.createElement('div')
  root.id = api().getRootProps().id!
  const image = document.createElement('img')
  const imageProps = api().getImageProps()
  image.id = imageProps.id!
  image.dataset.scope = String(imageProps['data-scope'])
  image.dataset.part = String(imageProps['data-part'])
  Object.defineProperty(image, 'complete', { configurable: true, value: false })
  root.append(image)
  document.body.append(root)
  cleanups.push(() => root.remove(), () => service.stop())
  service.start()
  api().setLoaded()
  expect(api().loaded).toBe(true)
  return { service, api, root, image }
}

async function flushMutations() {
  await new Promise(resolve => setTimeout(resolve, 0))
}

describe('image owned-image removal', () => {
  it('shows the fallback when the image emitted by connect is removed', async () => {
    const { image, api, service } = setup()
    image.remove()
    await flushMutations()
    expect(service.state.matches('error')).toBe(true)
    expect(api().loaded).toBe(false)
    expect(api().getFallbackProps().hidden).toBe(false)
  })

  it('examines removal records after an unrelated first mutation', async () => {
    const { image, root, service } = setup()
    root.append(document.createElement('span'))
    image.remove()
    await flushMutations()
    expect(service.state.matches('error')).toBe(true)
  })

  it('detects a removed wrapper containing the owned image', async () => {
    const { image, root, service } = setup()
    const wrapper = document.createElement('div')
    root.append(wrapper)
    wrapper.append(image)
    await flushMutations()
    expect(service.state.matches('loaded')).toBe(true)
    wrapper.remove()
    await flushMutations()
    expect(service.state.matches('error')).toBe(true)
  })

  it('honors custom image IDs without selector escaping assumptions', async () => {
    const { image, service } = setup({ ids: { image: 'custom"image[odd]' } })
    image.remove()
    await flushMutations()
    expect(service.state.matches('error')).toBe(true)
  })

  it('ignores a removed legacy-avatar lookalike while its own image remains', async () => {
    const { root, service } = setup()
    const foreign = document.createElement('img')
    foreign.dataset.scope = 'avatar'
    foreign.dataset.part = 'image'
    root.append(foreign)
    await flushMutations()
    foreign.remove()
    await flushMutations()
    expect(service.state.matches('loaded')).toBe(true)
  })

  it('does not mistake a nested unrelated image for its own', async () => {
    const { root, image, service } = setup()
    const foreign = image.cloneNode() as HTMLImageElement
    foreign.id = 'another-instance-image'
    root.append(foreign)
    await flushMutations()
    foreign.remove()
    await flushMutations()
    expect(service.state.matches('loaded')).toBe(true)
  })

  it('keeps the loaded state when its image only moves within the root', async () => {
    const { root, image, service } = setup()
    const wrapper = document.createElement('div')
    root.append(wrapper)
    wrapper.append(image)
    await flushMutations()
    expect(service.state.matches('loaded')).toBe(true)
  })

  it('disconnects removal observation on stop', async () => {
    const onStatusChange = vi.fn()
    const { image, service } = setup({ onStatusChange })
    onStatusChange.mockClear()
    service.stop()
    image.remove()
    await flushMutations()
    expect(service.state.value).toBe('')
    expect(onStatusChange).not.toHaveBeenCalled()
  })
})
