import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { DestylerAlert } from '../src'

describe('basic', () => {
  it('should work with import on demand', () => {
    mount(DestylerAlert)
  })

  it('should have a role of "alert"', async () => {
    const wrapper = mount(DestylerAlert)
    expect(wrapper.find('div').attributes('role')).toBe('alert')
    wrapper.unmount()
  })

  it('shouldn\'t closed when on-close prop returns false', async () => {
    const wrapper = mount(DestylerAlert, {
      props: { closable: true, onClose: () => false },
    })
    const closeBtn = wrapper.find('div')
    await closeBtn.trigger('click')

    expect(wrapper.find('div').exists()).toBe(true)
    wrapper.unmount()
  })
})
