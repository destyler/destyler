import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, markRaw } from 'vue'
import { DestylerSlot } from '../src/slot'

describe('test DestylerPrimitive functionalities', () => {
  it('should work with import on demand', () => {
    mount(DestylerSlot)
  })
})
