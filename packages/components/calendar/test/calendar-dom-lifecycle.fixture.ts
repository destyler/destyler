import type { MachineApi, MachineContext, MachineState, UserDefinedContext } from '../src/types'
import assert from 'node:assert/strict'
import { CalendarDate } from '@internationalized/date'
import { Component } from '../../../frameworks/vanilla/src/component'
import { normalizeProps } from '../../../frameworks/vanilla/src/normalize-props'
import { spreadProps } from '../../../frameworks/vanilla/src/spread-props'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

export const dates = [new CalendarDate(2024, 1, 10), new CalendarDate(2024, 1, 15)]

export async function checkpoint() {
  // The real context subscription uses Promise jobs, independently of RAF.
  for (let index = 0; index < 12; index++) await Promise.resolve()
}

interface DomCall {
  fixture: CalendarFixture
  kind: 'focus' | 'selection' | 'input' | 'month' | 'year'
  before?: string
  value?: string
  status: string
}

export class CalendarFixture extends Component<UserDefinedContext, MachineApi, MachineContext, MachineState> {
  readonly root: HTMLDivElement
  readonly control = document.createElement('div')
  readonly inputs = [document.createElement('input'), document.createElement('input')]
  readonly trigger = document.createElement('button')
  readonly clear = document.createElement('button')
  readonly positioner = document.createElement('div')
  readonly content = document.createElement('div')
  readonly days = dates.map(() => document.createElement('button'))
  readonly month = document.createElement('select')
  readonly year = document.createElement('select')

  constructor(
    readonly harness: CalendarHarness,
    readonly id: string,
    context: Partial<UserDefinedContext> = {},
    private readonly beforeStart?: (service: ReturnType<typeof machine>) => void,
  ) {
    const root = document.createElement('div')
    super(root, {
      id,
      selectionMode: 'range',
      defaultValue: [],
      focusedValue: dates[0],
      locale: 'en-US',
      timeZone: 'UTC',
      defaultOpen: false,
      closeOnSelect: true,
      ...context,
    })
    this.root = root
    for (const [select, values] of [
      [this.month, Array.from({ length: 12 }, (_, index) => String(index + 1))],
      [this.year, ['2023', '2024', '2025', '2026']],
    ] as const) {
      for (const value of values) {
        const option = document.createElement('option')
        option.value = value
        option.textContent = value
        select.append(option)
      }
    }
    this.control.append(...this.inputs, this.clear, this.trigger)
    this.content.append(this.month, this.year, ...this.days)
    this.positioner.append(this.content)
    root.append(this.control, this.positioner)
    document.body.append(root)
    this.inputs.forEach((input) => {
      input.type = 'text'
      harness.owners.set(input, { fixture: this, kind: 'input' })
      const focus = input.focus.bind(input)
      input.focus = (options) => {
        harness.record(this, 'focus')
        focus(options)
      }
      const selection = input.setSelectionRange.bind(input)
      input.setSelectionRange = (...args) => {
        harness.record(this, 'selection')
        selection(...args)
      }
    })
    harness.owners.set(this.month, { fixture: this, kind: 'month' })
    harness.owners.set(this.year, { fixture: this, kind: 'year' })
    harness.fixtures.push(this)
    this.init()
    // Keep native values independent of subsequent defaultValue rendering.
    this.inputs.forEach((input) => {
      input.value = ''
    })
    this.month.value = '1'
    this.year.value = '2024'
  }

  get actor() { return this.service }
  get calendar() { return this.api }
  get values() { return this.inputs.map(input => input.value) }
  get selected() {
    const value = this.actor.getState().context.value
    assert.ok(value)
    return value.map(date => date.toString())
  }

  get formatted() { return [...this.actor.getState().context.valueAsString] }

  initService(context: UserDefinedContext) {
    const service = machine(context)
    this.beforeStart?.(service)
    return service
  }

  initApi() { return connect(this.actor.getState(), this.actor.send, normalizeProps) }

  render() {
    spreadProps(this.root, this.api.getRootProps())
    spreadProps(this.control, this.api.getControlProps())
    this.inputs.forEach((input, index) => spreadProps(input, this.api.getInputProps({ index })))
    spreadProps(this.trigger, this.api.getTriggerProps())
    spreadProps(this.clear, this.api.getClearTriggerProps())
    spreadProps(this.positioner, this.api.getPositionerProps())
    spreadProps(this.content, this.api.getContentProps())
    spreadProps(this.month, this.api.getMonthSelectProps())
    spreadProps(this.year, this.api.getYearSelectProps())
    this.days.forEach((day, index) => spreadProps(day, this.api.getDayTableCellTriggerProps({ value: dates[index] })))
  }

  async selectRange() {
    assert.equal(this.calendar.open, true)
    this.days[0].click()
    this.days[1].click()
    await checkpoint()
    assert.deepEqual(this.selected, ['2024-01-10', '2024-01-15'])
    assert.equal(this.content.hidden, true)
    assert.ok(this.harness.frames.size > 0)
  }

  remove() {
    try {
      this.destroy()
    }
    finally {
      this.root.remove()
    }
    assert.equal(this.actor.status, 'Stopped')
    assert.equal(this.root.isConnected, false)
  }

  assertEmptyClosed() {
    assert.deepEqual(this.selected, [])
    assert.equal(this.actor.getState().value, 'idle')
    assert.deepEqual(this.values, ['', ''])
    assert.equal(this.clear.hidden, true)
    assert.equal(this.content.hidden, true)
  }
}

export class CalendarHarness {
  readonly frames = new Map<number, FrameRequestCallback>()
  readonly timers = new Set<number>()
  readonly calls: DomCall[] = []
  readonly fixtures: CalendarFixture[] = []
  readonly owners = new WeakMap<Element, { fixture: CalendarFixture, kind: 'input' | 'month' | 'year' }>()
  readonly afterInputWrite = new WeakMap<HTMLInputElement, VoidFunction>()
  private readonly restore: VoidFunction[] = []
  private readonly sentinels: HTMLElement[] = []
  private nextId = 0
  private frame = 0

  constructor() {
    const request = (callback: FrameRequestCallback) => {
      const id = ++this.nextId
      this.frames.set(id, callback)
      return id
    }
    const cancel = (id: number) => {
      this.frames.delete(id)
    }
    for (const target of new Set<object>([globalThis, window])) {
      this.replace(target, 'requestAnimationFrame', request)
      this.replace(target, 'cancelAnimationFrame', cancel)
    }
    // Only live-region announcement timers are held. Native Promise jobs run.
    this.replace(window, 'setTimeout', () => {
      const id = ++this.nextId
      this.timers.add(id)
      return id
    })
    this.replace(window, 'clearTimeout', (id: number) => {
      this.timers.delete(id)
    })
    const { owners, afterInputWrite } = this
    const record = this.record.bind(this)
    for (const prototype of [window.HTMLInputElement.prototype, window.HTMLSelectElement.prototype]) {
      const descriptor = Object.getOwnPropertyDescriptor(prototype, 'value')!
      Object.defineProperty(prototype, 'value', {
        ...descriptor,
        get: descriptor.get,
        set(this: HTMLInputElement | HTMLSelectElement, value: string) {
          const owner = owners.get(this)
          const before = descriptor.get!.call(this) as string
          descriptor.set!.call(this, value)
          if (owner)
            record(owner.fixture, owner.kind, before, descriptor.get!.call(this))
          if (owner?.kind === 'input')
            afterInputWrite.get(this as HTMLInputElement)?.()
        },
      })
      this.restore.push(() => Object.defineProperty(prototype, 'value', descriptor))
    }
  }

  private replace(target: object, key: string, value: unknown) {
    const descriptor = Object.getOwnPropertyDescriptor(target, key)
    Object.defineProperty(target, key, { configurable: true, writable: true, value })
    this.restore.push(() => {
      if (descriptor)
        Object.defineProperty(target, key, descriptor)
      else Reflect.deleteProperty(target, key)
    })
  }

  record(fixture: CalendarFixture, kind: DomCall['kind'], before?: string, value?: string) {
    assert.ok(this.calls.length < 200, 'Unexpected unbounded DOM activity')
    this.calls.push({ fixture, kind, before, value, status: fixture.actor?.status ?? 'Not Started' })
  }

  mount(id: string, context: Partial<UserDefinedContext> = {}, beforeStart?: (service: ReturnType<typeof machine>) => void) {
    return new CalendarFixture(this, id, context, beforeStart)
  }

  outsideFocus() {
    const sentinel = document.createElement('button')
    document.body.append(sentinel)
    this.sentinels.push(sentinel)
    sentinel.focus()
    assert.equal(document.activeElement === sentinel, true)
    return sentinel
  }

  flushFrame() {
    this.frame++
    // Keep later callbacks in the map: a prior callback can still cancel them.
    for (const id of [...this.frames.keys()]) {
      const callback = this.frames.get(id)
      if (!callback)
        continue
      this.frames.delete(id)
      callback(this.frame * 16)
    }
  }

  async dispose() {
    const errors: unknown[] = []
    for (const fixture of this.fixtures) {
      try {
        fixture.remove()
      }
      catch (error) { errors.push(error) }
    }
    try {
      await checkpoint()
      assert.equal(this.frames.size, 0, 'Destroyed calendars left RAF work pending')
      assert.equal(this.timers.size, 0, 'Destroyed calendars left announcement timers pending')
    }
    catch (error) { errors.push(error) }
    finally {
      this.sentinels.forEach(sentinel => sentinel.remove())
      this.restore.reverse().forEach(restore => restore())
    }
    if (errors.length)
      throw new AggregateError(errors, 'Calendar fixture cleanup failed')
  }
}
