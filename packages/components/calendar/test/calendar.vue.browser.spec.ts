import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import * as Tests from './calendar.spec'
import Calendar from './fixtures/Calendar.vue'

describe('calendar vue browser tests', () => {
  it('renders correctly', async () => {
    render(Calendar)
    await Tests.RendersCorrectly()
  })
})