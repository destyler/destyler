// @vitest-environment happy-dom
import { parseColor } from '@destyler/color'
import { normalizeProps } from '@destyler/vanilla'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect, machine } from '../index'

interface Request {
  signal?: AbortSignal
  resolve: (value: { sRGBHex: string }) => void
  reject: (reason: unknown) => void
}

const services: Array<ReturnType<typeof machine>> = []
const originalEyeDropper = Object.getOwnPropertyDescriptor(window, 'EyeDropper')

afterEach(() => {
  services.splice(0).forEach(service => service.stop())
  document.body.replaceChildren()
  if (originalEyeDropper)
    Object.defineProperty(window, 'EyeDropper', originalEyeDropper)
  else
    Reflect.deleteProperty(window, 'EyeDropper')
})

function installEyeDropper(options: { rejectOverlap?: boolean } = {}) {
  const requests: Request[] = []
  let active = false
  const open = vi.fn((openOptions?: { signal?: AbortSignal }) => {
    if (active && options.rejectOverlap)
      return Promise.reject(new DOMException('Already open', 'InvalidStateError'))
    active = true
    return new Promise<{ sRGBHex: string }>((resolve, reject) => {
      // Deliberately ignore abort so stale-completion guards are tested too.
      requests.push({
        signal: openOptions?.signal,
        resolve(value) {
          active = false
          resolve(value)
        },
        reject(reason) {
          active = false
          reject(reason)
        },
      })
    })
  })
  Object.defineProperty(window, 'EyeDropper', { configurable: true, value: class { open = open } })
  return { requests, open }
}

function setup() {
  const form = document.createElement('form')
  const input = document.createElement('input')
  input.type = 'hidden'
  input.id = 'color-picker:eyedropper-lifetime:hidden-input'
  input.name = 'color'
  input.value = 'rgba(0, 0, 0, 1)'
  form.append(input)
  document.body.append(form)
  const onValueChange = vi.fn()
  const onValueChangeEnd = vi.fn()
  const service = machine({ id: 'eyedropper-lifetime', onValueChange, onValueChangeEnd })
  services.push(service)
  service.start()
  const api = () => connect(service.state, service.send, normalizeProps)
  const pick = () => api().getEyeDropperTriggerProps().onclick()
  return { service, api, pick, onValueChange, onValueChangeEnd, form, input }
}

async function settle() {
  for (let i = 0; i < 5; i++)
    await Promise.resolve()
}

describe('color-picker EyeDropper lifetime', () => {
  it('aborts pending selection and ignores completion after stop', async () => {
    const { requests } = installEyeDropper()
    const { service, api, pick, onValueChange, onValueChangeEnd } = setup()
    pick()
    expect(requests).toHaveLength(1)
    service.stop()
    expect(requests[0].signal?.aborted).toBe(true)
    requests[0].resolve({ sRGBHex: '#FF0000' })
    await settle()
    expect(api().value.toString('hex')).toBe('#000000')
    expect(onValueChange).not.toHaveBeenCalled()
    expect(onValueChangeEnd).not.toHaveBeenCalled()
  })

  it('keeps restarted generation independent of an old promise that ignores abort', async () => {
    const { requests } = installEyeDropper()
    const { service, api, pick, onValueChange, onValueChangeEnd } = setup()
    pick()
    service.stop()
    service.start()
    service.setContext({ value: parseColor('#0000FF') })
    pick()
    expect(requests).toHaveLength(2)
    requests[0].resolve({ sRGBHex: '#FF0000' })
    await settle()
    expect(api().value.toString('hex')).toBe('#0000FF')
    expect(onValueChange).not.toHaveBeenCalled()
    expect(onValueChangeEnd).not.toHaveBeenCalled()
    expect(requests[1].signal?.aborted).toBe(false)
    requests[1].resolve({ sRGBHex: '#00FF00' })
    await settle()
    expect(api().value.toString('hex')).toBe('#00FF00')
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith({ value: parseColor('#00FF00'), valueAsString: 'rgba(0, 255, 0, 1)' })
    expect(onValueChangeEnd).toHaveBeenCalledExactlyOnceWith({ value: parseColor('#00FF00'), valueAsString: 'rgba(0, 255, 0, 1)' })
  })

  it('does not write or notify the form after the change callback stops the service', async () => {
    const { requests } = installEyeDropper()
    const { service, api, pick, onValueChange, onValueChangeEnd, form, input } = setup()
    const calls: string[][] = []
    const onInput = vi.fn(() => calls.push(['input', service.status, input.value]))
    form.addEventListener('input', onInput)
    onValueChange.mockImplementation((details) => {
      calls.push(['change', service.status, details.valueAsString, input.value])
      service.stop()
      calls.push(['stopped', service.status, input.value])
    })
    pick()
    requests[0].resolve({ sRGBHex: '#FF0000' })
    await settle()
    expect(calls).toEqual([
      ['change', 'Running', 'rgba(255, 0, 0, 1)', 'rgba(0, 0, 0, 1)'],
      ['stopped', 'Stopped', 'rgba(0, 0, 0, 1)'],
    ])
    expect(service.status).toBe('Stopped')
    expect(api().value.toString('hex')).toBe('#FF0000')
    expect(input.value).toBe('rgba(0, 0, 0, 1)')
    expect(onValueChange).toHaveBeenCalledTimes(1)
    expect(onInput).not.toHaveBeenCalled()
    expect(onValueChangeEnd).not.toHaveBeenCalled()
    expect(requests[0].signal?.aborted).toBe(true)
  })

  it('does not dispatch an old form event into a restarted generation', async () => {
    const { requests } = installEyeDropper()
    const { service, api, pick, onValueChange, onValueChangeEnd, form, input } = setup()
    const calls: string[][] = []
    const onInput = vi.fn(() => calls.push(['input', service.status, input.value]))
    const restartedChange = vi.fn(details => calls.push(['new-change', service.status, details.valueAsString, input.value]))
    const restartedEnd = vi.fn(details => calls.push(['new-end', service.status, details.valueAsString, input.value]))
    form.addEventListener('input', onInput)
    onValueChange.mockImplementation((details) => {
      calls.push(['change', service.status, details.valueAsString, input.value])
      service.stop()
      service.start()
      service.setContext({ value: parseColor('#0000FF'), onValueChange: restartedChange, onValueChangeEnd: restartedEnd })
      calls.push(['restarted', service.status, input.value])
      pick()
    })
    pick()
    requests[0].resolve({ sRGBHex: '#FF0000' })
    await settle()
    expect(calls).toEqual([
      ['change', 'Running', 'rgba(255, 0, 0, 1)', 'rgba(0, 0, 0, 1)'],
      ['restarted', 'Running', 'rgba(0, 0, 0, 1)'],
    ])
    expect(service.status).toBe('Running')
    expect(api().value.toString('hex')).toBe('#0000FF')
    expect(input.value).toBe('rgba(0, 0, 0, 1)')
    expect(onValueChange).toHaveBeenCalledTimes(1)
    expect(onValueChangeEnd).not.toHaveBeenCalled()
    expect(onInput).not.toHaveBeenCalled()
    expect(restartedChange).not.toHaveBeenCalled()
    expect(restartedEnd).not.toHaveBeenCalled()
    expect(requests).toHaveLength(2)
    expect(requests[0].signal?.aborted).toBe(true)
    expect(requests[1].signal?.aborted).toBe(false)

    requests[1].resolve({ sRGBHex: '#00FF00' })
    await settle()
    expect(api().value.toString('hex')).toBe('#00FF00')
    expect(input.value).toBe('rgba(0, 255, 0, 1)')
    expect(calls.slice(2)).toEqual([
      ['new-change', 'Running', 'rgba(0, 255, 0, 1)', 'rgba(0, 0, 0, 1)'],
      ['input', 'Running', 'rgba(0, 255, 0, 1)'],
      ['new-end', 'Running', 'rgba(0, 255, 0, 1)', 'rgba(0, 255, 0, 1)'],
    ])
    expect(onInput).toHaveBeenCalledTimes(1)
    expect(restartedChange).toHaveBeenCalledTimes(1)
    expect(restartedEnd).toHaveBeenCalledTimes(1)
  })

  it('releases completed requests and retains change, bubbling input, then end ordering', async () => {
    const { requests } = installEyeDropper()
    const { service, api, pick, onValueChange, onValueChangeEnd, form, input } = setup()
    const calls: string[][] = []
    onValueChange.mockImplementation(details => calls.push(['change', service.status, details.valueAsString, input.value]))
    onValueChangeEnd.mockImplementation(details => calls.push(['end', service.status, details.valueAsString, input.value]))
    const onInput = vi.fn(() => calls.push(['input', service.status, input.value]))
    form.addEventListener('input', onInput)
    pick()
    requests[0].resolve({ sRGBHex: '#FF0000' })
    await settle()
    expect(api().value.toString('hex')).toBe('#FF0000')
    expect(input.value).toBe('rgba(255, 0, 0, 1)')
    expect(calls).toEqual([
      ['change', 'Running', 'rgba(255, 0, 0, 1)', 'rgba(0, 0, 0, 1)'],
      ['input', 'Running', 'rgba(255, 0, 0, 1)'],
      ['end', 'Running', 'rgba(255, 0, 0, 1)', 'rgba(255, 0, 0, 1)'],
    ])
    expect(onValueChange).toHaveBeenCalledTimes(1)
    expect(onInput).toHaveBeenCalledTimes(1)
    expect(onValueChangeEnd).toHaveBeenCalledTimes(1)
    service.stop()
    expect(requests[0].signal?.aborted).toBe(false)
  })

  it('stops the remaining completion notification when a form listener restarts the service', async () => {
    const { requests } = installEyeDropper()
    const { service, api, pick, onValueChange, onValueChangeEnd, form, input } = setup()
    const calls: string[][] = []
    const restartedEnd = vi.fn()
    onValueChange.mockImplementation(details => calls.push(['change', service.status, details.valueAsString, input.value]))
    const onInput = vi.fn(() => {
      calls.push(['input', service.status, input.value])
      service.stop()
      service.start()
      service.setContext({ value: parseColor('#0000FF'), onValueChangeEnd: restartedEnd })
      calls.push(['restarted', service.status, input.value])
    })
    form.addEventListener('input', onInput)
    pick()
    requests[0].resolve({ sRGBHex: '#FF0000' })
    await settle()
    expect(calls).toEqual([
      ['change', 'Running', 'rgba(255, 0, 0, 1)', 'rgba(0, 0, 0, 1)'],
      ['input', 'Running', 'rgba(255, 0, 0, 1)'],
      ['restarted', 'Running', 'rgba(255, 0, 0, 1)'],
    ])
    expect(service.status).toBe('Running')
    expect(api().value.toString('hex')).toBe('#0000FF')
    expect(input.value).toBe('rgba(255, 0, 0, 1)')
    expect(onValueChange).toHaveBeenCalledTimes(1)
    expect(onInput).toHaveBeenCalledTimes(1)
    expect(onValueChangeEnd).not.toHaveBeenCalled()
    expect(restartedEnd).not.toHaveBeenCalled()
    expect(requests[0].signal?.aborted).toBe(true)
  })

  it('preserves ordinary synchronous setValue behavior across callback stop and restart', () => {
    for (const restart of [false, true]) {
      const { service, api, onValueChange, onValueChangeEnd, form, input } = setup()
      const calls: string[][] = []
      const status = restart ? 'Running' : 'Stopped'
      const finalValue = restart ? 'rgba(0, 0, 255, 1)' : 'rgba(255, 0, 0, 1)'
      const onInput = vi.fn(() => calls.push(['input', service.status, input.value]))
      form.addEventListener('input', onInput)
      onValueChange.mockImplementation((details) => {
        calls.push(['change', service.status, details.valueAsString, input.value])
        service.stop()
        if (restart) {
          service.start()
          service.setContext({ value: parseColor('#0000FF') })
        }
        calls.push(['after-callback', service.status, input.value])
      })
      api().setValue('#FF0000')
      expect(calls).toEqual([
        ['change', 'Running', 'rgba(255, 0, 0, 1)', 'rgba(0, 0, 0, 1)'],
        ['after-callback', status, 'rgba(0, 0, 0, 1)'],
        ['input', status, finalValue],
      ])
      expect(service.status).toBe(status)
      expect(api().value.toString('rgba')).toBe(finalValue)
      expect(input.value).toBe(finalValue)
      expect(onValueChange).toHaveBeenCalledTimes(1)
      expect(onInput).toHaveBeenCalledTimes(1)
      expect(onValueChangeEnd).not.toHaveBeenCalled()
      service.stop()
      form.remove()
    }
  })

  it('preserves user cancellation and same-generation InvalidStateError ownership', async () => {
    const { requests, open } = installEyeDropper({ rejectOverlap: true })
    const { api, pick, onValueChange, onValueChangeEnd } = setup()
    pick()
    pick()
    await settle()
    expect(open).toHaveBeenCalledTimes(2)
    expect(requests).toHaveLength(1)
    expect(requests[0].signal?.aborted).toBe(false)
    expect(onValueChange).not.toHaveBeenCalled()
    requests[0].resolve({ sRGBHex: '#FF0000' })
    await settle()
    expect(api().value.toString('hex')).toBe('#FF0000')
    expect(onValueChange).toHaveBeenCalledTimes(1)
    expect(onValueChangeEnd).toHaveBeenCalledTimes(1)
    pick()
    requests[1].reject(new DOMException('User canceled', 'AbortError'))
    await settle()
    expect(onValueChange).toHaveBeenCalledTimes(1)
    expect(onValueChangeEnd).toHaveBeenCalledTimes(1)
  })

  it('keeps unsupported API inert and preserves synchronous native errors', () => {
    Reflect.deleteProperty(window, 'EyeDropper')
    const { service, pick, onValueChange, onValueChangeEnd } = setup()
    expect(pick).not.toThrow()
    for (const stage of ['constructor', 'open']) {
      const error = new Error(`synchronous ${stage} failure`)
      let signal: AbortSignal | undefined
      Object.defineProperty(window, 'EyeDropper', {
        configurable: true,
        value: class {
          constructor() {
            if (stage === 'constructor')
              throw error
          }

          open(options?: { signal?: AbortSignal }) {
            signal = options?.signal
            throw error
          }
        },
      })
      expect(pick).toThrow(error)
      service.stop()
      if (signal)
        expect(signal.aborted).toBe(false)
      service.start()
    }
    expect(onValueChange).not.toHaveBeenCalled()
    expect(onValueChangeEnd).not.toHaveBeenCalled()
  })
})
