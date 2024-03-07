import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import { mount } from '@vue/test-utils'

import {
  DestylerBreadcrumbsRoot,
} from '../src'
import BasicTestVue from './_Breadcrumbs.vue'

describe('breadcrumbs', () => {
  it('should work with import on demand', () => {
    mount(DestylerBreadcrumbsRoot)
  })

  it('should have default \'aria-label\'', () => {
    const inst = mount(DestylerBreadcrumbsRoot)

    expect(inst.find('nav').attributes('aria-label')).toContain('breadcrumbs')
    inst.unmount()
  })

  it('should have default separator', () => {
    const inst = render(BasicTestVue)

    const separators = inst.getAllByText('/')
    expect(separators.length).toBe(3)
  })
})
