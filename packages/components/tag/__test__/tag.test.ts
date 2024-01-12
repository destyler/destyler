import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { DestylerTag } from '../src'

describe('basic', () => {
  it('should work with import on demand', () => {
    mount(DestylerTag)
  })

  it('should have a role of "alert"', async () => {
    const wrapper = mount(DestylerTag)
    expect(wrapper.find('div').attributes('role')).toBe('tag')
    wrapper.unmount()
  })

  it('shouldn\'t closed when on-close prop returns false', async () => {
    const wrapper = mount(DestylerTag, {
      props: { closable: true, onClose: () => false },
    })
    const closeBtn = wrapper.find('div')
    await closeBtn.trigger('click')

    expect(wrapper.find('div').exists()).toBe(true)
    wrapper.unmount()
  })
})
