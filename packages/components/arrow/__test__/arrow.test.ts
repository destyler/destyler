import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { DestylerArrow } from '../src'

describe('arrow', () => {
  it('should work with import on demand', () => {
    mount(DestylerArrow)
  })
})
