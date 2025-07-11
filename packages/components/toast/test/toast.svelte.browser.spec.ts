import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import * as Tests from './toast.spec'
import Toast from './fixtures/Toast.svelte'

describe('toast svelte browser tests', () => {
  it('renders correctly', async () => {
    render(Toast)
    await Tests.RendersCorrectly()
  })
})