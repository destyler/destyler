import { beforeEach, describe, expect, it } from 'vitest'
import type { DOMWrapper, VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import Toolbar from './Toolbar.spec.vue'

describe('toolbar', () => {
  let wrapper: VueWrapper<InstanceType<typeof Toolbar>>
  let triggers: DOMWrapper<HTMLElement>[]

  beforeEach(() => {
    wrapper = mount(Toolbar, { attachTo: document.body })
    triggers = wrapper.findAll('button')
  })

  it('should pass axe accessibility tests', async () => {
    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  it('should have default selected value', () => {
    const selected = triggers.filter(i => i.attributes('data-state') === 'on').map(i => i.element)
    expect(selected.includes(triggers[4].element)).toBeTruthy()
  })
})
