import { expect } from 'vitest'
import { userEvent } from 'vitest/browser'
import { formContracts } from './steps.form-contract'

formContracts('native pointer', async button => userEvent.click(button))

for (const key of ['{Enter}', ' ']) {
  formContracts(`native keyboard ${key === ' ' ? 'Space' : 'Enter'}`, async (button) => {
    button.focus()
    expect(document.activeElement).toBe(button)
    await userEvent.keyboard(key)
  })
}
