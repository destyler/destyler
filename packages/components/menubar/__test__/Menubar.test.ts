import { beforeEach, describe, expect, it } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { findByRole } from '@testing-library/vue'
import Menubar from './Menubar.spec.vue'

describe('given default Menubar', () => {
  let wrapper: VueWrapper<InstanceType<typeof Menubar>>
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  beforeEach(() => {
    document.body.innerHTML = ''
    wrapper = mount(Menubar, { attachTo: document.body })
  })

  it('should render all trigger button', () => {
    expect(wrapper.findAll('button').length).toBe(4)
  })

  it('should pass axe accessibility tests', async () => {
    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  describe('after opening the dropdown', () => {
    beforeEach(async () => {
      await wrapper.find('button').trigger('pointerdown', {
        button: 0,
        ctrlKey: false,
      })
    })

    it('should pass axe accessibility tests', async () => {
      expect(await axe(wrapper.element)).toHaveNoViolations()
    })

    it('should render the menu', async () => {
      expect(await findByRole(wrapper.element as HTMLElement, 'menu')).toBeTruthy()
    })

    describe('after selecting the first item', () => {
      beforeEach(async () => {
        const item = wrapper.find('[role="menubar"]').find('[role="menuitem"]')
        await item.trigger('click')
      })

      it('should close the modal', () => {
        expect(wrapper.find('[role="menu"]').exists()).toBe(true)
      })

      it('should emit select event', () => {
        expect(wrapper.emitted('select')?.length).toBe(undefined)
      })
    })
  })
})
