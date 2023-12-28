import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { DestylerTooltip } from '../src'

describe('destylerTooltip', () => {
  it('should work with import on demand', () => {
    mount(DestylerTooltip, {
      slots: {
        trigger: () => 'elonehoo',
      },
    })
  })
  it('should work with `show` props', async () => {
    const wrapper = mount(DestylerTooltip, {
      slots: {
        default: () => 'test-default',
        trigger: () => h('span', 'test-trigger'),
      },
      attachTo: document.body,
    })
    expect(document.querySelector('.tooltip')).toEqual(null)

    wrapper.unmount()
  })
})
