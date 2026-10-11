// @vitest-environment happy-dom
import { expect, it } from 'vitest'
import { mountRadio, mountToggle, settle } from './form-native-veto.test'

for (const kind of ['checkbox', 'switch'] as const) {
  for (const ownership of ['uncontrolled', 'accept', 'veto'] as const) {
    for (const initial of [false, true]) {
      it(`${kind}: ${ownership} from ${initial} reconciles an accepted value after late click cancellation`, async () => {
        const view = mountToggle(kind, initial, ownership)
        view.root.addEventListener('click', event => event.preventDefault())
        view.input.click()
        await settle()
        const accepted = ownership === 'veto' ? initial : !initial
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
    it(`radio: ${ownership} from ${initial} reconciles accepted selection after late click cancellation`, async () => {
      const view = mountRadio(initial, ownership)
      const proposed = initial === 'a' ? 'b' : 'a'
      view.root.addEventListener('click', event => event.preventDefault())
      view.inputs[proposed === 'a' ? 0 : 1].click()
      await settle()
      const accepted = ownership === 'veto' ? initial : proposed
      expect(view.changes.mock.calls).toEqual([[{ value: proposed }]])
      expect(view.read()).toBe(accepted)
      expect(view.inputs.map(input => input.checked)).toEqual([accepted === 'a', accepted === 'b'])
      expect(new FormData(view.form).get('choice')).toBe(accepted)
    })
  }
}

for (const kind of ['checkbox', 'switch'] as const) {
  for (const halt of ['stop', 'restart'] as const) {
    it(`${kind}: canceled activation cannot overwrite caller DOM after callback ${halt}`, async () => {
      const view = mountToggle(kind, false, 'veto', halt)
      view.root.addEventListener('click', event => event.preventDefault())
      view.input.click()
      view.input.checked = true
      await settle()
      expect(view.read()).toBe(false)
      expect(view.input.checked).toBe(true)
      expect(view.changes).toHaveBeenCalledExactlyOnceWith({ checked: true })
    })
  }
}
for (const halt of ['stop', 'restart'] as const) {
  it(`radio: canceled activation cannot overwrite caller DOM after callback ${halt}`, async () => {
    const view = mountRadio('a', 'veto', halt)
    view.root.addEventListener('click', event => event.preventDefault())
    view.inputs[1].click()
    view.inputs[0].checked = false
    view.inputs[1].checked = true
    await settle()
    expect(view.read()).toBe('a')
    expect(view.inputs.map(input => input.checked)).toEqual([false, true])
    expect(view.changes).toHaveBeenCalledExactlyOnceWith({ value: 'b' })
  })
}

// Happy DOM does not implement Chromium's trusted rollback ordering. These
// cases explicitly simulate only that post-listener DOM write; native cases
// in form-late-cancel.spec.ts exercise real trusted activation independently.
it.each(['checkbox', 'switch'] as const)('%s repairs a simulated post-listener rollback using live accepted context', async (kind) => {
  const view = mountToggle(kind, false, 'accept')
  view.root.addEventListener('click', event => event.preventDefault())
  view.input.click()
  await Promise.resolve()
  view.input.checked = false
  expect(view.read()).toBe(true)
  await settle()
  expect(view.input.checked).toBe(true)
  expect(view.changes).toHaveBeenCalledExactlyOnceWith({ checked: true })
})
it('radio repairs a simulated post-listener rollback using live accepted context', async () => {
  const view = mountRadio('a', 'accept')
  view.root.addEventListener('click', event => event.preventDefault())
  view.inputs[1].click()
  await Promise.resolve()
  view.inputs[1].checked = false
  view.inputs[0].checked = true
  expect(view.read()).toBe('b')
  await settle()
  expect(view.inputs.map(input => input.checked)).toEqual([false, true])
  expect(view.changes).toHaveBeenCalledExactlyOnceWith({ value: 'b' })
})
for (const ownership of ['uncontrolled', 'accept', 'veto'] as const) {
  it(`checkbox: ${ownership} preserves accepted tri-state after late cancellation`, async () => {
    const view = mountToggle('checkbox', 'indeterminate', ownership)
    view.root.addEventListener('click', event => event.preventDefault())
    view.input.click()
    await settle()
    const veto = ownership === 'veto'
    expect(view.changes.mock.calls).toEqual([[{ checked: true }]])
    expect(view.read()).toBe(veto ? 'indeterminate' : true)
    expect({ checked: view.input.checked, indeterminate: view.input.indeterminate, submitted: new FormData(view.form).get('flag') })
      .toEqual({ checked: !veto, indeterminate: veto, submitted: veto ? null : 'on' })
  })
}
