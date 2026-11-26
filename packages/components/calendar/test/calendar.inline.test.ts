// @vitest-environment happy-dom
import { CalendarDate } from '@internationalized/date'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { normalizeProps } from '../../../frameworks/vanilla/src/normalize-props'
import { connect } from '../src/connect'
import { dom } from '../src/dom'
import { machine } from '../src/machine'
import { splitProps } from '../src/props'

const services: Array<ReturnType<typeof machine>> = []
const date = new CalendarDate(2026, 11, 15)
const next = new CalendarDate(2026, 11, 16)
afterEach(() => {
  for (const service of services.splice(0)) service.stop()
  document.body.replaceChildren()
})

function setup(id: string, context: Parameters<typeof machine>[0] = { id }) {
  const service = machine({ focusedValue: date, ...context, id })
  services.push(service)
  const api = () => connect(service.state, service.send, normalizeProps)
  return { service, api }
}

describe('inline Calendar', () => {
  it('forwards the opt-in and remains open without popup nodes', async () => {
    expect(splitProps({ inline: true })[0].inline).toBe(true)
    const onOpenChange = vi.fn()
    const { service, api } = setup('inline', { id: 'inline', inline: true, open: false, onOpenChange })
    service.start()
    expect(api().open).toBe(true)
    service.send({ type: 'CELL.CLICK', value: next, view: 'day' })
    expect(api().value[0].toString()).toBe(next.toString())
    for (const type of ['TABLE.ESCAPE', 'TRIGGER.CLICK', 'INTERACT_OUTSIDE', 'CLOSE', 'CONTROLLED.CLOSE'])
      service.send(type)
    api().setOpen(false)
    service.setContext({ inline: false, open: false })
    await Promise.resolve()
    expect(service.state.context.isInline).toBe(true)
    expect(api().open).toBe(true)
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it('scopes the focused cell to each inline root, not to a popup or the document', () => {
    const a = setup('a', { id: 'a', inline: true })
    const b = setup('b', { id: 'b', inline: true })
    for (const { service } of [a, b]) {
      const root = document.createElement('div')
      root.id = dom.getRootId(service.state.context)
      root.dataset.scope = 'calendar'
      root.dataset.part = 'root'
      const cell = document.createElement('button')
      cell.dataset.part = 'table-cell-trigger'
      cell.dataset.view = 'day'
      cell.dataset.focus = ''
      root.append(cell)
      document.body.append(root)
    }
    const first = dom.getFocusedCell(a.service.state.context)
    const second = dom.getFocusedCell(b.service.state.context)
    expect(first).not.toBeNull()
    expect(second).not.toBeNull()
    expect(first).not.toBe(second)
    second?.focus()
    expect(document.activeElement).toBe(second)
    first?.focus()
    expect(document.activeElement).toBe(first)
  })

  it('runs native deferred focus after a keyboard move within the correct inline instance', async () => {
    const fixtures = ['left', 'right'].map((id) => {
      const { service, api } = setup(id, { id, inline: true })
      const root = document.createElement('div')
      root.id = dom.getRootId(service.state.context)
      root.dataset.scope = 'calendar'
      root.dataset.part = 'root'
      const buttons = [date, next].map((value) => {
        const button = document.createElement('button')
        button.dataset.part = 'table-cell-trigger'
        button.dataset.view = 'day'
        button.textContent = value.toString()
        root.append(button)
        return button
      })
      document.body.append(root)
      const render = () => buttons.forEach((button, index) => {
        const value = [date, next][index]
        button.toggleAttribute('data-focus', api().focusedValue.toString() === value.toString())
      })
      service.start()
      render()
      return { service, buttons, render }
    })
    const [left, right] = fixtures
    left.buttons[0].focus()
    left.service.send({ type: 'TABLE.ARROW_RIGHT', view: 'day', columns: 7, focus: true })
    left.render()
    for (let i = 0; i < 12; i++) await Promise.resolve()
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
    expect(document.activeElement).toBe(left.buttons[1])
    expect(right.service.state.context.focusedValue.toString()).toBe(date.toString())
  })

  it('restores inline text selection after outside pointer release and stop', () => {
    const { service } = setup('selection', { id: 'selection', inline: true })
    const root = document.createElement('div')
    root.id = dom.getRootId(service.state.context)
    root.dataset.scope = 'calendar'
    root.dataset.part = 'root'
    root.style.userSelect = 'text'
    document.body.append(root)
    service.start()
    service.send({ type: 'TABLE.POINTER_DOWN', pointerId: 1 })
    expect(root.style.userSelect).toBe('none')
    document.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 1 }))
    expect(root.style.userSelect).toBe('text')
    service.send({ type: 'TABLE.POINTER_DOWN', pointerId: 1 })
    service.send({ type: 'TABLE.POINTER_DOWN', pointerId: 1 })
    document.dispatchEvent(new PointerEvent('pointercancel', { bubbles: true, pointerId: 1 }))
    expect(root.style.userSelect).toBe('text')
    service.send({ type: 'TABLE.POINTER_DOWN', pointerId: 1 })
    service.send({ type: 'TABLE.POINTER_UP', pointerId: 1 })
    expect(root.style.userSelect).toBe('text')
    service.send({ type: 'TABLE.POINTER_DOWN', pointerId: 1 })
    service.stop()
    expect(root.style.userSelect).toBe('text')
  })

  it('keeps popup behavior as the default', () => {
    const { service, api } = setup('popup')
    service.start()
    expect(api().open).toBe(false)
    api().setOpen(true)
    expect(api().open).toBe(true)
    api().setOpen(false)
    expect(api().open).toBe(false)
  })
})
