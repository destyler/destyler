import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { Slot } from '../src'

describe('test Slot functionalities', () => {
  it('should work with import on demand', () => {
    mount(Slot)
  })

  it('with onClick on itself', async () => {
    const wrapper = mount(Slot, {
      slots: {
        default: () => h('button', {
          type: 'button',
          class: 't',
        }, 'Click me'),
      },
    })
    expect(wrapper.html()).equal('<button type="button" class="t">Click me</button>')
  })
})
