// @vitest-environment happy-dom
import { describe, it } from 'vitest'
import { calendarDomLifecycleCases } from './calendar-dom-lifecycle.cases'

describe('calendar DOM work ownership', () => {
  for (const { name, run } of calendarDomLifecycleCases)
    it(name, run)
})
