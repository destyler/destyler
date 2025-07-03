import { locators } from '@vitest/browser/context'
import { expect } from "vitest";
import * as matchers from "vitest-axe/matchers";

expect.extend(matchers)

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
