import { describe, it } from 'vitest'
// Vanilla JS - no render import needed
import * as Tests from './calendar.spec'
import { Calendar } from './fixtures/Calendar.ts'

describe('calendar vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Calendar({ root: document.body })
    await Tests.RendersCorrectly()
  })
})