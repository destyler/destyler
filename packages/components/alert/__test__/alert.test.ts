import { describe, expect, it, vi } from 'vitest'
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

  it('shouldnt have default title', () => {
    const wrapper = mount(DestylerAlert)
    expect(wrapper.find('div[destyler="alert"]').find('div[destyler="alert-body"]').find('div[destyler="alert-body-content"]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('should have designated title', () => {
    const title = 'unstyle alert'
    const wrapper = mount(DestylerAlert, {
      props: { title }
    })
    expect(wrapper.find('div[destyler="alert"]').find('div[destyler="alert-body"]').find('div[destyler="alert-body-title"]').text()).toBe(title)
    wrapper.unmount()
  })

  it('should work with `default` slot', () => {
    const wrapper = mount(DestylerAlert, {
      slots: {
        default: () => 'default'
      }
    })

    expect(wrapper.find('div[destyler="alert"]').find('div[destyler="alert-body"]').find('div[destyler="alert-body-content"]').exists()).toBe(true)
    expect(wrapper.find('div[destyler="alert"]').find('div[destyler="alert-body"]').find('div[destyler="alert-body-content"]').text()).toBe('default')
    wrapper.unmount()
  })

  it('should work with `header` slot', async () => {
    const wrapper = mount(DestylerAlert, {
      slots: {
        header: () => 'test-header'
      }
    })

    expect(wrapper.find('div[destyler="alert"]').find('div[destyler="alert-body"]').find('div[destyler="alert-body-title"]').text()).toBe('test-header')
    wrapper.unmount()
  })

  it('shouldnt be closable by default', () => {
    const wrapper = mount(DestylerAlert)
    expect(wrapper.find('div[destyler="alert"]').find('div[destyler="alert-close"]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('should be closable when designated', () => {
    const wrapper = mount(DestylerAlert, { props: { closable: true } })
    expect(wrapper.find('div[destyler="alert"]').find('div[destyler="alert-close"]').exists()).toBe(true)
    wrapper.unmount()
  })

  it("shouldn't closed when on-close prop returns false", async () => {
    const wrapper = mount(DestylerAlert, {
      props: { closable: true, onClose: () => false }
    })
    const closeBtn = wrapper.find('div[destyler="alert"]').find('div[destyler="alert-close"]')
    await closeBtn.trigger('click')

    expect(wrapper.find('div[destyler="alert"]').find('div[destyler="alert-close"]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('should trigger callback when closed', async () => {
    const handleCloseClick = vi.fn()
    const handleOnAfterLeave = vi.fn()
    const wrapper = mount(DestylerAlert, {
      props: {
        closable: true,
        onClose: handleCloseClick,
        onAfterLeave: handleOnAfterLeave
      }
    })
    const closeBtn = wrapper.find('div[destyler="alert"]').find('div[destyler="alert-close"]')
    expect(closeBtn.exists()).toBe(true)

    await closeBtn.trigger('click')
    expect(wrapper.emitted()).toHaveProperty('click')

    expect(handleCloseClick).toHaveBeenCalled()

    setTimeout(() => {
      expect(handleOnAfterLeave).toHaveBeenCalled()
      wrapper.unmount()
    }, 10)
  })
})
