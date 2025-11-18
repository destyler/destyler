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

  getTrigger(id: string) {
    return page.getByArticle(this.testid(`${id}:trigger`))
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

  async clickOutside() {
    const outsideButton = page.getByTestId('outside')
    await outsideButton.click()
  },

}
