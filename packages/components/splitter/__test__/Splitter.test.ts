import { beforeEach, describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Splitter from './Splitter.spec.vue'

describe('test splitter functionalities', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('should mount', async () => {
    mount(Splitter)
  })
})
