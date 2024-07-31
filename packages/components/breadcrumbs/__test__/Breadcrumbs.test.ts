import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { render } from '@testing-library/vue'
import Breadcrumbs from './Breadcrumbs.spec.vue'

describe('default Breadcrumbs', () => {
  it('should pass axe accessibility tests', async () => {
    const wrapper = mount(Breadcrumbs)
    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  it('should have default separator', async () => {
    const wrapper = render(Breadcrumbs)
    const separators = wrapper.getAllByText('/')
    expect(separators.length).toBe(2)
  })
})
