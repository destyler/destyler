import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { DestylerBreadcrumbsRoot } from '../src'

describe('breadcrumbs', () => {
  it('should work with import on demand', () => {
    mount(DestylerBreadcrumbsRoot)
  })

  it('should have default \'aria-label\'', () => {
    const inst = mount(DestylerBreadcrumbsRoot)

    expect(inst.find('nav').attributes('aria-label')).toContain('breadcrumbs')
  })
})
