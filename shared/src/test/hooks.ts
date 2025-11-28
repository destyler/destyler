import { vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'

export const testHook = {

  esc(str: string) {
    return str.replace(/[-[\]{}()*+?:.,\\^$|#\s]/g, '\\$&')
  },

  testid(part: string) {
    return `[data-testid=${this.esc(part)}]`
  },

  get test() {
    return {
      hiddenInput: testHook.testid('hidden-input'),
      disabledCheck: testHook.testid('disabled'),
    }
  },

  part(part: string) {
    return `[data-part=${this.esc(part)}]`
  },

  async pressKey(key: string, count: number = 1) {
    for (let i = 0; i < count; i++) {
      await userEvent.keyboard(`{${key}}`)
      await userEvent.keyboard(`{/${key}}`)
    }
  },

  getPart(part: string) {
    return page.getByArticle(this.part(part))
  },

  getInputEl(id: string) {
    return page.getByArticle(this.testid(`${id}:input`))
  },

  getClearEl(id: string) {
    return page.getByTestId(`${id}:clear`)
  },

  async focusInput(id: string) {
    const inputEl = this.getInputEl(id)
    await inputEl.fill('')
  },

  getTrigger(id: string) {
    return page.getByArticle(this.testid(`${id}:trigger`))
  },

  getItem(id: string) {
    return page.getByArticle(this.testid(`${id}:item`))
  },

  getContent(id: string) {
    return page.getByArticle(this.testid(`${id}:content`))
  },

  getItemEls() {
    return page.getByArticle(this.part('item'))
  },

  getIndicatorEl() {
    return page.getByArticle(this.part('indicator'))
  },

  getAutoPlayEl() {
    return page.getByArticle(this.part('autoplay-trigger'))
  },

  getPrevEl() {
    return page.getByArticle(this.part('prev-trigger'))
  },

  getNextEl() {
    return page.getByArticle(this.part('next-trigger'))
  },

  getRootEl() {
    return page.getByArticle(this.part('root'))
  },

  getLabelEl() {
    return page.getByArticle(this.part('label'))
  },

  getLabelById(id: string) {
    return page.getByTestId(`${id}:label`)
  },

  getControlEl() {
    return page.getByArticle(this.part('control'))
  },

  async waitFor() {
    await vi.waitFor(async () => {
      return true
    }, {
      timeout: 5000,
      interval: 50,
    })
  },

  async type(id: string, text: string) {
    const inputEl = this.getInputEl(id)

    await userEvent.type(inputEl, text)
  },

  async clickOutside() {
    const outsideButton = page.getByTestId('outside')
    await outsideButton.click()
  },

  async hoverTrigger(id: string) {
    await userEvent.hover(this.getTrigger(id))
  },

  async unhoverTrigger(id: string) {
    await userEvent.unhover(this.getTrigger(id))
  },

  async clickTrigger(id: string, opts: { count: number, delay?: number } = {
    count: 1,
    delay: 0,
  }) {
    const triggerEl = this.getTrigger(id)
    for (let i = 0; i < opts.count; i++) {
      await userEvent.click(triggerEl, {
        delay: opts.delay,
      })
    }
  },

  async clickItem(id: string, opts: { delay?: number } = {}) {
    const el = this.getItem(id)
    await userEvent.click(el, {
      delay: opts.delay,
    })
  },

  async hoverItem(id: string) {
    const el = this.getItem(id)
    await el.hover()
  },

  async clickInput(id: string) {
    const inputEl = this.getInputEl(id)
    await inputEl.click()
  },

  async clickLabel(id: string) {
    const labelEl = this.getLabelById(id)
    await labelEl.click()
  },

  async clickTriggerById(id: string, opts: {
    delay?: number
    times: number
  } = {
    delay: 0,
    times: 1,
  }) {
    const triggerEl = this.getTrigger(id)
    for (let i = 0; i < opts.times; i++) {
      await userEvent.click(triggerEl, {
        delay: opts.delay,
      })
    }
  },
}
