import { expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { mountRadio, mountToggle, settle } from './form-native-veto.test'

// Importing the Node fixture above runs its 37 semantic cases in Chromium too.
// These additional cases cover trusted activation and the #157 dependency.
// Accepted updates followed by later cancellation remain an explicit diagnostic
// in #199; this ordinary-veto repair does not claim to resolve that limitation.
async function activate(input: HTMLInputElement) {
  input.dataset.testid = 'trusted-native-veto'
  let trusted = false
  input.addEventListener('click', (event) => {
    trusted = event.isTrusted
  }, { once: true })
  await page.getByTestId('trusted-native-veto').click()
  await settle()
  expect(trusted).toBe(true)
}

for (const ownership of ['accept', 'veto'] as const) {
  it.each(['checkbox', 'switch'] as const)(`%s trusted ${ownership} keeps the accepted form value`, async (kind) => {
    const view = mountToggle(kind, false, ownership)
    await activate(view.input)
    const accepted = ownership === 'accept'
    expect(view.changes.mock.calls).toEqual([[{ checked: true }]])
    expect(view.read()).toBe(accepted)
    expect({ checked: view.input.checked, submitted: new FormData(view.form).get('flag') })
      .toEqual({ checked: accepted, submitted: accepted ? 'on' : null })
  })
  it(`radio trusted ${ownership} keeps the accepted form value`, async () => {
    const view = mountRadio('a', ownership)
    await activate(view.inputs[1])
    const accepted = ownership === 'accept' ? 'b' : 'a'
    expect(view.changes.mock.calls).toEqual([[{ value: 'b' }]])
    expect(view.read()).toBe(accepted)
    expect(view.inputs.map(input => input.checked)).toEqual([accepted === 'a', accepted === 'b'])
    expect(new FormData(view.form).get('choice')).toBe(accepted)
  })
}

it.each(['checkbox', 'switch'] as const)('%s trusted veto remains consistent after later native cancellation', async (kind) => {
  const view = mountToggle(kind, false, 'veto')
  view.root.addEventListener('click', event => event.preventDefault())
  await activate(view.input)
  expect(view.changes.mock.calls).toEqual([[{ checked: true }]])
  expect(view.read()).toBe(false)
  expect(view.input.checked).toBe(false)
  expect(new FormData(view.form).get('flag')).toBe(null)
})
it('radio trusted veto remains consistent after later native cancellation', async () => {
  const view = mountRadio('a', 'veto')
  view.root.addEventListener('click', event => event.preventDefault())
  await activate(view.inputs[1])
  expect(view.changes.mock.calls).toEqual([[{ value: 'b' }]])
  expect(view.read()).toBe('a')
  expect(view.inputs.map(input => input.checked)).toEqual([true, false])
  expect(new FormData(view.form).get('choice')).toBe('a')
})

for (const halt of ['stop', 'restart'] as const) {
  it.each(['checkbox', 'switch'] as const)(`%s trusted callback ${halt} abandons the ended run's input write`, async (kind) => {
    const view = mountToggle(kind, false, 'veto', halt)
    await activate(view.input)
    expect(view.changes.mock.calls).toEqual([[{ checked: true }]])
    expect(view.read()).toBe(false)
    expect(view.syncEvents).not.toContain('CHECKED.SET')
  })
  it(`radio trusted callback ${halt} abandons the ended run's input write`, async () => {
    const view = mountRadio('a', 'veto', halt)
    await activate(view.inputs[1])
    expect(view.changes.mock.calls).toEqual([[{ value: 'b' }]])
    expect(view.read()).toBe('a')
    expect(view.syncEvents).not.toContain('SET_VALUE')
  })
}
