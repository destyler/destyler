// @vitest-environment happy-dom
import { parseColor } from '@destyler/color'
import { normalizeProps } from '@destyler/vanilla'
import { subscribe } from '@destyler/xstate'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect, machine } from '../index'

interface Request {
  signal: AbortSignal
  resolve: (value: { sRGBHex: string }) => void
  reject: (reason: unknown) => void
}

const services: Array<ReturnType<typeof machine>> = []
const subscriptions: Array<() => void> = []
const originalEyeDropper = Object.getOwnPropertyDescriptor(window, 'EyeDropper')
let nextId = 0

afterEach(() => {
  subscriptions.splice(0).forEach(unsubscribe => unsubscribe())
  services.splice(0).forEach(service => service.stop())
  document.body.replaceChildren()
  if (originalEyeDropper)
    Object.defineProperty(window, 'EyeDropper', originalEyeDropper)
  else
    Reflect.deleteProperty(window, 'EyeDropper')
})

function setup() {
  const requests: Request[] = []
  Object.defineProperty(window, 'EyeDropper', {
    configurable: true,
    value: class {
      open({ signal }: { signal: AbortSignal }) {
        return new Promise<{ sRGBHex: string }>((resolve, reject) => {
          requests.push({ signal, resolve, reject })
        })
      }
    },
  })
  const id = `eyedropper-challenge-${++nextId}`
  const form = document.createElement('form')
  const input = document.createElement('input')
  input.type = 'hidden'
  input.id = `color-picker:${id}:hidden-input`
  input.value = 'rgba(0, 0, 0, 1)'
  form.append(input)
  document.body.append(form)
  const onValueChange = vi.fn()
  const onValueChangeEnd = vi.fn()
  const onInput = vi.fn()
  form.addEventListener('input', onInput)
  const service = machine({ id, onValueChange, onValueChangeEnd })
  services.push(service)
  service.start()
  const api = () => connect(service.state, service.send, normalizeProps)
  return { service, api, requests, onValueChange, onValueChangeEnd, onInput, input, pick: () => api().getEyeDropperTriggerProps().onclick() }
}

async function settle() {
  for (let i = 0; i < 6; i++)
    await Promise.resolve()
}

describe('color-picker EyeDropper continuation and compatibility challenges', () => {
  it.each([false, true])('stops async continuation after a synchronous value subscriber ends its lifetime (restart=%s)', async (restart) => {
    const { service, api, requests, onValueChange, onValueChangeEnd, onInput, input, pick } = setup()
    const replacementChange = vi.fn()
    const replacementEnd = vi.fn()
    let interrupted = false
    subscriptions.push(subscribe(service.state.context, () => {
      if (interrupted || api().value.toString('hex') !== '#FF0000')
        return
      interrupted = true
      service.stop()
      if (restart) {
        service.start()
        service.setContext({ value: parseColor('#0000FF'), onValueChange: replacementChange, onValueChangeEnd: replacementEnd })
        pick()
      }
    }, true))
    pick()
    requests[0].resolve({ sRGBHex: '#FF0000' })
    await settle()
    expect(interrupted).toBe(true)
    expect(service.status).toBe(restart ? 'Running' : 'Stopped')
    expect(api().value.toString('hex')).toBe(restart ? '#0000FF' : '#FF0000')
    expect(requests[0].signal.aborted).toBe(true)
    expect(onValueChange).not.toHaveBeenCalled()
    expect(onValueChangeEnd).not.toHaveBeenCalled()
    expect(replacementChange).not.toHaveBeenCalled()
    expect(replacementEnd).not.toHaveBeenCalled()
    expect(onInput).not.toHaveBeenCalled()
    expect(input.value).toBe('rgba(0, 0, 0, 1)')
    if (restart) {
      expect(requests).toHaveLength(2)
      expect(requests[1].signal.aborted).toBe(false)
      requests[1].resolve({ sRGBHex: '#00FF00' })
      await settle()
      expect(api().value.toString('hex')).toBe('#00FF00')
      expect(input.value).toBe('rgba(0, 255, 0, 1)')
      expect(replacementChange).toHaveBeenCalledTimes(1)
      expect(replacementEnd).toHaveBeenCalledTimes(1)
      expect(onInput).toHaveBeenCalledTimes(1)
      expect(onValueChange).not.toHaveBeenCalled()
      expect(onValueChangeEnd).not.toHaveBeenCalled()
    }
  })

  it.each([false, true])('preserves synchronous setter callbacks and form order after subscriber interruption (restart=%s)', (restart) => {
    const { service, api, onValueChange, onValueChangeEnd, onInput, input } = setup()
    const calls: string[] = []
    const replacementChange = vi.fn(() => calls.push('replacement change'))
    let interrupted = false
    subscriptions.push(subscribe(service.state.context, () => {
      if (interrupted || api().value.toString('hex') !== '#FF0000')
        return
      interrupted = true
      calls.push('subscriber')
      service.stop()
      if (restart) {
        service.start()
        service.setContext({ value: parseColor('#0000FF'), onValueChange: replacementChange })
      }
    }, true))
    onValueChange.mockImplementation(() => calls.push('change'))
    onInput.mockImplementation(() => calls.push('input'))
    api().setValue('#FF0000')
    expect(calls).toEqual(['subscriber', restart ? 'replacement change' : 'change', 'input'])
    expect(service.status).toBe(restart ? 'Running' : 'Stopped')
    expect(input.value).toBe(restart ? 'rgba(0, 0, 255, 1)' : 'rgba(255, 0, 0, 1)')
    expect(onValueChange).toHaveBeenCalledTimes(restart ? 0 : 1)
    expect(replacementChange).toHaveBeenCalledTimes(restart ? 1 : 0)
    expect(onInput).toHaveBeenCalledTimes(1)
    expect(onValueChangeEnd).not.toHaveBeenCalled()
  })

  it('reads replacement callbacks from the current live actor context', async () => {
    const { service, api, requests, onValueChange, onValueChangeEnd, onInput, pick } = setup()
    const replacementChange = vi.fn()
    const replacementEnd = vi.fn()
    pick()
    service.setContext({ onValueChange: replacementChange, onValueChangeEnd: replacementEnd })
    requests[0].resolve({ sRGBHex: '#FF0000' })
    await settle()
    expect(api().value.toString('hex')).toBe('#FF0000')
    expect(onValueChange).not.toHaveBeenCalled()
    expect(onValueChangeEnd).not.toHaveBeenCalled()
    expect(replacementChange).toHaveBeenCalledExactlyOnceWith({ value: parseColor('#FF0000'), valueAsString: 'rgba(255, 0, 0, 1)' })
    expect(replacementEnd).toHaveBeenCalledExactlyOnceWith({ value: parseColor('#FF0000'), valueAsString: 'rgba(255, 0, 0, 1)' })
    expect(onInput).toHaveBeenCalledTimes(1)
  })

  it('releases a rejected request without releasing its still-pending sibling', async () => {
    const { service, requests, onValueChange, onValueChangeEnd, onInput, pick } = setup()
    pick()
    pick()
    requests[0].reject(new DOMException('User canceled', 'AbortError'))
    await settle()
    service.stop()
    expect(requests.map(request => request.signal.aborted)).toEqual([false, true])
    requests[1].resolve({ sRGBHex: '#FF0000' })
    await settle()
    expect(onValueChange).not.toHaveBeenCalled()
    expect(onValueChangeEnd).not.toHaveBeenCalled()
    expect(onInput).not.toHaveBeenCalled()
  })

  it('keeps replacement cancellation owned after a stale request finally settles', async () => {
    const { service, api, requests, onValueChange, onValueChangeEnd, onInput, pick } = setup()
    pick()
    service.stop()
    service.start()
    pick()
    requests[0].resolve({ sRGBHex: '#FF0000' })
    await settle()
    expect(api().value.toString('hex')).toBe('#000000')
    expect(requests[1].signal.aborted).toBe(false)
    service.stop()
    expect(requests[1].signal.aborted).toBe(true)
    requests[1].resolve({ sRGBHex: '#00FF00' })
    await settle()
    expect(api().value.toString('hex')).toBe('#000000')
    expect(onValueChange).not.toHaveBeenCalled()
    expect(onValueChangeEnd).not.toHaveBeenCalled()
    expect(onInput).not.toHaveBeenCalled()
  })
})
