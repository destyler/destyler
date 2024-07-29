import { beforeEach, describe, expect, it } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import Pagination from './Pagination.spec.vue'

describe('default Pagination', () => {
  let wrapper: VueWrapper<InstanceType<typeof Pagination>>

  beforeEach(() => {
    document.body.innerHTML = ''
    wrapper = mount(Pagination, { attachTo: document.body })
  })

  it('should pass axe accessibility tests', async () => {
    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  it('should have first page selected by default', () => {
    expect(wrapper.find('[aria-label="Page 1"]').attributes('data-selected')).toBe('true')
    expect(wrapper.find('[aria-label="Page 2"]').attributes('data-selected')).toBe(undefined)
  })

  describe('after clicking on Next Page trigger', () => {
    beforeEach(async () => {
      await wrapper.find('[aria-label="Next Page"]').trigger('click')
    })

    it('should have set to page 2', () => {
      expect(wrapper.find('[aria-label="Page 1"]').attributes('data-selected')).toBe(undefined)
      expect(wrapper.find('[aria-label="Page 2"]').attributes('data-selected')).toBe('true')
    })
  })

  describe('after clicking on Page 3 trigger', () => {
    beforeEach(async () => {
      await wrapper.find('[aria-label="Page 3"]').trigger('click')
    })

    it('should have set to page 2', () => {
      expect(wrapper.find('[aria-label="Page 1"]').attributes('data-selected')).toBe(undefined)
      expect(wrapper.find('[aria-label="Page 3"]').attributes('data-selected')).toBe('true')
    })
  })

  describe('after clicking on Last Page trigger', () => {
    beforeEach(async () => {
      await wrapper.find('[aria-label="Last Page"]').trigger('click')
    })

    it('should have set to page 10', () => {
      // first page will be hidden
      expect(wrapper.find('[aria-label="Page 1"]').exists()).toBeFalsy()
      expect(wrapper.find('[aria-label="Page 10"]').attributes('data-selected')).toBe('true')
    })
  })
})

describe('given show-edges Pagination', () => {
  let wrapper: VueWrapper<InstanceType<typeof Pagination>>

  beforeEach(() => {
    document.body.innerHTML = ''
    wrapper = mount(Pagination, { props: { showEdges: true }, attachTo: document.body })
  })

  it('should pass axe accessibility tests', async () => {
    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  it('should have first page selected by default', () => {
    expect(wrapper.find('[aria-label="Page 1"]').attributes('data-selected')).toBe('true')
    expect(wrapper.find('[aria-label="Page 2"]').attributes('data-selected')).toBe(undefined)
  })

  it('should always show Page 1 & Page 10', () => {
    expect(wrapper.find('[aria-label="Page 1"]').exists()).toBe(true)
    expect(wrapper.find('[aria-label="Page 2"]').exists()).toBe(true)
  })

  describe('after clicking on Next Page trigger', () => {
    beforeEach(async () => {
      await wrapper.find('[aria-label="Next Page"]').trigger('click')
    })

    it('should have set to page 2', () => {
      expect(wrapper.find('[aria-label="Page 1"]').attributes('data-selected')).toBe(undefined)
      expect(wrapper.find('[aria-label="Page 2"]').attributes('data-selected')).toBe('true')
    })
  })

  describe('after clicking on Last Page trigger', () => {
    beforeEach(async () => {
      await wrapper.find('[aria-label="Last Page"]').trigger('click')
    })

    it('should have set to page 10', () => {
      expect(wrapper.find('[aria-label="Page 1"]').exists()).toBe(true)
      expect(wrapper.find('[aria-label="Page 10"]').attributes('data-selected')).toBe('true')
    })
  })

  describe('after clicking on Page 5 trigger', () => {
    beforeEach(async () => {
      await wrapper.find('[aria-label="Page 5"]').trigger('click')
    })

    it('should have page 2', () => {
      expect(wrapper.find('[aria-label="Page 2"]').exists()).toBe(true)
      expect(wrapper.find('[aria-label="Page 3"]').exists()).toBe(true)
      expect(wrapper.find('[aria-label="Page 4"]').exists()).toBe(true)
    })

    it('should not have page 8', () => {
      expect(wrapper.find('[aria-label="Page 6"]').exists()).toBe(true)
      expect(wrapper.find('[aria-label="Page 7"]').exists()).toBe(true)
      expect(wrapper.find('[aria-label="Page 8"]').exists()).toBe(false)
    })

    it('should have right ellipsis', () => {
      expect(wrapper.findAll('[data-type="ellipsis"]').length).toBe(1)
    })
  })
})

describe('given small total value', () => {
  let wrapper: VueWrapper<InstanceType<typeof Pagination>>

  beforeEach(() => {
    document.body.innerHTML = ''
    wrapper = mount(Pagination, { attachTo: document.body, props: { total: 13 } })
  })

  it('should pass axe accessibility tests', async () => {
    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  it('should have first page selected by default', () => {
    expect(wrapper.find('[aria-label="Page 1"]').attributes('data-selected')).toBe('true')
    expect(wrapper.find('[aria-label="Page 2"]').attributes('data-selected')).toBe(undefined)
  })

  it('should have only 2 page button', () => {
    expect(wrapper.findAll('[data-type="page"').length).toBe(2)
  })

  describe('after clicking on Next Page trigger', () => {
    beforeEach(async () => {
      await wrapper.find('[aria-label="Next Page"]').trigger('click')
    })

    it('should have set to page 2', () => {
      expect(wrapper.find('[aria-label="Page 1"]').attributes('data-selected')).toBe(undefined)
      expect(wrapper.find('[aria-label="Page 2"]').attributes('data-selected')).toBe('true')
    })
  })

  describe('after clicking on Last Page trigger', () => {
    beforeEach(async () => {
      await wrapper.find('[aria-label="Last Page"]').trigger('click')
    })

    it('should have set to page 2', () => {
      // first page will be hidden
      expect(wrapper.find('[aria-label="Page 1"]').exists()).toBeTruthy()
      expect(wrapper.find('[aria-label="Page 2"]').attributes('data-selected')).toBe('true')
    })
  })
})
