import type { Locator } from 'vitest/browser'
import { expect } from 'vitest'
import * as matchers from 'vitest-axe/matchers'
import { locators } from 'vitest/browser'

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

declare module 'vitest' {
  interface Matchers<R> {
    toHaveNoViolations: () => R
  }
}

declare module 'vitest/browser' {
  interface LocatorSelectors {
    getByArticle: (article: string) => Locator
    locatoring: (article: string) => Locator
  }
}
