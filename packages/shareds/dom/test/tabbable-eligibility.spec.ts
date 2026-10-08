import { afterEach, expect, it } from 'vitest'
import { getFocusables, getTabbables, isFocusable, isTabbable } from '../src/tabbable'
import './tabbable-eligibility.cases'

afterEach(() => document.body.replaceChildren())

it('agrees with native focus rejection for inert, disabled, and unrendered positive-tabindex controls', () => {
  const root = document.createElement('div')
  root.innerHTML = `
    <button id="allowed" tabindex="2">allowed</button>
    <button id="disabled" tabindex="3" disabled>disabled</button>
    <div inert><button id="inert" tabindex="4">inert</button></div>
    <button id="hidden" tabindex="5" style="display:none">hidden</button>
  `
  document.body.append(root)
  const allowed = root.querySelector<HTMLButtonElement>('#allowed')!
  allowed.focus()
  expect(document.activeElement).toBe(allowed)
  for (const id of ['disabled', 'inert', 'hidden']) {
    root.querySelector<HTMLButtonElement>(`#${id}`)!.focus()
    expect(document.activeElement).toBe(allowed)
  }
  expect(getTabbables(root)).toEqual([allowed])
})

it('respects disabled fieldsets while preserving the first legend exception', () => {
  const fieldset = document.createElement('fieldset')
  fieldset.disabled = true
  const legend = document.createElement('legend')
  const allowed = document.createElement('button')
  allowed.textContent = 'legend control'
  allowed.tabIndex = 2
  legend.append(allowed)
  const blocked = document.createElement('button')
  blocked.textContent = 'disabled descendant'
  blocked.tabIndex = 2
  fieldset.append(legend, blocked)
  document.body.append(fieldset)
  // happy-dom does not implement inherited :disabled or first-legend behavior.
  // Keep this contract in real Chromium with a native selector oracle.
  expect(blocked.matches(':disabled')).toBe(true)
  expect(allowed.matches(':disabled')).toBe(false)
  expect(isFocusable(allowed)).toBe(true)
  expect(isTabbable(allowed)).toBe(true)
  expect(isFocusable(blocked)).toBe(false)
  expect(isTabbable(blocked)).toBe(false)
  expect(getFocusables(fieldset)).toEqual([allowed])
  expect(getTabbables(fieldset)).toEqual([allowed])
})
