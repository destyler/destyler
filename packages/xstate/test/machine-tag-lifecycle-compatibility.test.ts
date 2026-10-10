import { describe, expect, it } from 'vitest'
import { ActionTypes, createMachine, MachineStatus, proxy, ref, subscribe } from '../index'

function createTaggedMachine(tags: string | string[] | undefined) {
  return createMachine({
    initial: 'idle',
    states: {
      idle: { tags, on: { GO: 'next' } },
      next: { tags: 'next', on: { BACK: 'idle' } },
    },
  })
}

describe('tag lifecycle compatibility', () => {
  it.each(['ready', ' ', 'ready-tag'])('keeps the complete ordinary string tag %j', (tag) => {
    const machine = createTaggedMachine(tag)
    expect(machine.getState().tags).toEqual([tag])
    machine.start()
    expect(machine.getState().tags).toEqual([tag])
    expect(machine.getState().hasTag(tag)).toBe(true)
    expect(machine.getState().hasTag('read')).toBe(false)
    machine.send('GO')
    expect(machine.getState().tags).toEqual(['next'])
    machine.send('BACK')
    expect(machine.getHydrationState()).toEqual({ value: 'idle', tags: [tag] })
    machine.stop()
  })

  it.each([undefined, []])('keeps absent and empty-array tags empty: %j', (tags) => {
    const machine = createTaggedMachine(tags).start()
    expect(machine.getState().tags).toEqual([])
    expect(machine.getState().hasTag('')).toBe(false)
    machine.send('GO')
    machine.send('BACK')
    expect(machine.getState().tags).toEqual([])
    machine.stop()
    machine.start()
    expect(machine.getState().tags).toEqual([])
    machine.stop()
  })

  it('retains immutable snapshots and initialization metadata through hydration and restart', () => {
    const machine = createMachine({
      context: { count: 0 },
      initial: 'idle',
      states: { idle: { tags: 'ready' }, empty: { tags: '' } },
    })
    const initial = machine.getState()
    machine.start({ value: 'empty', context: { count: 2 } })
    const started = machine.getState()
    expect(started.tags).toEqual([''])
    expect(started.event.type).toBe(ActionTypes.Init)
    expect(started.previousValue).toBe('')
    expect(started.changed).toBe(false)
    expect(started.context.count).toBe(2)
    expect(Object.isFrozen(started.tags)).toBe(true)
    expect(machine.getState()).toBe(started)
    const hydration = machine.getHydrationState()
    machine.stop()
    expect(machine.getState().tags).toEqual([])
    expect(started.tags).toEqual([''])
    expect(started.hasTag('')).toBe(true)
    expect(initial.tags).toEqual(['ready'])
    machine.start(hydration)
    expect(machine.getState().tags).toEqual([''])
    expect(machine.getState().event.type).toBe(ActionTypes.Init)
    expect(machine.getState().changed).toBe(false)
    expect(machine.getState().tags).not.toBe(started.tags)
    expect(hydration.tags).toEqual([''])
    machine.stop()
  })

  it('preserves event identity, changed metadata and tag visibility in actions', () => {
    const seen: Array<{ phase: string, tags: Array<string | undefined>, event: string }> = []
    const machine = createMachine({
      initial: 'idle',
      states: {
        idle: {
          tags: 'ready',
          on: { GO: { target: 'empty', actions: (_context, event, meta) => {
            seen.push({ phase: 'transition', tags: meta.state.tags, event: event.type })
          } } },
        },
        empty: {
          tags: '',
          entry: (_context, event, meta) => {
            seen.push({ phase: 'entry', tags: meta.state.tags, event: event.type })
          },
          on: { STAY: { actions: (_context, event, meta) => {
            seen.push({ phase: 'targetless', tags: meta.state.tags, event: event.type })
          } } },
        },
      },
    }).start()
    const initEvent = machine.getState().event
    const event = { type: 'GO', value: ActionTypes.Init }
    machine.send(event)
    const transitioned = machine.getState()
    expect(transitioned.event).toBe(event)
    expect(transitioned.previousEvent).toBe(initEvent)
    expect(transitioned.previousValue).toBe('idle')
    expect(transitioned.changed).toBe(true)
    expect(transitioned.hasTag('')).toBe(true)
    const stay = { type: 'STAY' }
    machine.send(stay)
    expect(machine.getState().event).toBe(stay)
    expect(machine.getState().previousEvent).toBe(event)
    expect(machine.getState().previousValue).toBe('empty')
    expect(machine.getState().changed).toBe(false)
    expect(machine.getState().tags).toEqual([''])
    expect(seen).toEqual([
      { phase: 'transition', tags: ['ready'], event: 'GO' },
      { phase: 'entry', tags: [''], event: 'GO' },
      { phase: 'targetless', tags: [''], event: 'STAY' },
    ])
    machine.stop()
  })

  it.each([
    ['ordinary', () => ['ready']],
    ['proxy', () => proxy(['ready'])],
    ['ref', () => ref(['ready'])],
  ] as const)('copies %s arrays again on reentry without changing saved snapshots', (_kind, createTags) => {
    const tags = createTags()
    const machine = createTaggedMachine(tags).start()
    const started = machine.getState()
    const live = machine.state.tags
    tags.push('configured')
    machine.state.tags.push('local')
    const changed = machine.getState()
    expect(changed.tags).toEqual(['ready', 'local'])
    machine.send('GO')
    machine.send('BACK')
    expect(machine.state.tags).not.toBe(live)
    expect(machine.state.tags).not.toBe(tags)
    expect(machine.getState().tags).toEqual(['ready', 'configured'])
    expect(started.tags).toEqual(['ready'])
    expect(changed.tags).toEqual(['ready', 'local'])
    machine.stop()
    expect(tags).toEqual(['ready', 'configured'])
  })

  it('copies frozen arrays into mutable runtime tags without mutating the input', () => {
    const tags = ['ready', '']
    Object.freeze(tags)
    const machine = createTaggedMachine(tags).start()
    expect(machine.state.tags).not.toBe(tags)
    expect(machine.getState().tags).toEqual(['ready', ''])
    machine.state.tags.push('local')
    expect(tags).toEqual(['ready', ''])
    expect(Object.isFrozen(tags)).toBe(true)
    machine.stop()
    machine.start()
    expect(machine.getState().tags).toEqual(['ready', ''])
    machine.stop()
  })

  it('preserves sparse-array holes, order and duplicates when copying tags', () => {
    const tags: string[] = []
    tags.length = 4
    tags[1] = ''
    tags[2] = 'ready'
    tags[3] = ''
    const machine = createTaggedMachine(tags).start()
    const started = machine.getState()
    expect(started.tags).toHaveLength(4)
    expect(0 in started.tags).toBe(false)
    expect(started.tags.slice(1)).toEqual(['', 'ready', ''])
    expect(started.hasTag('')).toBe(true)
    tags[0] = 'configured'
    expect(0 in started.tags).toBe(false)
    machine.stop()
    machine.start()
    expect(machine.getState().tags).toEqual(['configured', '', 'ready', ''])
    expect(0 in started.tags).toBe(false)
    machine.stop()
  })

  it('reads array accessors when copying on each entry without keeping a live accessor', () => {
    let value = 'ready'
    let reads = 0
    const tags: string[] = []
    Object.defineProperty(tags, '0', {
      get() {
        reads++
        return value
      },
      enumerable: true,
      configurable: true,
    })
    const machine = createTaggedMachine(tags)
    expect(reads).toBe(0)
    machine.start()
    expect(reads).toBe(1)
    expect(Object.getOwnPropertyDescriptor(machine.state.tags, '0')?.get).toBeUndefined()
    expect(machine.getState().tags).toEqual(['ready'])
    value = 'later'
    expect(machine.getState().tags).toEqual(['ready'])
    machine.send('GO')
    machine.send('BACK')
    expect(reads).toBe(2)
    expect(machine.getState().tags).toEqual(['later'])
    machine.stop()
  })

  it.each([false, true])('honors a synchronous stop triggered by empty-tag observation (restart: %s)', (restart) => {
    const entries: string[] = []
    const machine = createMachine({
      initial: 'idle',
      states: {
        idle: { tags: 'ready', on: { GO: 'empty' } },
        empty: { tags: '', entry: () => entries.push('stale') },
        fresh: { tags: 'fresh', entry: () => entries.push('fresh') },
      },
    }).start()
    let interrupted = false
    const release = subscribe(machine.state, () => {
      if (!interrupted && machine.state.hasTag('')) {
        interrupted = true
        machine.stop()
        if (restart)
          machine.start({ value: 'fresh' })
      }
    }, true)
    machine.send('GO')
    release()
    expect(interrupted).toBe(true)
    expect(entries).toEqual(restart ? ['fresh'] : [])
    expect(machine.getState().tags).toEqual(restart ? ['fresh'] : [])
    expect(machine.status).toBe(restart ? MachineStatus.Running : MachineStatus.Stopped)
    if (restart)
      expect(machine.getState().value).toBe('fresh')
    machine.stop()
  })

  it.each([false, true])('preserves empty tags in final onDone snapshots (stop in transition: %s)', (stopInTransition) => {
    const completed: Array<{ tags: Array<string | undefined>, hasTag: boolean, event: string, done: boolean }> = []
    const machine = createMachine({
      initial: 'idle',
      states: {
        idle: { on: { FINISH: { target: 'done', actions: (_context, _event, { self }) => {
          if (stopInTransition)
            self.stop()
        } } } },
        done: { tags: '', type: 'final' },
      },
    }).onDone(state => completed.push({ tags: state.tags, hasTag: state.hasTag(''), event: state.event.type, done: state.done })).start()
    machine.send('FINISH')
    expect(completed).toEqual([{ tags: [''], hasTag: true, event: stopInTransition ? ActionTypes.Stop : 'FINISH', done: true }])
    expect(machine.status).toBe(MachineStatus.Stopped)
    machine.start()
    expect(machine.getState().done).toBe(false)
    expect(machine.getState().tags).toEqual([])
    expect(completed[0].tags).toEqual([''])
    machine.stop()
  })
})
