import { expect, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { formContracts } from './steps.form-contract'

formContracts('native pointer', async (button, options) => {
  if (!options?.force) {
    await userEvent.click(button, options)
    return
  }
  await expect.element(button).toBeVisible()
  const onClick = vi.fn()
  button.addEventListener('click', onClick)
  try {
    // Exercise the native click guard instead of Playwright's aria-disabled actionability check.
    await userEvent.click(button, options)
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(onClick.mock.calls[0][0].isTrusted).toBe(true)
  }
  finally {
    button.removeEventListener('click', onClick)
  }
})

for (const key of ['{Enter}', ' ']) {
  formContracts(`native keyboard ${key === ' ' ? 'Space' : 'Enter'}`, async (button) => {
    button.focus()
    expect(document.activeElement).toBe(button)
    await userEvent.keyboard(key)
  })
}
