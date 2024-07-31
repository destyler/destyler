import { beforeEach, describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { findAllByText, findByText, fireEvent } from '@testing-library/vue'
import Modal from './Modal.spec.vue'

describe('default Modal', async () => {
  let wrapper: VueWrapper<InstanceType<typeof Modal>>
  let trigger: HTMLElement

  beforeEach(async () => {
    wrapper = mount(Modal, { attachTo: document.body })
    trigger = await findByText(wrapper.element as HTMLElement, 'Open')
  })

  it('should pass axe accessibility tests', async () => {
    expect(await axe(document.body)).toHaveNoViolations()

    // open modal
    wrapper.find('button').element.click()
    await nextTick()
    expect(await axe(document.body)).toHaveNoViolations()
  })

  describe('after clicking the trigger', () => {
    beforeEach(async () => {
      fireEvent.click(trigger)
    })

    it('should open the content', () => {
      expect(document.body.innerHTML).toContain('Title')
    })

    it('should focus the cancel button', async () => {
      const cancelButton = await findAllByText(document.body, 'Cancel')
      expect(cancelButton[cancelButton.length - 1]).toBe(document.activeElement)
    })
  })
})
