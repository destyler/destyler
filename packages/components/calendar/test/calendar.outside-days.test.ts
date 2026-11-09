import type { UserDefinedContext, ValueChangeDetails } from '../src/types'
// @vitest-environment happy-dom
// Exercises the state machine in Node; no browser is launched.
import assert from 'node:assert/strict'
import { CalendarDate } from '@internationalized/date'
import { afterEach, it } from 'vitest'
import { normalizeProps } from '../../../frameworks/vanilla/src/normalize-props'
import { connect } from '../src/connect'
import { machine } from '../src/machine'
import { props, splitProps } from '../src/props'

const services: Array<ReturnType<typeof machine>> = []
afterEach(() => {
  for (const service of services.splice(0)) service.stop()
  document.body.replaceChildren()
})
const inside = new CalendarDate(2026, 11, 15)
const outside = new CalendarDate(2026, 12, 1)
async function checkpoint() {
  for (let i = 0; i < 12; i++) await Promise.resolve()
}
function setup(context: Partial<UserDefinedContext> = {}) {
  const service = machine({ id: 'outside-days', focusedValue: inside, defaultOpen: true, closeOnSelect: false, ...context })
  services.push(service)
  const api = () => connect(service.state, service.send, normalizeProps)
  return { service, api }
}
for (const value of [undefined, false]) {
  it(`default compatibility: ${value}`, () => {
    const { api } = setup({ allowOutsideDays: value })
    assert.equal(api().getDayTableCellState({ value: outside }).selectable, false)
    assert.equal(api().getDayTableCellState({ value: inside }).selectable, true)
  })
}
it('opt-in preserves outside marker and single tab-stop ownership', () => {
  const { api } = setup({ allowOutsideDays: true })
  const state = api().getDayTableCellState({ value: outside })
  assert.equal(state.selectable, true)
  assert.equal(state.outsideRange, true)
  assert.equal(state.focused, false)
  assert.equal(api().getDayTableCellTriggerProps({ value: outside }).tabindex, -1)
})
for (const [name, context, cell] of [
  ['explicit disabled', {}, { disabled: true }],
  ['max', { max: new CalendarDate(2026, 11, 30) }, {}],
  ['min', { min: new CalendarDate(2026, 12, 2) }, {}],
  ['unavailable', { isDateUnavailable: () => true }, {}],
] as const) {
  it(`opt-in respects ${name}`, () => {
    const { api } = setup({ allowOutsideDays: true, ...context })
    assert.equal(api().getDayTableCellState({ value: outside, ...cell }).selectable, false)
  })
}
it('context can toggle outside selection without recreating machine', () => {
  const { api, service } = setup()
  service.setContext({ allowOutsideDays: true })
  assert.equal(api().getDayTableCellState({ value: outside }).selectable, true)
  service.setContext({ allowOutsideDays: false })
  assert.equal(api().getDayTableCellState({ value: outside }).selectable, false)
})
for (const selectionMode of ['single', 'multiple', 'range'] as const) {
  it(`${selectionMode}: click outside selects and navigates`, async () => {
    const { api, service } = setup({ allowOutsideDays: true, selectionMode })
    service.start()
    try {
      api().getDayTableCellTriggerProps({ value: outside }).onclick({ defaultPrevented: false } as any)
      await checkpoint()
      assert.equal(api().value[0].toString(), outside.toString())
      assert.equal(service.state.context.focusedValue.toString(), outside.toString())
      assert.equal(service.state.context.startValue.month, 12)
    }
    finally { service.stop() }
  })
}
it('default outside click emits no selection', async () => {
  const { api, service } = setup()
  service.start()
  try {
    api().getDayTableCellTriggerProps({ value: outside }).onclick({ defaultPrevented: false } as any)
    await checkpoint()
    assert.equal(api().value.length, 0)
    assert.equal(service.state.context.startValue.month, 11)
  }
  finally { service.stop() }
})
it('controlled selection requests change without overwriting value', async () => {
  const changes: ValueChangeDetails[] = []
  const { api, service } = setup({ allowOutsideDays: true, value: [inside], onValueChange: (value: ValueChangeDetails) => changes.push(value) })
  service.start()
  try {
    api().getDayTableCellTriggerProps({ value: outside }).onclick({ defaultPrevented: false } as any)
    await checkpoint()
    assert.equal(changes[0].value[0].toString(), outside.toString())
    assert.equal(api().value[0].toString(), inside.toString())
  }
  finally { service.stop() }
})
it('public splitProps forwards allowOutsideDays', () => {
  assert.ok(props.includes('allowOutsideDays'))
  assert.equal(splitProps({ allowOutsideDays: true })[0].allowOutsideDays, true)
})
it('cross-year outside selection advances year', async () => {
  const january = new CalendarDate(2027, 1, 1)
  const { api, service } = setup({ allowOutsideDays: true, focusedValue: new CalendarDate(2026, 12, 15) })
  service.start()
  try {
    api().getDayTableCellTriggerProps({ value: january }).onclick({ defaultPrevented: false } as any)
    await checkpoint()
    assert.equal(service.state.context.startValue.year, 2027)
    assert.equal(service.state.context.startValue.month, 1)
  }
  finally { service.stop() }
})
it('two-month duplicate outside cell does not own the focused tab stop', () => {
  const { api, service } = setup({ allowOutsideDays: true, numOfMonths: 2, focusedValue: outside })
  const november = { start: new CalendarDate(2026, 11, 1), end: new CalendarDate(2026, 11, 30) }
  const december = { start: new CalendarDate(2026, 12, 1), end: new CalendarDate(2026, 12, 31) }
  assert.equal(api().getDayTableCellTriggerProps({ value: outside, visibleRange: november }).tabindex, -1)
  assert.equal(api().getDayTableCellTriggerProps({ value: outside, visibleRange: december }).tabindex, 0)
  assert.equal(service.state.context.focusedValue.toString(), outside.toString())
})
it('range end hover outside preserves existing navigation semantics', async () => {
  const { api, service } = setup({ allowOutsideDays: true, selectionMode: 'range' })
  service.start()
  try {
    api().getDayTableCellTriggerProps({ value: inside }).onclick({ defaultPrevented: false } as any)
    await checkpoint()
    api().getDayTableCellTriggerProps({ value: outside }).onpointermove({ pointerType: 'mouse', currentTarget: document.createElement('button') } as any)
    await checkpoint()
    assert.equal(service.state.context.startValue.month, 12)
    assert.equal(service.state.context.hoveredValue?.toString(), outside.toString())
    assert.equal(api().value.length, 1)
  }
  finally { service.stop() }
})
it('opt-in does not bypass a disabled cell click guard', async () => {
  const { api, service } = setup({ allowOutsideDays: true })
  service.start()
  try {
    api().getDayTableCellTriggerProps({ value: outside, disabled: true }).onclick({ defaultPrevented: false } as any)
    await checkpoint()
    assert.equal(api().value.length, 0)
  }
  finally { service.stop() }
})
