// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest'
import { flush, setup } from './splitter.test-helper'

describe('splitter separator orientation', () => {
  it.each(['ltr', 'rtl'])('keeps separator semantics perpendicular to layout in %s', async (dir) => {
    const { service, api } = setup({ dir })
    expect(api().getResizeTriggerProps({ id: 'a:b' })).toMatchObject({
      'role': 'separator',
      'data-orientation': 'horizontal',
      'aria-orientation': 'vertical',
      'style': { cursor: 'col-resize' },
    })
    service.setContext({ orientation: 'vertical' })
    await flush()
    expect(api().getResizeTriggerProps({ id: 'a:b' })).toMatchObject({
      'data-orientation': 'vertical',
      'aria-orientation': 'horizontal',
      'style': { cursor: 'row-resize' },
    })
  })
})
