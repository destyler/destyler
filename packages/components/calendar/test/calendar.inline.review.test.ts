// @vitest-environment happy-dom
import { CalendarDate } from '@internationalized/date'
import { afterEach, expect, it, vi } from 'vitest'
import { normalizeProps } from '../../../frameworks/vanilla/src/normalize-props'
import { connect } from '../src/connect'
import { dom } from '../src/dom'
import { machine } from '../src/machine'

const services: ReturnType<typeof machine>[] = []
afterEach(() => {
  for (const s of services.splice(0))
    s.stop()
  document.body.replaceChildren()
})
function make(id: string, view: 'day' | 'month' = 'day') {
  const service = machine({ id, inline: true, focusedValue: new CalendarDate(2026, 11, 15) })
  services.push(service)
  const api = () => connect(service.state, service.send, normalizeProps)
  const root = document.createElement('div')
  root.id = dom.getRootId(service.state.context)
  root.dataset.scope = 'calendar'
  root.dataset.part = 'root'
  const cell = document.createElement('button')
  cell.dataset.scope = 'calendar'
  cell.dataset.part = 'table-cell-trigger'
  cell.dataset.view = view
  cell.dataset.focus = ''
  root.append(cell)
  document.body.append(root)
  service.start()
  return { service, api, root, cell }
}
it('changing an inline calendar view programmatically does not move outside keyboard focus', async () => {
  const { api, cell } = make('inline', 'month')
  const external = document.createElement('button')
  document.body.append(external)
  external.focus()
  api().setView('month')
  for (let i = 0; i < 12; i++) await Promise.resolve()
  await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
  expect(document.activeElement).toBe(external)
  expect(document.activeElement).not.toBe(cell)
})
it('nested inline calendar is not selected by ancestor root focus lookup', () => {
  const outer = make('outer')
  const inner = make('inner')
  outer.root.prepend(inner.root)
  expect(dom.getFocusedCell(outer.service.state.context)).toBe(outer.cell)
})
it('a different active pointer release does not restore an inline gesture early', () => {
  const a = make('a')
  const b = make('b')
  a.root.style.userSelect = 'text'
  b.root.style.userSelect = 'text'
  const pointerDown = (fixture: ReturnType<typeof make>, pointerId: number) => {
    const props = fixture.api().getTableProps()
    const table = document.createElement('table')
    fixture.root.append(table)
    table.addEventListener('pointerdown', (props as any).onpointerdown)
    table.dispatchEvent(new PointerEvent('pointerdown', { pointerId, bubbles: true }))
  }
  pointerDown(a, 1)
  pointerDown(b, 2)
  pointerDown(b, 3)
  document.dispatchEvent(new PointerEvent('pointerup', { pointerId: 1, bubbles: true }))
  expect(a.root.style.userSelect).toBe('text')
  expect(b.root.style.userSelect).toBe('none')
  document.dispatchEvent(new PointerEvent('pointercancel', { pointerId: 2, bubbles: true }))
  expect(b.root.style.userSelect).toBe('none')
  document.dispatchEvent(new PointerEvent('pointerup', { pointerId: 3, bubbles: true }))
  expect(b.root.style.userSelect).toBe('text')
})

it('does not refocus the calendar when focus leaves before a deferred keyboard update', async () => {
  const { service, cell } = make('keyboard')
  const external = document.createElement('button')
  document.body.append(external)
  cell.focus()
  service.send({ type: 'TABLE.ARROW_RIGHT', view: 'day', columns: 7, focus: true })
  for (let i = 0; i < 12; i++) await Promise.resolve()
  external.focus()
  await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
  expect(document.activeElement).toBe(external)
})

it('preserves grid focus on an owned view change', async () => {
  const { api, root, cell } = make('view')
  const month = cell.cloneNode() as HTMLButtonElement
  month.dataset.view = 'month'
  root.append(month)
  cell.focus()
  api().setView('month')
  for (let i = 0; i < 12; i++) await Promise.resolve()
  await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
  expect(document.activeElement).toBe(month)
})

it('does not steal focus from a nested calendar on an ancestor view update', async () => {
  const outer = make('outer-view', 'month')
  const inner = make('inner-view')
  outer.root.prepend(inner.root)
  inner.cell.focus()
  outer.api().setView('month')
  for (let i = 0; i < 12; i++) await Promise.resolve()
  await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
  expect(document.activeElement).toBe(inner.cell)
})

it('retains the shared iOS inline selection lock until both instances finish', async () => {
  const platform = vi.spyOn(navigator, 'platform', 'get').mockReturnValue('iPhone')
  const style = { webkitUserSelect: 'text' } as CSSStyleDeclaration
  const rootStyle = vi.spyOn(document.documentElement, 'style', 'get').mockReturnValue(style)
  try {
    const a = make('ios-a')
    const b = make('ios-b')
    a.service.send({ type: 'TABLE.POINTER_DOWN', pointerId: 1 })
    b.service.send({ type: 'TABLE.POINTER_DOWN', pointerId: 2 })
    expect(style.webkitUserSelect).toBe('none')
    document.dispatchEvent(new PointerEvent('pointerup', { pointerId: 1, bubbles: true }))
    await new Promise(resolve => setTimeout(resolve, 400))
    expect(style.webkitUserSelect).toBe('none')
    document.dispatchEvent(new PointerEvent('pointercancel', { pointerId: 2, bubbles: true }))
    await new Promise(resolve => setTimeout(resolve, 400))
    expect(style.webkitUserSelect).toBe('text')
  }
  finally {
    platform.mockRestore()
    rootStyle.mockRestore()
  }
})
