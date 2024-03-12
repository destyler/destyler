import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { DestylerBackTop } from '../src'

describe('backTop', () => {
  it('should work with import on demand', () => {
    mount(DestylerBackTop)
  })
})
