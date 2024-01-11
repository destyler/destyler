import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { DestylerPrimitive } from '../src/primitive'

describe('test Primitive functionalities', () => {
  it('should work with import on demand', () => {
    mount(DestylerPrimitive)
  })

  it('should render button element correctly', async () => {
    const wrapper = mount(DestylerPrimitive, {
      props: {
        as: 'button',
      },
    })
    expect(wrapper.find('button').exists()).toBe(true)
    wrapper.unmount()
  })
})
