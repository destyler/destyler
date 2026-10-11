// @vitest-environment happy-dom
import { afterEach, expect, it, vi } from 'vitest'
import { trackFormControl } from '../src/form'

const cleanups: Array<() => void> = []
const settle = () => new Promise<void>(resolve => setTimeout(resolve, 0))

afterEach(() => {
  for (const cleanup of cleanups.splice(0).reverse())
    cleanup()
})

function mount(html: string, reflectDisabled = false) {
  const container = document.createElement('div')
  container.innerHTML = html
  document.body.append(container)
  const target = container.querySelector<HTMLElement>('#target')!
  const onChange = vi.fn((disabled: boolean) => {
    if (reflectDisabled)
      (target as HTMLInputElement).disabled = disabled
  })
  const stop = trackFormControl(target, {
    onFieldsetDisabledChange: onChange,
    onFormReset: vi.fn(),
  })!
  cleanups.push(() => {
    stop()
    container.remove()
  })
  return { container, target, onChange, stop }
}

it.each([
  ['enabled fieldset', '<fieldset><input id="target"></fieldset>', false],
  ['disabled fieldset', '<fieldset disabled><input id="target"></fieldset>', true],
  ['own disabled input in enabled fieldset', '<fieldset><input id="target" disabled></fieldset>', false],
  ['own disabled input in exempt legend', '<fieldset disabled><legend><input id="target" disabled></legend></fieldset>', false],
  ['first legend', '<fieldset disabled><legend><input id="target"></legend></fieldset>', false],
  ['first legend after a non-legend child', '<fieldset disabled><div></div><legend><input id="target"></legend></fieldset>', false],
  ['second legend', '<fieldset disabled><legend>first</legend><legend><input id="target"></legend></fieldset>', true],
  ['ordinary sibling of first legend', '<fieldset disabled><legend>first</legend><input id="target"></fieldset>', true],
  ['disabled outer ancestor', '<fieldset disabled><fieldset><input id="target"></fieldset></fieldset>', true],
  ['disabled inner ancestor', '<fieldset><fieldset disabled><input id="target"></fieldset></fieldset>', true],
  ['outer legend exempts its nested enabled fieldset', '<fieldset disabled><legend><fieldset><input id="target"></fieldset></legend></fieldset>', false],
  ['outer exemption does not exempt disabled inner fieldset', '<fieldset disabled><legend><fieldset disabled><input id="target"></fieldset></legend></fieldset>', true],
  ['inner exemption does not exempt disabled outer fieldset', '<fieldset disabled><fieldset disabled><legend><input id="target"></legend></fieldset></fieldset>', true],
  ['both disabled ancestors independently exempt', '<fieldset disabled><legend><fieldset disabled><legend><input id="target"></legend></fieldset></legend></fieldset>', false],
  ['radio-like non-input root is exempt in first legend', '<fieldset disabled><legend><div id="target"></div></legend></fieldset>', false],
  ['radio-like non-input root inherits disabled outer ancestor', '<fieldset disabled><fieldset><div id="target"></div></fieldset></fieldset>', true],
] as const)('%s reports only inherited fieldset disabledness', (_name, html, expected) => {
  const { onChange } = mount(html)
  expect(onChange.mock.calls).toEqual([[expected]])
})

it('without a fieldset retains the existing no-callback behavior', () => {
  const { onChange, stop } = mount('<input id="target" disabled>')
  expect(onChange).not.toHaveBeenCalled()
  expect(stop).not.toThrow()
})

it('observes outer disabled and enabled transitions', async () => {
  const { container, onChange } = mount('<fieldset><fieldset><input id="target"></fieldset></fieldset>')
  const outer = container.querySelector('fieldset')!
  outer.disabled = true
  await settle()
  expect(onChange).toHaveBeenLastCalledWith(true)
  outer.disabled = false
  await settle()
  expect(onChange.mock.calls).toEqual([[false], [true], [false]])
})

it('clearing one disabled ancestor keeps the other ancestor effective', async () => {
  const { container, onChange } = mount('<fieldset disabled><fieldset disabled><input id="target"></fieldset></fieldset>')
  const [outer, inner] = Array.from(container.querySelectorAll('fieldset'))
  inner.disabled = false
  await settle()
  expect(onChange).toHaveBeenLastCalledWith(true)
  outer.disabled = false
  await settle()
  expect(onChange).toHaveBeenLastCalledWith(false)
  inner.disabled = true
  await settle()
  expect(onChange).toHaveBeenLastCalledWith(true)
})

it('does not latch when connector-like reflection sets the input disabled property', async () => {
  const { container, target, onChange } = mount('<fieldset disabled><input id="target"></fieldset>', true)
  expect((target as HTMLInputElement).disabled).toBe(true)
  container.querySelector('fieldset')!.disabled = false
  await settle()
  expect(onChange.mock.calls).toEqual([[true], [false]])
  expect((target as HTMLInputElement).disabled).toBe(false)
})

it('own input disabled changes cannot contaminate subsequent fieldset observations', async () => {
  const { container, target, onChange } = mount('<fieldset><input id="target"></fieldset>')
  const fieldset = container.querySelector('fieldset')!
  ;(target as HTMLInputElement).disabled = true
  await settle()
  expect(onChange.mock.calls).toEqual([[false]])
  fieldset.disabled = true
  await settle()
  fieldset.disabled = false
  await settle()
  expect(onChange.mock.calls).toEqual([[false], [true], [false]])
  expect((target as HTMLInputElement).disabled).toBe(true)
})

it('rechecks each first-legend exemption when nested ancestors change', async () => {
  const { container, onChange } = mount('<fieldset><legend><fieldset><input id="target"></fieldset></legend></fieldset>')
  const [outer, inner] = Array.from(container.querySelectorAll('fieldset'))
  outer.disabled = true
  await settle()
  expect(onChange).toHaveBeenLastCalledWith(false)
  inner.disabled = true
  await settle()
  expect(onChange).toHaveBeenLastCalledWith(true)
  inner.disabled = false
  await settle()
  expect(onChange).toHaveBeenLastCalledWith(false)
})

it('cleanup disconnects every ancestor and discards queued mutations', async () => {
  const { container, onChange, stop } = mount('<fieldset><fieldset><input id="target"></fieldset></fieldset>')
  const [outer, inner] = Array.from(container.querySelectorAll('fieldset'))
  outer.disabled = true
  inner.disabled = true
  stop()
  await settle()
  expect(onChange.mock.calls).toEqual([[false]])
  outer.disabled = false
  inner.disabled = false
  await settle()
  expect(onChange.mock.calls).toEqual([[false]])
  expect(stop).not.toThrow()
})

it('unrelated ancestor attributes do not cause notifications', async () => {
  const { container, onChange } = mount('<fieldset><fieldset><input id="target"></fieldset></fieldset>')
  for (const fieldset of Array.from(container.querySelectorAll('fieldset')))
    fieldset.setAttribute('data-audit', 'changed')
  await settle()
  expect(onChange.mock.calls).toEqual([[false]])
})
