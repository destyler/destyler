import { beforeAll, describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { findByAltText, findByText } from '@testing-library/vue'
import Avatar from './Image.spec.vue'

const FALLBACK = 'EH'
const DELAY = 350

it('should pass axe accessibility tests', async () => {
  const wrapper = mount(Avatar)
  expect(await axe(wrapper.element)).toHaveNoViolations()
})

describe('given an Avatar with fallback and a working image', async () => {
  let wrapper: VueWrapper<InstanceType<typeof Avatar>>
  beforeAll(async () => {
    (window.Image as any) = class MockImage {
      onload: () => void = () => {}
      src = ''
      constructor() {
        setTimeout(() => {
          this.onload()
        }, DELAY)
        return this
      }
    }
    wrapper = mount(Avatar)
  })

  it('should render the fallback initially', async () => {
    await nextTick()
    expect(wrapper.html()).includes(FALLBACK)
  })

  it('should have alt text on the image', async () => {
    const image = await findByAltText(wrapper.element as HTMLElement, 'Elone Hoo')
    expect(image).toBeTruthy()
  })

  it('should match before image loaded snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })
})

describe('given an Avatar with fallback and delayed render', () => {
  let wrapper: VueWrapper<InstanceType<typeof Avatar>>

  beforeAll(async () => {
    (window.Image as any) = class MockImage {
      onload: () => void = () => {}
      src = ''
      constructor() {
        setTimeout(() => {
          this.onload()
        }, DELAY)
        return this
      }
    }
    wrapper = mount(Avatar, {
      props: {
        delay: 300,
      },
    })
  })

  it('should not render a fallback immediately', async () => {
    expect(wrapper.text()).not.toContain(FALLBACK)
  })

  it('should render a fallback after the delay', async () => {
    expect(wrapper.text()).not.toContain(FALLBACK)
    const fallback = await findByText(wrapper.element as HTMLElement, FALLBACK)
    expect(wrapper.element).toContain(fallback)
  })
})
