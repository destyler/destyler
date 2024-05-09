import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import { DestylerBreadcrumbsRoot } from '../src'
import BasicTestVue from '../demos/Breadcrumbs.spec.vue'

describe('breadcrumbs', () => {
  it('should work with import on demand', () => {
    mount(DestylerBreadcrumbsRoot)
  })

  it('should have default \'aria-label\'', () => {
    const inst = mount(DestylerBreadcrumbsRoot)

    expect(inst.find('nav').attributes('aria-label')).toContain('breadcrumbs')
    inst.unmount()
  })

  it('should have default separator', async () => {
    const inst = mount(BasicTestVue)
    await inst.vm.$nextTick()

    const separators = inst.findAll('span')
    const style = window.getComputedStyle(separators[separators.length - 1].element)
    expect(style.display).toBe('none')
  })
})
