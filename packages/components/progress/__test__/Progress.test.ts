import { beforeEach, describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { sleep } from '@destyler/test/utils.ts'
import Progress from './Progress.spec.vue'

describe('default Progress', () => {
  let wrapper: VueWrapper<InstanceType<typeof Progress>>

  beforeEach(() => {
    wrapper = mount(Progress)
  })

  it('should pass axe accessibility tests', async () => {
    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  it('shoud contain correct value', () => {
    expect(wrapper.html()).toContain('data-value="0"')
  })

  describe('after 200ms', () => {
    beforeEach(async () => {
      await sleep(200)
    })

    it('shoud contain correct value', async () => {
      expect(wrapper.html()).toContain('data-value="50"')
    })
  })
})
