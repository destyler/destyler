import { beforeEach, describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { findByText, fireEvent } from '@testing-library/vue'
import Collapse from './Collapse.spec.vue'

describe.skip('collapse', () => {
  let wrapper: VueWrapper<InstanceType<typeof Collapse>>
  beforeEach(() => {
    document.body.innerHTML = ''
    wrapper = mount(Collapse, { attachTo: document.body })
  })

  it.skip('should pass axe accessibility tests', async () => {
    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  describe('when navigating by keyboard', () => {
    beforeEach(() => {
      const trigger = wrapper.find('button')
      trigger.element.focus()
    })

    describe('on `ArrowDown`', () => {
      it('should move focus to the next trigger', () => {
        fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' })
        const trigger = wrapper.findAll('button')[1].element
        expect(trigger).toBe(document.activeElement)
      })

      it('should move focus to the first item if at the end', () => {
        const triggers = wrapper.findAll('button').map(i => i.element)
        triggers[3].focus()
        fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' })
        expect(triggers[0]).toBe(document.activeElement)
      })
    })
  })
})
