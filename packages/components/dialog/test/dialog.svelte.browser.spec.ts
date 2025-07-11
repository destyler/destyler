import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import * as Tests from './dialog.spec'
import Dialog from './fixtures/Dialog.svelte'

describe('dialog svelte browser tests', () => {
  it('renders correctly', async () => {
    render(Dialog)
    await Tests.RendersCorrectly()
  })
})