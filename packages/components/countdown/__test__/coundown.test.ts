import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { sleep } from '@destyler/shared'
import type { CountdownProps } from '../src/countdown'
import { DestylerCountdown } from '../src/countdown'

describe('DestylerCountdown', () => {
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
  it('should work with `render` prop', () => {
    const render: CountdownProps['render'] = ({
      hours = 1,
      minutes = 1,
      seconds = 1,
      milliseconds = 1,
    }) => {
      return `${hours}:${minutes}:${seconds}:${milliseconds}`
    }
    const wrapper = mount(DestylerCountdown, {
      props: {
        render,
      },
    })
    expect(wrapper.text()).not.toBe('1:1:1:1')
    wrapper.unmount()
  })
  it('should work with `on-finish` prop', async () => {
    const onFinish = vi.fn()
    const wrapper = mount(DestylerCountdown, {
      props: {
        duration: 1,
        onFinish,
      },
    })
    await sleep(100)
    expect(onFinish).toHaveBeenCalled()
    wrapper.unmount()
  })
})
