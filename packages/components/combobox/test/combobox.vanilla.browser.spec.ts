import { describe, it } from 'vitest'
// Vanilla JS - no render import needed
import * as Tests from './combobox.spec'
import { Combobox } from './fixtures/Combobox.ts'

describe('combobox vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Combobox({ root: document.body })
    await Tests.RendersCorrectly()
  })
})
