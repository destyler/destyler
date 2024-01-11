import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { DestylerSlot } from '../src/slot'

describe('test DestylerSlot functionalities', () => {
  it('should work with import on demand', () => {
    mount(DestylerSlot)
  })

  it('with onClick on itself', async () => {
    const wrapper = mount(DestylerSlot, {
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
