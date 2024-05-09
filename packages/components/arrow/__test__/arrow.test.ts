import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { DestylerArrow } from '../src'
import DestylerArrowDemo from '../demos/Arrow.demo.vue'

describe('arrow', () => {
  it('should work with import on demand', () => {
    mount(DestylerArrow)
  })

  it('should result in obtaining an SVG.', () => {
    expect(mount(DestylerArrowDemo).find('svg').html()).toContain('svg')
  })
})
