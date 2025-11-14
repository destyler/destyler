import { page, userEvent } from '@vitest/browser/context'

export const testHook = {

  part(part: string) {
    return `[data-part=${this.esc(part)}]`
  },

  esc(str: string) {
    return str.replace(/[-[\]{}()*+?:.,\\^$|#\s]/g, '\\$&')
  },

  testid(part: string) {
    return `[data-testid=${this.esc(part)}]`
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
}
