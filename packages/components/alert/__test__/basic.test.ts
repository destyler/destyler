import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { DestylerAlert } from '../src/alert'

describe('alert', () => {
  it('should work with import on demand', () => {
    mount(DestylerAlert)
  })

  it('should have a role of "alert"', () => {
    const wrapper = mount(DestylerAlert)
    expect(wrapper.find('div[destyler="alert"]').attributes('role')).toBe('alert')
    wrapper.unmount()
  })
})
