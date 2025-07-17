import { locators } from '@vitest/browser/context'
import { expect } from 'vitest'
import * as matchers from 'vitest-axe/matchers'

import './shared/src/bootstrap.css'

expect.extend(matchers)

locators.extend({
  getByArticle(article) {
    return `${article}`
  },
  locatoring(article) {
    return article
  },
})

declare module '@vitest/browser/context' {
  interface LocatorSelectors {
    getByArticle: (article: string) => Locator
    locatoring: (article: string) => Locator
  }
}
