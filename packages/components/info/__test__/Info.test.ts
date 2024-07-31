import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { InfoClose, InfoRoot } from '../src'

describe('default info', () => {
  it('should have a role of "alert"', () => {
    const wrapper = mount(InfoRoot)
    expect(wrapper.find('[aria-label="Info"]').attributes('role')).toBe('info')
    wrapper.unmount()
  })

  it('should have designated title', () => {
    const title = 'sometimes destyler'
    const wrapper = mount(InfoRoot, {
      slots: {
        default: title,
      },
    })
    expect(wrapper.find('[aria-label="Info"]').text()).toBe(title)
    wrapper.unmount()
  })

  it('shouldn\'t closed when on-close prop returns false', async () => {
    const wrapper = mount(InfoRoot, {
      slots: {
        default: h(InfoClose),
      },
    })
    const closeBtn = wrapper.find('[aria-label="Info"]').find('[aria-label="Close"]')
    await closeBtn.trigger('click')
    expect(wrapper.find('[aria-label="Info"]').exists()).toBe(false)
    wrapper.unmount()
  })
})
