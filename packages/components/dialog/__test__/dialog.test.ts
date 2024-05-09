import { type Mock, type SpyInstance, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { axe } from 'vitest-axe'
import type { DOMWrapper, VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import { findByText, fireEvent, render } from '@testing-library/vue'
import { DestylerDialogClose, DestylerDialogContent, DestylerDialogOverlay, DestylerDialogRoot, DestylerDialogTitle, DestylerDialogTrigger } from '../src'

const OPEN_TEXT = 'Open'
const CLOSE_TEXT = 'Close'
const TITLE_TEXT = 'Title'

const NoLabelDialogTest = defineComponent({
  components: { DestylerDialogRoot, DestylerDialogTrigger, DestylerDialogOverlay, DestylerDialogContent, DestylerDialogClose },
  template: `<DestylerDialogRoot>
  <DestylerDialogTrigger>${OPEN_TEXT}</DestylerDialogTrigger>
  <DestylerDialogOverlay />
  <DestylerDialogContent>
    <DestylerDialogClose>${CLOSE_TEXT}</DestylerDialogClose>
  </DestylerDialogContent>
</DestylerDialogRoot>`,
})

const UndefinedDescribedByDialog = defineComponent({
  components: { DestylerDialogRoot, DestylerDialogTrigger, DestylerDialogOverlay, DestylerDialogContent, DestylerDialogClose, DestylerDialogTitle },
  template: `  <DestylerDialogRoot>
  <DestylerDialogTrigger>${OPEN_TEXT}</DestylerDialogTrigger>
  <DestylerDialogOverlay />
  <DestylerDialogContent :aria-describedby="undefined">
    <DestylerDialogTitle>${TITLE_TEXT}</DestylerDialogTitle>
    <DestylerDialogClose>${CLOSE_TEXT}</DestylerDialogClose>
  </DestylerDialogContent>
</DestylerDialogRoot>`,
})

function renderAndClickDialogTrigger(Dialog: any) {
  fireEvent.click(render(Dialog).getByText(OPEN_TEXT))
}

const DialogTest = defineComponent({
  components: { DestylerDialogRoot, DestylerDialogTrigger, DestylerDialogOverlay, DestylerDialogContent, DestylerDialogClose, DestylerDialogTitle },
  template: `<DestylerDialogRoot >
  <DestylerDialogTrigger>${OPEN_TEXT}</DestylerDialogTrigger>
  <DestylerDialogOverlay />
  <DestylerDialogContent>
    <DestylerDialogTitle>${TITLE_TEXT}</DestylerDialogTitle>
    <DestylerDialogClose>${CLOSE_TEXT}</DestylerDialogClose>
  </DestylerDialogContent>
</DestylerDialogRoot>`,
})

describe('given a default Dialog', () => {
  let wrapper: VueWrapper<InstanceType<typeof DialogTest>>
  let trigger: DOMWrapper<HTMLElement>
  let closeButton: HTMLElement
  let consoleWarnMock: SpyInstance
  let consoleWarnMockFunction: Mock

  beforeEach(() => {
    document.body.innerHTML = ''
    wrapper = mount(DialogTest, { attachTo: document.body })
    trigger = wrapper.find('button')
    consoleWarnMockFunction = vi.fn()
    consoleWarnMock = vi.spyOn(console, 'warn').mockImplementation(consoleWarnMockFunction)
  })

  afterEach(() => {
    consoleWarnMock.mockRestore()
    consoleWarnMockFunction.mockClear
  })

  it('should pass axe accessibility tests', async () => {
    expect(await axe(document.body)).toHaveNoViolations()

    // open modal
    wrapper.find('button').element.click()
    await nextTick()
    expect(await axe(document.body)).toHaveNoViolations()
  })

  describe('after clicking the trigger', () => {
    beforeEach(async () => {
      fireEvent.click(trigger.element)
      closeButton = await findByText(document.body, CLOSE_TEXT)
    })

    describe('when aria-describedby is set to undefined', () => {
      beforeEach(() => {
        document.body.innerHTML = ''
      })
      it('should not warn to the console', () => {
        consoleWarnMockFunction.mockClear()

        renderAndClickDialogTrigger(UndefinedDescribedByDialog)
        expect(consoleWarnMockFunction).not.toHaveBeenCalled()
      })
    })

    it('should open the content', () => {
      expect(document.body.innerHTML).toContain(closeButton.innerHTML)
    })

    it('should focus the close button', () => {
      expect(closeButton).toBe(document.activeElement)
    })

    describe('when pressing escape', () => {
      beforeEach(() => {
        fireEvent.keyDown(document.activeElement!, { key: 'Escape' })
      })

      it('should close the content', () => {
        expect(document.body.innerHTML).not.toContain(closeButton.innerHTML)
      })
    })
  })
})
