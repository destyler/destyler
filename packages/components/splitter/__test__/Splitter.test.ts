import { beforeEach, describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Splitter from './Splitter.spec.vue'

describe('test splitter functionalities', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('should mount', async () => {
    mount(Splitter)
  })
})
