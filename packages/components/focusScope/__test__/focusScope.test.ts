import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { DestylerFocusScope } from '../src'

describe('basic', () => {
  it('should work with import on demand', () => {
    mount(DestylerFocusScope)
  })
})
