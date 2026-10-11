// @vitest-environment happy-dom
import { normalizeProps } from '@destyler/vanilla'
import { createMachine, Machine } from '@destyler/xstate'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect, machine } from '../index'

type Service = ReturnType<typeof machine>
interface Request {
  signal: AbortSignal
  resolve: (value: { sRGBHex: string }) => void
}

const services: Service[] = []
const originalEyeDropper = Object.getOwnPropertyDescriptor(window, 'EyeDropper')
let nextId = 0

afterEach(() => {
  services.splice(0).forEach(service => service.stop())
  document.body.replaceChildren()
  if (originalEyeDropper)
    Object.defineProperty(window, 'EyeDropper', originalEyeDropper)
  else
    Reflect.deleteProperty(window, 'EyeDropper')
})

function installEyeDropper() {
  const requests: Request[] = []
  Object.defineProperty(window, 'EyeDropper', {
    configurable: true,
    value: class {
      open({ signal }: { signal: AbortSignal }) {
        // Hosts that ignore abort still must not publish an old owner's result.
        return new Promise<{ sRGBHex: string }>((resolve) => {
          requests.push({ signal, resolve })
        })
      }
    },
  })
  return requests
}

function observe(service: Service) {
  const onValueChange = vi.fn()
  const onValueChangeEnd = vi.fn()
  service.setContext({ onValueChange, onValueChangeEnd })
  services.push(service)
  const api = () => connect(service.state, service.send, normalizeProps)
  return { service, api, pick: () => api().getEyeDropperTriggerProps().onclick(), onValueChange, onValueChangeEnd }
}

const reconstruct = {
  'new Machine / copied configuration context': (source: Service) => new Machine({
    ...source.config,
    context: { ...source.config.context!, id: `owner-copy-${++nextId}` },
  }, source.options),
  'createMachine / copied configuration context': (source: Service) => createMachine({
    ...source.config,
    context: { ...source.config.context!, id: `owner-copy-${++nextId}` },
  }, source.options),
  'createMachine / copied live context': (source: Service) => createMachine({
    ...source.config,
    context: { ...source.state.context, id: `owner-copy-${++nextId}` },
  }, source.options),
}

async function settle() {
  for (let i = 0; i < 6; i++)
    await Promise.resolve()
}

for (const [name, copy] of Object.entries(reconstruct)) {
  describe(`color-picker EyeDropper reconstructed ownership: ${name}`, () => {
    it('preserves an owner request when its reconstructed peer starts', async () => {
      const requests = installEyeDropper()
      const owner = observe(machine({ id: `owner-${++nextId}` }))
      owner.service.start()
      owner.pick()
      const peer = observe(copy(owner.service))
      peer.service.start()
      expect(peer.service.state.context).not.toBe(owner.service.state.context)
      expect(requests[0].signal.aborted).toBe(false)
      requests[0].resolve({ sRGBHex: '#FF0000' })
      await settle()
      expect(owner.api().value.toString('hex')).toBe('#FF0000')
      expect(owner.onValueChange).toHaveBeenCalledTimes(1)
      expect(owner.onValueChangeEnd).toHaveBeenCalledTimes(1)
      expect(peer.onValueChange).not.toHaveBeenCalled()
      expect(peer.onValueChangeEnd).not.toHaveBeenCalled()
    })

    it('does not abort or invalidate the owner when its peer stops', async () => {
      const requests = installEyeDropper()
      const owner = observe(machine({ id: `owner-${++nextId}` }))
      owner.service.start()
      const peer = observe(copy(owner.service))
      peer.service.start()
      owner.pick()
      peer.service.stop()
      expect(requests[0].signal.aborted).toBe(false)
      requests[0].resolve({ sRGBHex: '#FF0000' })
      await settle()
      expect(owner.api().value.toString('hex')).toBe('#FF0000')
      expect(owner.onValueChange).toHaveBeenCalledTimes(1)
      expect(owner.onValueChangeEnd).toHaveBeenCalledTimes(1)
      expect(peer.onValueChange).not.toHaveBeenCalled()
      expect(peer.onValueChangeEnd).not.toHaveBeenCalled()
    })

    it('aborts only the stopped owner and allows the reconstructed peer to finish', async () => {
      const requests = installEyeDropper()
      const owner = observe(machine({ id: `owner-${++nextId}` }))
      owner.service.start()
      const peer = observe(copy(owner.service))
      peer.service.start()
      owner.pick()
      peer.pick()
      owner.service.stop()
      expect(requests[0].signal.aborted).toBe(true)
      expect(requests[1].signal.aborted).toBe(false)
      requests[0].resolve({ sRGBHex: '#FF0000' })
      requests[1].resolve({ sRGBHex: '#00FF00' })
      await settle()
      expect(owner.api().value.toString('hex')).toBe('#000000')
      expect(owner.onValueChange).not.toHaveBeenCalled()
      expect(owner.onValueChangeEnd).not.toHaveBeenCalled()
      expect(peer.api().value.toString('hex')).toBe('#00FF00')
      expect(peer.onValueChange).toHaveBeenCalledTimes(1)
      expect(peer.onValueChangeEnd).toHaveBeenCalledTimes(1)
    })

    it('preserves peer work across owner restart and retains replacement request ownership', async () => {
      const requests = installEyeDropper()
      const owner = observe(machine({ id: `owner-${++nextId}` }))
      owner.service.start()
      const peer = observe(copy(owner.service))
      peer.service.start()
      owner.pick()
      peer.pick()
      owner.service.stop()
      owner.service.start()
      owner.pick()
      expect(requests.map(request => request.signal.aborted)).toEqual([true, false, false])
      requests[0].resolve({ sRGBHex: '#FF0000' })
      await settle()
      expect(owner.api().value.toString('hex')).toBe('#000000')
      expect(owner.onValueChange).not.toHaveBeenCalled()
      expect(owner.onValueChangeEnd).not.toHaveBeenCalled()
      expect(requests[2].signal.aborted).toBe(false)
      requests[1].resolve({ sRGBHex: '#00FF00' })
      requests[2].resolve({ sRGBHex: '#0000FF' })
      await settle()
      expect(peer.api().value.toString('hex')).toBe('#00FF00')
      expect(owner.api().value.toString('hex')).toBe('#0000FF')
      expect(peer.onValueChange).toHaveBeenCalledTimes(1)
      expect(peer.onValueChangeEnd).toHaveBeenCalledTimes(1)
      expect(owner.onValueChange).toHaveBeenCalledTimes(1)
      expect(owner.onValueChangeEnd).toHaveBeenCalledTimes(1)
      owner.service.stop()
      peer.service.stop()
      expect(requests.map(request => request.signal.aborted)).toEqual([true, false, false])
    })
  })
}
