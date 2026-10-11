import { expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { mountRadio, mountToggle, settle } from './form-native-veto.test'

for (const kind of ['checkbox', 'switch'] as const) {
  for (const ownership of ['uncontrolled', 'accept', 'veto'] as const) {
    for (const initial of [false, true]) {
      it(`${kind}: trusted ${ownership} from ${initial} reconciles late native cancellation`, async () => {
        const view = mountToggle(kind, initial, ownership)
        view.input.dataset.testid = 'late-cancel-input'
        let trusted = false
        view.input.addEventListener('click', event => (trusted = event.isTrusted), { once: true })
        view.root.addEventListener('click', event => event.preventDefault())
        await page.getByTestId('late-cancel-input').click()
        await settle()
        const accepted = ownership === 'veto' ? initial : !initial
        expect(trusted).toBe(true)
        expect(view.changes.mock.calls).toEqual([[{ checked: !initial }]])
        expect(view.read()).toBe(accepted)
        expect(view.input.checked).toBe(accepted)
        expect(new FormData(view.form).get('flag')).toBe(accepted ? 'on' : null)
      })
    }
  }
}
for (const ownership of ['uncontrolled', 'accept', 'veto'] as const) {
  for (const initial of ['a', 'b', null]) {
    it(`radio: trusted ${ownership} from ${initial} reconciles late native cancellation`, async () => {
      const view = mountRadio(initial, ownership)
      const proposed = initial === 'a' ? 'b' : 'a'
      const input = view.inputs[proposed === 'a' ? 0 : 1]
      input.dataset.testid = 'late-cancel-input'
      let trusted = false
      input.addEventListener('click', event => (trusted = event.isTrusted), { once: true })
      view.root.addEventListener('click', event => event.preventDefault())
      await page.getByTestId('late-cancel-input').click()
      await settle()
      const accepted = ownership === 'veto' ? initial : proposed
      expect(trusted).toBe(true)
      expect(view.changes.mock.calls).toEqual([[{ value: proposed }]])
      expect(view.read()).toBe(accepted)
      expect(view.inputs.map(input => input.checked)).toEqual([accepted === 'a', accepted === 'b'])
      expect(new FormData(view.form).get('choice')).toBe(accepted)
    })
  }
}
for (const ownership of ['uncontrolled', 'accept', 'veto'] as const) {
  it(`checkbox: trusted ${ownership} preserves accepted tri-state after late cancellation`, async () => {
    const view = mountToggle('checkbox', 'indeterminate', ownership)
    view.input.dataset.testid = 'late-cancel-input'
    let trusted = false
    view.input.addEventListener('click', event => (trusted = event.isTrusted), { once: true })
    view.root.addEventListener('click', event => event.preventDefault())
    await page.getByTestId('late-cancel-input').click()
    await settle()
    const veto = ownership === 'veto'
    expect(trusted).toBe(true)
    expect(view.changes.mock.calls).toEqual([[{ checked: true }]])
    expect(view.read()).toBe(veto ? 'indeterminate' : true)
    expect({ checked: view.input.checked, indeterminate: view.input.indeterminate, submitted: new FormData(view.form).get('flag') })
      .toEqual({ checked: !veto, indeterminate: veto, submitted: veto ? null : 'on' })
  })
}
