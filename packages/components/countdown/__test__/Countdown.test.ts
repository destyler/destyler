import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import { Countdown, type CountdownProps } from '../src'

describe('default Countdown', () => {
  it('should work with `duration` prop', async () => {
    const wrapper = mount(Countdown, {
      props: {
        duration: 2 * 3600 * 1000,
      },
    })
    expect(wrapper.text()).toBe('02:00:00')
    wrapper.unmount()
  })

  it('should work with `precision`&`active` prop`', async () => {
    const wrapper = mount(Countdown, {
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
    const wrapper = mount(Countdown, {
      props: {
        render,
      },
    })
    expect(wrapper.text()).not.toBe('1:1:1:1')
    wrapper.unmount()
  })
})
