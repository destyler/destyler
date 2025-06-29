import { locators } from '@vitest/browser/context'

locators.extend({
  getByArticle(article) {
    return `${article}`
  },
})

declare module '@vitest/browser/context' {
  interface LocatorSelectors {
    getByArticle: (article: string) => Locator

  }
}
