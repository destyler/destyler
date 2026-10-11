import type { PropTypes } from '@destyler/types'
import { createNormalizer } from '@destyler/types'
import { expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

it('setSrc loads real image bytes through the existing native load handler', async () => {
  const normalize = createNormalizer<PropTypes>(value => value)
  const onStatusChange = vi.fn()
  const service = machine({ id: 'native-src', onStatusChange })
  const api = () => connect(service.state, service.send, normalize)
  const root = document.createElement('div')
  root.id = api().getRootProps().id!
  const image = document.createElement('img')
  image.id = api().getImageProps().id!
  image.addEventListener('load', event => api().getImageProps().onLoad?.(event as never))
  image.addEventListener('error', event => api().getImageProps().onError?.(event as never))
  root.append(image)
  document.body.append(root)
  try {
    service.start()
    onStatusChange.mockClear()
    const src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="3" height="2"/>'
    api().setSrc(src)
    expect(image.getAttribute('src')).toBe(src)
    await vi.waitFor(() => expect(api().loaded).toBe(true))
    expect(image.complete).toBe(true)
    expect(image.naturalWidth).toBe(3)
    expect(image.naturalHeight).toBe(2)
    expect(onStatusChange).toHaveBeenCalledExactlyOnceWith({ status: 'loaded' })
  }
  finally {
    service.stop()
    root.remove()
  }
})
