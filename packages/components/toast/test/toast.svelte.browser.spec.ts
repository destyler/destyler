import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Toast from './fixtures/Toast.svelte'
import * as Tests from './toast.spec'

describe('toast svelte browser tests', () => {
  it('renders correctly', async () => {
    render(Toast)
    await Tests.RendersCorrectly()
  })
})
