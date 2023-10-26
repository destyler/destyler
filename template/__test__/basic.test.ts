import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import DestylerTemplate from '../src/template'

describe('Basic', () => {
  it('should work with import on demand', () => {
    mount(DestylerTemplate)
  })

  it('props', async () => {
    const inst = mount(DestylerTemplate, {
      props: {
        modelValue: 'Hi',
      },
    })
    expect((inst.text())).toBe('Hi')
    inst.unmount()
  })
})
