import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import * as Tests from './calendar.spec'
import Calendar from './fixtures/Calendar.svelte'

describe('calendar svelte browser tests', () => {
  it('renders correctly', async () => {
    render(Calendar)
    await Tests.RendersCorrectly()
  })
})