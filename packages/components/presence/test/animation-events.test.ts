import { afterEach, describe, expect, it, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

// These contract tests control event delivery and timers, not native CSS scheduling.
describe('presence animation event identity', () => {
  const services: ReturnType<typeof machine>[] = []

  afterEach(() => {
    services.splice(0).forEach(service => service.stop())
    vi.useRealTimers()
  })

  async function setup() {
    vi.useFakeTimers()
    const styles = { animationName: 'enter', animationDuration: '1s', animationDelay: '0s', display: 'block' }
    const listeners = new Map<string, Set<(event: object) => void>>()
    const node = {
      ownerDocument: { visibilityState: 'visible', defaultView: { getComputedStyle: () => styles } },
      addEventListener(type: string, callback: (event: object) => void) {
        if (!listeners.has(type))
          listeners.set(type, new Set())
        listeners.get(type)!.add(callback)
      },
      removeEventListener(type: string, callback: (event: object) => void) {
        listeners.get(type)?.delete(callback)
      },
    } as unknown as HTMLElement
    const onExitComplete = vi.fn()
    const service = machine({ present: true, immediate: true, onExitComplete }).start()
    services.push(service)
    const api = () => connect(service.getState(), service.send, null as any)
    api().setNode(node)
    const flush = async () => {
      await Promise.resolve()
      await Promise.resolve()
    }
    const close = async (name = 'exit') => {
      styles.animationName = name
      service.setContext({ present: false })
      await flush()
      expect(service.state.value).toBe('unmountSuspended')
    }
    const dispatch = (type: string, animationName?: string, target: object = node, path: object[] = [target]) => {
      const event = { type, animationName, target, composedPath: () => path }
      listeners.get(type)?.forEach(listener => listener(event))
    }
    await close()
    return { service, styles, node, api, flush, close, dispatch, onExitComplete, listeners }
  }

  it.each(['animationend', 'animationcancel'])('ignores an unrelated %s on the current node', async (type) => {
    const { service, dispatch, onExitComplete } = await setup()
    dispatch(type, 'enter')
    expect(service.state.value).toBe('unmountSuspended')
    expect(onExitComplete).not.toHaveBeenCalled()
    dispatch(type, 'exit')
    expect(service.state.value).toBe('unmounted')
    expect(onExitComplete).toHaveBeenCalledOnce()
    dispatch('animationend', 'exit')
    dispatch('animationcancel', 'exit')
    await vi.advanceTimersByTimeAsync(1500)
    expect(onExitComplete).toHaveBeenCalledOnce()
  })

  it.each(['ex', 'exit-extra', 'EXIT'])('rejects the nonmatching name %s without substring or case matching', async (name) => {
    const { service, dispatch, onExitComplete } = await setup()
    dispatch('animationend', name)
    expect(service.state.value).toBe('unmountSuspended')
    expect(onExitComplete).not.toHaveBeenCalled()
    dispatch('animationend', 'exit')
    expect(onExitComplete).toHaveBeenCalledOnce()
  })

  it.each(['animationend', 'animationcancel'])('keeps unnamed generic %s controls', async (type) => {
    const { service, dispatch, onExitComplete } = await setup()
    dispatch(type)
    expect(service.state.value).toBe('unmounted')
    expect(onExitComplete).toHaveBeenCalledOnce()
  })

  it.each(['animationend', 'animationcancel'])('keeps empty-name %s controls', async (type) => {
    const { service, dispatch, onExitComplete } = await setup()
    dispatch(type, '')
    expect(service.state.value).toBe('unmounted')
    expect(onExitComplete).toHaveBeenCalledOnce()
  })

  it('keeps explicit unmount independent of animation identity', async () => {
    const { service, dispatch, api, onExitComplete } = await setup()
    dispatch('animationcancel', 'enter')
    api().unmount()
    expect(service.state.value).toBe('unmounted')
    expect(onExitComplete).toHaveBeenCalledOnce()
  })

  it.each(['animationend', 'animationcancel'])('ignores matching %s from descendants, including a retargeted shadow descendant', async (type) => {
    const { service, node, dispatch, onExitComplete } = await setup()
    const child = {}
    dispatch(type, 'exit', child)
    dispatch(type, 'exit', node, [child, node])
    expect(service.state.value).toBe('unmountSuspended')
    expect(onExitComplete).not.toHaveBeenCalled()
    dispatch(type, 'exit')
    expect(onExitComplete).toHaveBeenCalledOnce()
  })

  it('does not accept an old exit after reopening and starting a different exit', async () => {
    const { service, styles, flush, close, dispatch, onExitComplete } = await setup()
    styles.animationName = 'enter'
    service.setContext({ present: true })
    await flush()
    dispatch('animationend', 'exit')
    expect(service.state.value).toBe('mounted')
    expect(onExitComplete).not.toHaveBeenCalled()
    await close('second-exit')
    dispatch('animationcancel', 'exit')
    expect(service.state.value).toBe('unmountSuspended')
    expect(onExitComplete).not.toHaveBeenCalled()
    dispatch('animationend', 'second-exit')
    expect(onExitComplete).toHaveBeenCalledOnce()
  })

  it('removes old listeners and accepts only the new exit after an explicit restart', async () => {
    const { service, node, api, flush, close, dispatch, listeners, onExitComplete } = await setup()
    service.stop()
    expect([...listeners.values()].every(set => set.size === 0)).toBe(true)
    dispatch('animationend', 'exit')
    await vi.advanceTimersByTimeAsync(1500)
    expect(onExitComplete).not.toHaveBeenCalled()
    service.setContext({ present: true })
    service.start({ value: 'mounted' })
    api().setNode(node)
    await flush()
    await close('restarted-exit')
    dispatch('animationcancel', 'exit')
    expect(service.state.value).toBe('unmountSuspended')
    expect(onExitComplete).not.toHaveBeenCalled()
    dispatch('animationend', 'restarted-exit')
    expect(onExitComplete).toHaveBeenCalledOnce()
  })

  it('does not postpone the fallback timeout when an unrelated event is ignored', async () => {
    const { service, dispatch, onExitComplete } = await setup()
    await vi.advanceTimersByTimeAsync(500)
    dispatch('animationcancel', 'enter')
    expect(service.state.value).toBe('unmountSuspended')
    await vi.advanceTimersByTimeAsync(500)
    expect(service.state.value).toBe('unmountSuspended')
    await vi.advanceTimersByTimeAsync(17)
    expect(service.state.value).toBe('unmounted')
    expect(onExitComplete).toHaveBeenCalledOnce()
    dispatch('animationend', 'exit')
    expect(onExitComplete).toHaveBeenCalledOnce()
  })

  it('retains the computed-style guard even for a matching event name', async () => {
    const { service, styles, dispatch, onExitComplete } = await setup()
    styles.animationName = 'replacement'
    dispatch('animationend', 'exit')
    dispatch('animationend', 'replacement')
    expect(service.state.value).toBe('unmountSuspended')
    expect(onExitComplete).not.toHaveBeenCalled()
    styles.animationName = 'exit'
    dispatch('animationend', 'exit')
    expect(onExitComplete).toHaveBeenCalledOnce()
  })

  it.each([
    ['"exit, part"', 'exit, part'],
    ['exit\\,part', 'exit,part'],
    ['\\65 xit', 'exit'],
    ['"exit part"', 'exit part'],
    ['"none"', 'none'],
    ['pr\u00E9sence', 'pr\u00E9sence'],
    ['"presence\\"exit"', 'presence"exit'],
    ['"presence\\\\exit"', 'presence\\exit'],
    ['presence\\ ', 'presence '],
  ])('preserves CSS name serialization %s', async (serializedName, name) => {
    const { service, styles, dispatch, onExitComplete } = await setup()
    styles.animationName = serializedName
    service.setContext({ unmountAnimationName: serializedName })
    await Promise.resolve()
    dispatch('animationend', name)
    expect(service.state.value).toBe('unmounted')
    expect(onExitComplete).toHaveBeenCalledOnce()
  })

  it('matches individual names without accepting substrings within a list', async () => {
    const { service, styles, dispatch, onExitComplete } = await setup()
    styles.animationName = 'first-exit, "exit, part"'
    service.setContext({ unmountAnimationName: styles.animationName })
    await Promise.resolve()
    dispatch('animationend', 'exit')
    expect(service.state.value).toBe('unmountSuspended')
    expect(onExitComplete).not.toHaveBeenCalled()
    dispatch('animationend', 'exit, part')
    expect(service.state.value).toBe('unmounted')
    expect(onExitComplete).toHaveBeenCalledOnce()
  })

  it.each(['first-exit', 'second-exit'])('preserves completion by the listed animation %s', async (name) => {
    const { service, styles, dispatch, onExitComplete } = await setup()
    // Preserve the existing first-event policy; this is not a longest-animation policy.
    styles.animationName = 'first-exit, second-exit'
    service.setContext({ unmountAnimationName: styles.animationName })
    await Promise.resolve()
    dispatch('animationend', name)
    expect(service.state.value).toBe('unmounted')
    expect(onExitComplete).toHaveBeenCalledOnce()
  })
})
