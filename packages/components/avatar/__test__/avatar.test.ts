import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { DestylerAvatar } from '../src'

describe('avatar', () => {
  it('image avatar', () => {
    const wrapper = mount(DestylerAvatar, {
      props: {
        src: 'https://github.com/elonehoo.png',
      },
    })
    expect(wrapper.find('img').exists()).toBe(true)
    expect(wrapper.html()).toMatchSnapshot()
    wrapper.unmount()
  })
  it('image avatar error handle when load failed', async () => {
    const onError = vi.fn()
    const wrapper = mount(DestylerAvatar, {
      props: {
        src: 'https://github.com/elonehoo.png',
        onError,
      },
    })
    await wrapper.find('img').trigger('error')
    expect(onError).toHaveBeenCalled()
    wrapper.unmount()
  })
})
