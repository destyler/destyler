import type { subscribe } from '@destyler/store'
import type { AnyMachine } from '@destyler/xstate'
import { createMachine } from '@destyler/xstate'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'
import { useActor } from '../src/hooks/use-actor'

// @ts-expect-error - React testing flag
globalThis.IS_REACT_ACT_ENVIRONMENT = true

const { subscribeSpy } = vi.hoisted(() => ({
  subscribeSpy: vi.fn<typeof subscribe>(),
}))

vi.mock('@destyler/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@destyler/store')>()
  return {
    ...actual,
    subscribe: subscribeSpy.mockImplementation((...args: Parameters<typeof actual.subscribe>) => vi.fn(actual.subscribe(...args))),
  }
})

function createActor(id: string, count = 0) {
  return createMachine({
    id,
    initial: 'idle',
    context: { count },
    on: { INC: { actions: 'increment' } },
    states: { idle: {} },
  }, {
    actions: { increment: ctx => ctx.count++ },
  }).start()
}

describe('react actor lifecycle', () => {
  it.each([0, 4])('follows a replacement actor starting at %s and detaches from the previous actor', async (count) => {
    const first = createActor('react.actor.first')
    const second = createActor('react.actor.second', count)
    const container = document.createElement('div')
    const root = createRoot(container)
    const subscriptionsBeforeMount = subscribeSpy.mock.calls.length
    let renders = 0

    function View({ actor }: { actor: AnyMachine }) {
      const [state, send] = useActor(actor)
      renders++
      return <button onClick={() => send('INC')}>{state.context.count}</button>
    }

    try {
      await act(async () => root.render(<View actor={first} />))
      expect(container.textContent).toBe('0')
      const firstSubscriptions = subscribeSpy.mock.calls.flatMap((args, index) => index >= subscriptionsBeforeMount && args[0] === first.state
        ? [subscribeSpy.mock.results[index].value]
        : [])
      expect(firstSubscriptions).toHaveLength(1)
      const [firstUnsubscribe] = firstSubscriptions

      await act(async () => root.render(<View actor={second} />))
      expect(firstUnsubscribe).toHaveBeenCalledTimes(1)
      expect(container.textContent).toBe(String(count))
      await act(async () => container.querySelector('button')!.click())
      expect(second.contextSnapshot.count).toBe(count + 1)
      expect(first.contextSnapshot.count).toBe(0)
      expect(container.textContent).toBe(String(count + 1))

      const rendersBeforeOldActorChange = renders
      await act(async () => first.send('INC'))
      expect(first.contextSnapshot.count).toBe(1)
      expect(renders).toBe(rendersBeforeOldActorChange)
      expect(container.textContent).toBe(String(count + 1))

      await act(async () => second.send('INC'))
      expect(container.textContent).toBe(String(count + 2))
    }
    finally {
      await act(async () => root.unmount())
      first.stop()
      second.stop()
    }
  })
})
