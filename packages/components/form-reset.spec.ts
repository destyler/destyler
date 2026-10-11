import { expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { formResetCases } from './form-reset.cases'
import { mountReset, nextResetTask, resetDefinitions } from './form-reset.fixtures'

formResetCases(form => form.reset())

// Checkbox and number-input represent the event-sending and direct-set reset
// activities. Shared cases above cover every component in the same browser run.
for (const name of ['checkbox', 'number-input']) {
  it.each([false, true])(`${name}: trusted reset button honors final cancellation %s`, async (cancel) => {
    const definition = resetDefinitions.find(definition => definition.name === name)!
    const view = await mountReset(definition, 'accept')
    let trusted = false
    const observations: Array<{ phase: string, calls: number, value: unknown }> = []
    view.resetButton.addEventListener('click', (event) => {
      trusted = event.isTrusted
    })
    view.form.addEventListener('reset', () => {
      observations.push({ phase: 'form listener', calls: view.changes.mock.calls.length, value: view.read() })
      queueMicrotask(() => {
        observations.push({ phase: 'listener microtask', calls: view.changes.mock.calls.length, value: view.read() })
      })
    })
    view.container.addEventListener('reset', (event) => {
      observations.push({ phase: 'ancestor listener', calls: view.changes.mock.calls.length, value: view.read() })
      if (cancel)
        event.preventDefault()
    })

    await page.getByRole('button', { name: `Reset ${name}`, exact: true }).click()
    await nextResetTask()
    expect(trusted).toBe(true)
    expect(observations).toEqual([
      { phase: 'form listener', calls: 0, value: view.current },
      { phase: 'listener microtask', calls: 0, value: view.current },
      { phase: 'ancestor listener', calls: 0, value: view.current },
    ])
    expect(view.proposed()).toEqual(cancel ? [] : [view.initial])
    expect(view.read()).toEqual(cancel ? view.current : view.initial)
  })
}
