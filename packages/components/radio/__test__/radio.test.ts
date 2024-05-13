import { beforeEach, describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import type { DOMWrapper, VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { fireEvent } from '@testing-library/vue'
import Radio from './Radio.spec.vue'
import RadioGroup from './RadioGroup.spec.vue'
import { handleSubmit, sleep } from '~/test/utils'

describe('given a default RadioGroup', () => {
  let wrapper: VueWrapper<InstanceType<typeof RadioGroup>>
  let radios: DOMWrapper<HTMLElement>[]

  beforeEach(() => {
    document.body.innerHTML = ''
    wrapper = mount(RadioGroup, { attachTo: document.body })
    radios = wrapper.findAll('[role=radio]')
  })

  it('should pass axe accessibility tests', async () => {
    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  it('should have default selected', () => {
    expect(radios[0].attributes('data-state')).toBe('checked')
  })

  it('should render icons', () => {
    expect(radios[0].find('span').exists()).toBeTruthy()
  })

  describe('on keyboard navigation', () => {
    beforeEach(async () => {
      radios[0].element.focus()
      await fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' })
      await sleep(0)
    })

    it('should skip disabled item', () => {
      expect(radios[1].attributes('data-state')).toBe('unchecked')
      expect(radios[2].element).toBe(document.activeElement)
    })

    it('should select next item on keydown', async () => {
      expect(radios[0].attributes('data-state')).toBe('unchecked')
      expect(radios[2].attributes('data-state')).toBe('checked')
      expect(radios[2].element).toBe(document.activeElement)
    })

    describe('on arrow up', () => {
      it('should select the first item again', async () => {
        await fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' })
        await sleep(0)
        expect(radios[0].attributes('data-state')).toBe('checked')
        expect(radios[2].attributes('data-state')).toBe('unchecked')
      })
    })
  })
})

describe('given radio in a form', async () => {
  const wrapper = mount({
    props: ['handleSubmit'],
    components: { Radio },
    template: '<form @submit="handleSubmit"><Radio  /></form>',
  }, {
    props: { handleSubmit },
  })

  it('should have hidden input field', async () => {
    expect(wrapper.find('[type="Radio"]').exists()).toBe(true)
  })

  describe('after clicking submit button', () => {
    beforeEach(async () => {
      await wrapper.find('button').trigger('click')
      await wrapper.find('form').trigger('submit')
    })

    it('should trigger submit once', () => {
      expect(handleSubmit).toHaveBeenCalledTimes(1)
      expect(handleSubmit.mock.results[0].value).toStrictEqual({ test: 'true' })
    })
  })

  describe('after uncheck and click submit button again', () => {
    beforeEach(async () => {
      await wrapper.find('button').trigger('click')
      await wrapper.find('form').trigger('submit')
    })

    it('should trigger submit once', () => {
      expect(handleSubmit).toHaveBeenCalledTimes(2)
      expect(handleSubmit.mock.results[1].value).toStrictEqual({ test: 'true' })
    })
  })
})
