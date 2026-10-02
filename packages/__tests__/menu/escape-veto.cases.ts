import type { Service } from '../../components/menu/src/types'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../../components/menu/src/connect'
import { machine } from '../../components/menu/src/machine'
import { createNormalizer } from '../../types/src/prop-types'

const normalize = createNormalizer(props => props)
const services: Service[] = []
beforeEach(() => vi.useFakeTimers())
afterEach(() => {
  for (const service of services.splice(0).reverse())
    service.stop()
  vi.clearAllTimers()
  vi.useRealTimers()
  document.body.replaceChildren()
})

function setup(depth: number, controlledRoot: boolean, veto: boolean) {
  return Array.from({ length: depth }, (_, index) => {
    const id = `escape-veto-${index}`
    const trigger = document.createElement('button')
    trigger.id = `${id}-trigger`
    const content = document.createElement('div')
    content.id = `${id}-content`
    content.tabIndex = 0
    content.setAttribute('role', 'menu')
    document.body.append(trigger, content)
    const onOpenChange = vi.fn()
    const onEscapeKeyDown = vi.fn((event: KeyboardEvent) => {
      if (index === depth - 1 && veto)
        event.preventDefault()
    })
    const service = machine({
      id,
      ids: { trigger: trigger.id, content: content.id },
      ...(controlledRoot && index === 0 ? { open: true } : { defaultOpen: true }),
      onOpenChange,
      onEscapeKeyDown,
    })
    const parent = services.at(-1)
    services.push(service)
    const api = () => connect(service.getState(), service.send, normalize)
    service.start()
    if (parent) {
      api().setParent(parent)
      connect(parent.getState(), parent.send, normalize).setChild(service)
    }
    return { service, api, content, onOpenChange, onEscapeKeyDown }
  })
}

for (const depth of [1, 2, 3]) {
  describe(`menu Escape at depth ${depth}`, () => {
    for (const controlledRoot of [false, true]) {
      it.each([false, true])(`honors cancellation with controlledRoot=${controlledRoot}, veto=%s`, async (veto) => {
        const menus = setup(depth, controlledRoot, veto)
        const root = menus[0]
        const leaf = menus[menus.length - 1]
        await vi.advanceTimersByTimeAsync(48)
        expect(menus.every(menu => menu.api().open)).toBe(true)
        const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
        leaf.content.dispatchEvent(event)
        expect(leaf.onEscapeKeyDown).toHaveBeenCalledTimes(1)
        for (const ancestor of menus.slice(0, -1))
          expect(ancestor.onEscapeKeyDown).not.toHaveBeenCalled()
        expect(event.defaultPrevented).toBe(true)
        if (veto) {
          expect(menus.every(menu => menu.api().open)).toBe(true)
          for (const menu of menus)
            expect(menu.onOpenChange).not.toHaveBeenCalled()
        }
        else {
          expect(root.onOpenChange.mock.calls).toEqual([[{ open: false }]])
          expect(root.api().open).toBe(controlledRoot)
          if (controlledRoot) {
            expect(menus.every(menu => menu.api().open)).toBe(true)
            root.service.setContext({ open: false })
            await vi.advanceTimersByTimeAsync(0)
          }
          expect(menus.every(menu => !menu.api().open)).toBe(true)
        }
      })
    }
  })
}

it.each([false, true])('allows a later Escape after a veto with controlledRoot=%s', async (controlledRoot) => {
  const [root, leaf] = setup(2, controlledRoot, true)
  await vi.advanceTimersByTimeAsync(48)
  const escape = () => leaf.content.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
  escape()
  expect(root.onOpenChange).not.toHaveBeenCalled()
  expect(root.api().open).toBe(true)
  expect(leaf.api().open).toBe(true)
  const acceptEscape = vi.fn()
  leaf.service.setContext({ onEscapeKeyDown: acceptEscape })
  await vi.advanceTimersByTimeAsync(0)
  escape()
  expect(acceptEscape).toHaveBeenCalledTimes(1)
  expect(root.onOpenChange.mock.calls).toEqual([[{ open: false }]])
  if (controlledRoot) {
    expect(root.api().open).toBe(true)
    root.service.setContext({ open: false })
    await vi.advanceTimersByTimeAsync(0)
  }
  expect(root.api().open).toBe(false)
  expect(leaf.api().open).toBe(false)
})
