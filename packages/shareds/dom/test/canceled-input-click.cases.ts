import { afterEach, expect, it, vi } from 'vitest'
import { trackCanceledInputClick } from '../src/form'

const cleanups: Array<() => void> = []
afterEach(() => {
  cleanups.splice(0).reverse().forEach(cleanup => cleanup())
  vi.restoreAllMocks()
})
const settle = () => new Promise<void>(resolve => setTimeout(resolve, 0))
function fixture() {
  const root = document.createElement('div')
  const input = document.createElement('input')
  input.type = 'checkbox'
  root.append(input)
  document.body.append(root)
  const callback = vi.fn<(input: HTMLInputElement) => void>()
  const cleanup = trackCanceledInputClick(root, callback)!
  cleanups.push(() => root.remove(), cleanup)
  return { root, input, callback, cleanup }
}
it('waits beyond microtasks and inspects cancellation from a later listener', async () => {
  const view = fixture()
  view.input.addEventListener('click', event => event.preventDefault())
  view.input.click()
  expect(view.callback).not.toHaveBeenCalled()
  await Promise.resolve()
  expect(view.callback).not.toHaveBeenCalled()
  await settle()
  expect(view.callback).toHaveBeenCalledExactlyOnceWith(view.input)
})
it('does not reconcile uncanceled activation', async () => {
  const view = fixture()
  view.input.click()
  await settle()
  expect(view.callback).not.toHaveBeenCalled()
})
it('does not reconcile unrelated click targets', async () => {
  const view = fixture()
  view.root.addEventListener('click', event => event.preventDefault())
  view.root.click()
  await settle()
  expect(view.callback).not.toHaveBeenCalled()
})
it('cleanup cancels pending work and removes the listener', async () => {
  const view = fixture()
  view.input.addEventListener('click', event => event.preventDefault())
  view.input.click()
  view.cleanup()
  view.input.click()
  await settle()
  expect(view.callback).not.toHaveBeenCalled()
})
it('detaching a target before the task preserves its caller-owned state', async () => {
  const view = fixture()
  view.input.addEventListener('click', event => event.preventDefault())
  view.input.click()
  view.input.remove()
  await settle()
  expect(view.callback).not.toHaveBeenCalled()
})
it('stopping one tracker does not cancel another tracker', async () => {
  const first = fixture()
  const second = fixture()
  for (const view of [first, second]) {
    view.input.addEventListener('click', event => event.preventDefault())
    view.input.click()
  }
  first.cleanup()
  await settle()
  expect(first.callback).not.toHaveBeenCalled()
  expect(second.callback).toHaveBeenCalledExactlyOnceWith(second.input)
})
it('rejects a callback already dequeued before cleanup', () => {
  const view = fixture()
  let scheduled: (() => void) | undefined
  vi.spyOn(window, 'setTimeout').mockImplementation(((callback: () => void) => {
    scheduled = callback
    return 42
  }) as typeof window.setTimeout)
  vi.spyOn(window, 'clearTimeout').mockImplementation(() => {})
  view.input.addEventListener('click', event => event.preventDefault())
  view.input.click()
  expect(scheduled).toBeTypeOf('function')
  view.cleanup()
  scheduled!()
  expect(view.callback).not.toHaveBeenCalled()
})
it('uses the target document timer and input realm', async () => {
  const iframe = document.createElement('iframe')
  document.body.append(iframe)
  cleanups.push(() => iframe.remove())
  const win = iframe.contentWindow!
  const input = win.document.createElement('input')
  input.type = 'checkbox'
  win.document.body.append(input)
  const scheduled = vi.spyOn(win, 'setTimeout')
  const canceled = vi.spyOn(win, 'clearTimeout')
  const callback = vi.fn()
  const stop = trackCanceledInputClick(input, callback)!
  cleanups.push(stop)
  input.addEventListener('click', event => event.preventDefault())
  input.click()
  expect(scheduled).toHaveBeenCalledTimes(1)
  await settle()
  expect(callback).toHaveBeenCalledExactlyOnceWith(input)
  input.click()
  const timer = scheduled.mock.results[1].value
  stop()
  expect(canceled).toHaveBeenCalledWith(timer)
  await settle()
  expect(callback).toHaveBeenCalledTimes(1)
})
