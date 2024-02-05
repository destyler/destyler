import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AvatarBasicDemo from '../demos/AvatarBasic.demo.vue'

describe('basic', () => {
  it('should work with import on demand', () => {
    mount(AvatarBasicDemo)
  })

  it('should not render the image initially', async () => {
    const wrapper = mount(AvatarBasicDemo, {
      props: {
        src: 'https://github.com/elonehoo.png',
      },
    })
    expect(wrapper.find('img').exists()).toBeFalsy()
    wrapper.unmount()
  })

  it('should render as snapshot', () => {
    const wrapper = mount(AvatarBasicDemo, {
      props: {
        src: 'https://github.com/elonehoo.png',
      },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
