import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { Arrow } from '../src'
import DestylerArrowDemo from './Arrow.spec.vue'

describe('arrow', () => {
  it('should work with import on demand', () => {
    mount(Arrow)
  })

  it('should result in obtaining an SVG.', () => {
    expect(mount(DestylerArrowDemo).find('svg').html()).toContain('svg')
  })
})
