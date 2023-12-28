import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { DestylerTemplate } from '../src/template'

describe('basic', () => {
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
