import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { DestylerCountdown } from '../src'

describe('basic', () => {
  it('should work with import on demand', () => {
    mount(DestylerCountdown)
  })

  it('should work with `duration` prop', async () => {
    const wrapper = mount(DestylerCountdown, {
      props: {
        duration: 2 * 3600 * 1000,
      },
    })
    expect(wrapper.text()).toBe('02:00:00')
    wrapper.unmount()
  })
  it('should work with `precision`&`active` prop`', async () => {
    const wrapper = mount(DestylerCountdown, {
      props: {
        duration: 2 * 3600 * 1000,
        active: false,
      },
    })
    expect(wrapper.text()).toBe('02:00:00')
    await wrapper.setProps({ precision: 1 })
    expect(wrapper.text()).toBe('02:00:00.0')
    await wrapper.setProps({ precision: 2 })
    expect(wrapper.text()).toBe('02:00:00.00')
    await wrapper.setProps({ precision: 3 })
    expect(wrapper.text()).toBe('02:00:00.000')
    await wrapper.setProps({ active: true })
    expect(wrapper.text()).not.toBe('02:00:00.000')
    wrapper.unmount()
  })
})
