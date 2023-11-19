import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { DestylerLabel } from '../src'

describe('Basic', () => {
  it('should work with import on demand', () => {
    mount(DestylerLabel)
  })

  it('should render without crashing', async () => {
    const label = mount(DestylerLabel)
    expect(label.html()).toBe('<label destyler="label"></label>')
  })
  it('should render with a default slot', async () => {
    const label = mount(DestylerLabel, {
      slots:{
        default: 'Label',
      }
    })
    expect(label.html()).toBe('<label destyler="label">Label</label>')
  })
  it('should render with a `for` attribute', async () => {
    const label = mount(DestylerLabel, { props: { for: 'input' } })
    expect(label.html()).toBe('<label for="input" destyler="label"></label>')
  })
  it('should render with a `for` attribute and a default slot', async () => {
    const label = mount(DestylerLabel, {
      props: { for: 'input' },
      slots: { default: 'Label' },
    })
    expect(label.html()).toBe('<label for="input" destyler="label">Label</label>')
  })
})
