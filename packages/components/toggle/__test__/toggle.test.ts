import { beforeEach, describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { DestylerToggle } from '../src'

describe('toggle', () => {
  let wrapper: VueWrapper<InstanceType<typeof DestylerToggle>>

  beforeEach(() => {
    wrapper = mount(DestylerToggle, {
      attrs: { 'aria-label': 'DestylerToggle italic' },
    })
  })

  it('should pass axe accessibility tests', async () => {
    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  it('should not be toggled yet', () => {
    expect(wrapper.attributes('data-state')).toBe('off')
  })

  describe('after toggling', () => {
    beforeEach(() => {
      wrapper.trigger('click')
    })

    it('should be toggled on', () => {
      expect(wrapper.attributes('data-state')).toBe('on')
    })

    describe('after toggling again', () => {
      beforeEach(() => {
        wrapper.trigger('click')
      })

      it('should be toggled off', () => {
        expect(wrapper.attributes('data-state')).toBe('off')
      })
    })
  })
})

describe('given disabled DestylerToggle', () => {
  let wrapper: VueWrapper<InstanceType<typeof DestylerToggle>>

  beforeEach(() => {
    wrapper = mount(DestylerToggle, {
      props: { disabled: true },
      attrs: { 'aria-label': 'DestylerToggle italic' },
    })
  })

  it('should pass axe accessibility tests', async () => {
    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  it('should not be toggled yet', () => {
    expect(wrapper.attributes('data-state')).toBe('off')
  })

  describe('try toggling', () => {
    beforeEach(() => {
      wrapper.trigger('click')
    })

    it('should be toggled off', () => {
      expect(wrapper.attributes('data-state')).toBe('off')
    })

    it('should render disable attributes', () => {
      expect(wrapper.attributes('data-disabled')).toBe('')
      expect(wrapper.attributes('disabled')).toBe('')
    })
  })
})
