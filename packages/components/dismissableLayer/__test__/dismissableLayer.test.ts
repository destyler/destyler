import { beforeEach, describe, expect, it } from 'vitest'
import { type DOMWrapper, type VueWrapper, mount } from '@vue/test-utils'
import { fireEvent } from '@testing-library/vue'
import DismissableLayer from '../demos/DismissableLayer.demo.vue'

const OPEN_LABEL = 'Open'
const CLOSE_LABEL = 'Close'
const OUTSIDE_LABEL = 'Outside'

describe('given a default DismissableLayer', () => {
  let wrapper: VueWrapper<InstanceType<typeof DismissableLayer>>
  let trigger: DOMWrapper<HTMLElement>

  beforeEach(() => {
    document.body.innerHTML = ''
    wrapper = mount(DismissableLayer, { attachTo: document.body, props: { openLabel: OPEN_LABEL, closeLabel: CLOSE_LABEL, outsideLabel: OUTSIDE_LABEL } })
    trigger = wrapper.find('button')
  })

  it('should render button without content', async () => {
    expect(document.body.innerHTML).not.toContain(CLOSE_LABEL)
  })

  describe('after clicking a trigger', () => {
    let _outsideButton: DOMWrapper<HTMLElement>
    beforeEach(async () => {
      await fireEvent.click(trigger.element)
      const buttons = wrapper.findAll('button')
      buttons.find(i => i.text() === CLOSE_LABEL)?.element.focus()
      _outsideButton = buttons.find(i => i.text() === OUTSIDE_LABEL)!
    })

    it('should render the content', () => {
      expect(document.body.innerHTML).toContain(CLOSE_LABEL)
    })

    describe('pressing Escape close off the layer', () => {
      it('should close layer when point click outside', async () => {
        await fireEvent.keyDown(document.body, { key: 'Escape' })
        expect(document.body.innerHTML).not.toContain(CLOSE_LABEL)
        expect(wrapper.emitted('escapeKeyDown')?.length).toBe(1)
        expect(wrapper.emitted('dismiss')?.length).toBe(1)
      })
    })
  })
})
