// @vitest-environment happy-dom
import { createNormalizer } from '@destyler/types'
import { describe, expect, it } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

const normalize = createNormalizer(props => props)

describe('scroll-area thumb styling', () => {
  it.each(['vertical', 'horizontal'] as const)('leaves the %s thumb color to consumer CSS while preserving geometry', (orientation) => {
    const service = machine({ id: 'unstyled-thumb', type: 'always' })
    service.start()
    try {
      service.send({ type: 'RESIZE', viewportHeight: 100, viewportWidth: 100, contentHeight: 1000, contentWidth: 1000 })
      const api = connect(service.getState(), service.send, normalize)
      const props = api.getThumbProps({ orientation })
      expect(props.style).not.toHaveProperty('backgroundColor')
      expect(props.style).not.toHaveProperty('background')
      expect(props.style).toMatchObject({
        position: 'absolute',
        touchAction: 'none',
        [orientation === 'vertical' ? 'width' : 'height']: '100%',
      })
      expect(props['data-orientation']).toBe(orientation)
      expect(props.onPointerDown).toBeTypeOf('function')
    }
    finally {
      service.stop()
    }
  })
})
