import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { RendersCorrectly } from './calendar.spec'
import Calendar from './fixtures/Calendar.react.tsx'

describe('calendar react browser tests', () => {
  it('renders correctly', async () => {
    render(<Calendar />)
    await RendersCorrectly()
  })
})
