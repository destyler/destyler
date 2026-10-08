import type {
  ActionMap,
  Actions,
  Activity,
  ActivityMap,
  AnyEventObject,
  DelayMap,
  Dict,
  Event,
  EventObject,
  GuardMap,
  GuardMeta,
  MachineConfig,
  MachineOptions,
  Meta,
  StateInfo,
  StateInit,
  StateListener,
  StateNode,
  StateSchema,
  Transitions,
  VoidFunction,
  Writable,
  XSelf,
  XState,
} from './type'
import { clone, ref, snapshot, subscribe } from '@destyler/store'
import {
  cast,
  clear,
  compact,
  hasProp,
  isArray,
  isObject,
  isString,
  noop,
  runIfFn,
  uuid,
} from '@destyler/utils'
import { createProxy } from './create-proxy'
import { deepMerge } from './deep-merge'
import { determineDelayFn } from './delay-utils'
import { determineActionsFn, determineGuardFn } from './guard-utils'
import { determineTransitionFn } from './transition-utils'
import {
  ActionTypes,
  MachineStatus,
  MachineType,
} from './type'
import { toArray, toEvent } from './utils'

// These keys stay private to each implementation, including subclass and proxy users.
const stoppingKey = Symbol('stopping')
const startingKey = Symbol('starting')
const lifecycleVersionKey = Symbol('lifecycleVersion')
const runVersionKey = Symbol('runVersion')
const exitingStateKey = Symbol('exitingState')

const stopPhaseKey = Symbol('stopPhase')
const pendingStopsKey = Symbol('pendingStops')

interface ActivityCleanup {
  cleanup: VoidFunction
  retry: boolean
}

interface ExitWork {
  prepare?: () => VoidFunction[]
  tasks?: VoidFunction[]
  selecting: boolean
  running: Set<number>
  completed: Set<number>
}

interface StopPhase {
  stateExit?: string
  stateWork?: ExitWork
  rootWork: ExitWork
  cleanup: number
}

function createExitWork(): ExitWork {
  return { selecting: false, running: new Set(), completed: new Set() }
}

export class Machine<
  TContext extends Dict,
  TState extends StateSchema,
  TEvent extends EventObject = AnyEventObject,
> {
  public status: MachineStatus = MachineStatus.NotStarted
  public readonly state: XState<TContext, TState, TEvent>

  private [stoppingKey] = false
  private [startingKey] = false
  private [stopPhaseKey]: StopPhase | undefined
  private [pendingStopsKey]: StopPhase[] = []
  private [lifecycleVersionKey] = 0
  private [runVersionKey] = 0
  private [exitingStateKey]: { value: string, version: number, work: ExitWork } | undefined

  public initialState: StateInfo<TContext, TState, TEvent> | undefined
  public initialContext: TContext

  public id: string

  public type: MachineType = MachineType.Machine

  // Cleanup function map (per state)
  private activityEvents = new Map<string, Map<string, ActivityCleanup[]>>()
  private delayedEvents = new Map<string, VoidFunction[]>()

  // state update listeners the user can opt-in for
  private stateListeners = new Set<StateListener<TContext, TState, TEvent>>()
  private doneListeners = new Set<StateListener<TContext, TState, TEvent>>()
  private contextWatchers = new Set<VoidFunction>()

  // Cleanup functions (for `subscribe`)
  private removeStateListener: VoidFunction = noop

  // For Parent <==> Spawned Actor relationship
  private parent?: AnyMachine
  private children = new Map<string, AnyMachine>()

  // A map of guard, action, delay implementations
  private guardMap: GuardMap<TContext, TState, TEvent>
  private actionMap: ActionMap<TContext, TState, TEvent>
  private delayMap: DelayMap<TContext, TEvent>
  private activityMap: ActivityMap<TContext, TState, TEvent>
  private sync: boolean
  public options: MachineOptions<TContext, TState, TEvent>
  public config: MachineConfig<TContext, TState, TEvent>

  // Let's get started!
  constructor(config: MachineConfig<TContext, TState, TEvent>, options?: MachineOptions<TContext, TState, TEvent>) {
    // clone the config and options
    this.config = clone(config)
    this.options = clone(options ?? {})

    this.id = this.config.id ?? `machine-${uuid()}`

    // maps
    this.guardMap = this.options?.guards ?? {}
    this.actionMap = this.options?.actions ?? {}
    this.delayMap = this.options?.delays ?? {}
    this.activityMap = this.options?.activities ?? {}
    this.sync = this.options?.sync ?? false

    // create mutable state
    this.state = createProxy(this.config)

    this.initialContext = snapshot(this.state.context)
  }

  // immutable state value
  private get stateSnapshot(): XState<TContext, TState, TEvent> {
    return cast(snapshot(this.state))
  }

  public getState(): XState<TContext, TState, TEvent> {
    return this.stateSnapshot
  }

  // immutable context value
  public get contextSnapshot(): TContext {
    return this.stateSnapshot.context
  }

  // created actions
  public _created = () => {
    if (!this.config.created)
      return
    const event = toEvent<TEvent>(ActionTypes.Created)
    this.executeActions(this.config.created, event)
  }

  // Starts the interpreted machine.
  public start = (init?: StateInit<TContext, TState>) => {
    // Don't start if it's already running
    if (this.status === MachineStatus.Running || this[stoppingKey] || this[startingKey]) {
      return this
    }

    if (this[stopPhaseKey]) {
      this[pendingStopsKey].push(this[stopPhaseKey])
      this[stopPhaseKey] = undefined
    }

    // Claim this attempt before reset writes can call start or stop again, while
    // preserving the existing status seen by synchronous reset subscribers.
    const version = ++this[lifecycleVersionKey]
    const runVersion = ++this[runVersionKey]
    this[startingKey] = true
    try {
      // reset state back to empty (for SSR, we had to set state.value to initial value)
      this.state.value = ''
      if (version !== this[lifecycleVersionKey])
        return this
      this.state.tags = []
      if (version !== this[lifecycleVersionKey])
        return this
      this.state.done = false
      if (version !== this[lifecycleVersionKey])
        return this
    }
    finally {
      this[startingKey] = false
    }
    this.status = MachineStatus.Running

    // subscribe to state changes
    this.removeStateListener = subscribe(
      this.state,
      () => {
        if (runVersion !== this[runVersionKey])
          return
        const version = this[lifecycleVersionKey]
        for (const listener of this.stateListeners) {
          listener(this.stateSnapshot)
          if (version !== this[lifecycleVersionKey])
            return
        }
      },
      this.sync,
    )

    this.setupContextWatchers()

    // execute initial actions and activities
    this.executeActivities(toEvent<TEvent>(ActionTypes.Start), toArray(this.config.activities), ActionTypes.Start)
    if (version !== this[lifecycleVersionKey])
      return this
    this.executeActions(this.config.entry, toEvent<TEvent>(ActionTypes.Start))
    if (version !== this[lifecycleVersionKey])
      return this

    // start transition
    const event = toEvent<TEvent>(ActionTypes.Init)

    const target = isObject(init) ? init.value : init
    const context = isObject(init) ? init.context : undefined

    if (context) {
      this.setContext(context as Partial<TContext>)
      if (version !== this[lifecycleVersionKey])
        return this
    }

    // start transition definition
    const transition = {
      target: target ?? this.config.initial,
    }

    const next = this.getNextStateInfo(transition, event)
    this.initialState = next

    this.performStateChangeEffects(this.state.value!, next, event)

    return this
  }

  private setupContextWatchers = () => {
    const { watch } = this.config
    if (!watch)
      return

    let prev = snapshot(this.state.context)
    const runVersion = this[runVersionKey]

    const cleanup = subscribe(this.state.context, () => {
      if (runVersion !== this[runVersionKey])
        return
      const version = this[lifecycleVersionKey]
      const next = snapshot(this.state.context)

      for (const [key, fn] of Object.entries(watch)) {
        const isEqual = this.options.compareFns?.[key] ?? Object.is
        const equal = isEqual(prev[key], next[key])
        if (version !== this[lifecycleVersionKey])
          return
        if (equal)
          continue
        this.executeActions(fn, this.state.event as TEvent)
        if (version !== this[lifecycleVersionKey])
          return
      }

      prev = next
    })

    this.contextWatchers.add(cleanup)
  }

  // Stops the interpreted machine
  stop = () => {
    const isStopped = () => this.status === MachineStatus.Stopped
    const wasStopped = isStopped()
    if (wasStopped && this[startingKey]) {
      this[lifecycleVersionKey]++
      this[startingKey] = false
    }
    if (wasStopped && !this[stopPhaseKey] && this[pendingStopsKey].length === 0
      && this.children.size === 0 && this.activityEvents.size === 0
      && this.delayedEvents.size === 0 && this.contextWatchers.size === 0) {
      return
    }

    const ownsStop = !this[stoppingKey]
    const phase = this[stopPhaseKey] ?? {
      rootWork: wasStopped ? { ...createExitWork(), tasks: [] } : createExitWork(),
      cleanup: wasStopped ? 6 : 0,
    }
    const runVersion = this[runVersionKey]
    const canContinueStop = () => runVersion === this[runVersionKey]
    this[stopPhaseKey] = phase
    this[stoppingKey] = true
    let failed = false
    try {
      // Old failed exit callbacks remain owned across an explicit restart, but
      // must never stand in for the restarted run's own teardown phases.
      while (this[pendingStopsKey].length > 0) {
        const pending = this[pendingStopsKey][0]
        if (pending.stateWork)
          this.executeActions(undefined, toEvent<TEvent>(ActionTypes.Stop), canContinueStop, pending.stateWork)
        this.executeActions(undefined, toEvent<TEvent>(ActionTypes.Stop), canContinueStop, pending.rootWork)
        if (pending.stateWork?.selecting || pending.stateWork?.running.size
          || pending.rootWork.selecting || pending.rootWork.running.size) {
          break
        }
        this[pendingStopsKey].shift()
      }

      // A nested stop may finish the pending teardown, but never replays exits
      // already executing or completed by the same synchronous stop attempt.
      if (phase.stateWork)
        this.executeActions(undefined, toEvent<TEvent>(ActionTypes.Stop), canContinueStop, phase.stateWork)
      const currentState = this.state.value!
      if (phase.cleanup === 0 && phase.stateExit !== currentState) {
        this.performExitEffects(currentState, toEvent<TEvent>(ActionTypes.Stop))
        phase.stateExit = currentState
      }
      this.executeActions(this.config.exit, toEvent<TEvent>(ActionTypes.Stop), canContinueStop, phase.rootWork)

      // Claim each observable step before invoking it. A synchronous callback
      // can finish the remaining steps without repeating the in-flight write.
      const cleanups = [
        () => { this.state.previousValue = this.state.value },
        () => { this.state.value = '' },
        () => { this.state.tags = [] },
        () => { this.state.previousEvent = this.state.event },
        () => { this.state.event = ref(toEvent<TEvent>(ActionTypes.Stop)) },
        this.stopStateListeners,
        this.stopChildren,
        this.stopActivities,
        this.stopDelayedEvents,
        this.stopContextWatchers,
      ]
      while (phase.cleanup < cleanups.length) {
        const index = phase.cleanup++
        try {
          cleanups[index]()
        }
        catch (error) {
          phase.cleanup = Math.min(phase.cleanup, index)
          throw error
        }
      }

      this.status = MachineStatus.Stopped
      return this
    }
    catch (error) {
      failed = true
      throw error
    }
    finally {
      this[lifecycleVersionKey]++
      if (ownsStop) {
        this[stoppingKey] = false
        if (!failed)
          this[stopPhaseKey] = undefined
      }
    }
  }

  private stopStateListeners = () => {
    this.removeStateListener()
    this.stateListeners.clear()
  }

  private stopContextWatchers = () => {
    this.contextWatchers.forEach(fn => fn())
    this.contextWatchers.clear()
  }

  private stopDelayedEvents = () => {
    this.delayedEvents.forEach((state) => {
      state.forEach(stop => stop())
    })
    this.delayedEvents.clear()
  }

  // Detach ownership before invoking user code. If teardown throws, retain the
  // failed and unattempted disposers so a later explicit stop can retry them.
  private stopActivities = (state?: TState['value']) => {
    const activities = state
      ? [[state, this.activityEvents.get(state)]] as const
      : Array.from(this.activityEvents.entries())
    for (const [value] of activities)
      this.activityEvents.delete(value)

    for (let index = 0; index < activities.length; index++) {
      const [, cleanups] = activities[index]
      if (!cleanups)
        continue
      try {
        for (const [key, callbacks] of cleanups) {
          while (callbacks.length > 0) {
            callbacks[0].cleanup()
            callbacks.shift()
          }
          cleanups.delete(key)
        }
      }
      catch (error) {
        for (const [pendingState, pending] of activities.slice(index)) {
          for (const [key, callbacks] of pending ?? []) {
            for (const cleanup of callbacks)
              this.addActivityCleanup(pendingState, key, cleanup.cleanup, true)
          }
        }
        throw error
      }
    }
  }

  /**
   * Function to send event to spawned child machine or actor
   */
  public sendChild = (evt: Event<AnyEventObject>, to: string | ((ctx: TContext) => string)) => {
    const event = toEvent(evt)
    const id = runIfFn(to, this.contextSnapshot)
    const child = this.children.get(id)
    if (!child) {
      throw new Error(`[@destyler/xstate] Cannot send '${event.type}' event to unknown child`)
    }
    child!.send(event)
  }

  /**
   * Function to stop a running child machine or actor
   */
  public stopChild = (id: string) => {
    if (!this.children.has(id)) {
      throw new Error(`[@destyler.xstate > stop-child] Cannot stop unknown child ${id}`)
    }
    const child = this.children.get(id)!
    child.stop()
    if (this.children.get(id) === child)
      this.children.delete(id)
  }

  public removeChild = (id: string) => {
    this.children.delete(id)
  }

  // Stop and delete spawned actors
  private stopChildren = () => {
    this.children.forEach(child => child.stop())
    this.children.clear()
  }

  private setParent = (parent: any) => {
    this.parent = parent
  }

  public spawn = <TContext extends Dict, TState extends StateSchema, TEvent extends EventObject = AnyEventObject>(
    src: MachineSrc<TContext, TState, TEvent>,
    id?: string,
  ) => {
    const actor = runIfFn(src)
    if (id)
      actor.id = id
    actor.type = MachineType.Actor
    actor.setParent(this)
    this.children.set(actor.id, cast(actor))

    actor
      .onDone(() => {
        if (this.children.get(actor.id) === cast<AnyMachine>(actor))
          this.removeChild(actor.id)
      })
      .start()

    return cast<typeof actor>(ref(actor))
  }

  private stopActivity = (key: string) => {
    if (!this.state.value)
      return
    const state = this.state.value
    const cleanups = this.activityEvents.get(state)
    const callbacks = cleanups?.get(key)
    cleanups?.delete(key)
    if (!callbacks)
      return
    try {
      while (callbacks.length > 0) {
        callbacks[0].cleanup()
        callbacks.shift()
      }
    }
    catch (error) {
      for (const cleanup of callbacks)
        this.addActivityCleanup(state, key, cleanup.cleanup, true)
      throw error
    }
  }

  private addActivityCleanup = (state: TState['value'] | null, key: string, cleanup: VoidFunction, retainExisting = false) => {
    if (!state)
      return
    if (!this.activityEvents.has(state)) {
      this.activityEvents.set(state, new Map([[key, [{ cleanup, retry: retainExisting }]]]))
    }
    else {
      const cleanups = this.activityEvents.get(state)!
      // Ordinary same-name registration retains its legacy replacement behavior.
      // Failed or unattempted cleanup still belongs to an earlier teardown and
      // cannot be overwritten when a later run acquires the same activity.
      const previous = cleanups.get(key) ?? []
      const existing = retainExisting ? previous : previous.filter(item => item.retry)
      existing.push({ cleanup, retry: retainExisting })
      cleanups.set(key, existing)
    }
  }

  private setState = (target: TState['value'] | null) => {
    const version = this[lifecycleVersionKey]
    this.state.previousValue = this.state.value
    if (version !== this[lifecycleVersionKey])
      return
    this.state.value = target
    if (version !== this[lifecycleVersionKey])
      return

    const stateNode = this.getStateNode(target)

    if (target == null) {
      // remove all tags
      clear(this.state.tags)
    }
    else {
      this.state.tags = toArray(stateNode?.tags)
    }
  }

  /**
   * To used within side effects for React or Vue to update context
   */
  public setContext = (context: Partial<Writable<TContext>> | undefined) => {
    if (!context)
      return
    deepMerge(this.state.context, context)
  }

  public setOptions = (options: Partial<MachineOptions<TContext, TState, TEvent>>) => {
    const opts = compact(options)
    this.actionMap = { ...this.actionMap, ...opts.actions }
    this.delayMap = { ...this.delayMap, ...opts.delays }
    this.activityMap = { ...this.activityMap, ...opts.activities }
    this.guardMap = { ...this.guardMap, ...opts.guards }
  }

  private getStateNode = (state: TState['value'] | null) => {
    if (!state)
      return
    return this.config.states?.[state]
  }

  private getNextStateInfo = (
    transitions: Transitions<TContext, TState, TEvent>,
    event: TEvent,
  ): StateInfo<TContext, TState, TEvent> => {
    // pick transition
    const transition = this.determineTransition(transitions, event)

    const isTargetless = !transition?.target
    const target = transition?.target ?? this.state.value
    const changed = this.state.value !== target

    const stateNode = this.getStateNode(target)
    const reenter = !isTargetless && !changed && !transition?.internal

    const info = {
      reenter,
      transition,
      stateNode,
      target: target!,
      changed,
    }

    this.log('NextState:', `[${event.type}]`, this.state.value, '---->', info.target)

    return info
  }

  private getAfterActions = (transition: Transitions<TContext, TState, TEvent>, delay?: number) => {
    let id: ReturnType<typeof globalThis.setTimeout>
    const current = this.state.value!
    return {
      entry: () => {
        id = globalThis.setTimeout(() => {
          const version = this[lifecycleVersionKey]
          const next = this.getNextStateInfo(transition, this.state.event)
          if (version !== this[lifecycleVersionKey])
            return
          this.performStateChangeEffects(current, next, this.state.event)
        }, delay)
      },
      exit: () => {
        globalThis.clearTimeout(id)
      },
    }
  }

  /**
   * All `after` events leverage `setTimeout` and `clearTimeout`,
   * we invoke the `clearTimeout` on exit and `setTimeout` on entry.
   *
   * To achieve this, we split the `after` definition into `entry` and `exit`
   *  functions and append them to the state's `entry` and `exit` actions
   */
  private getDelayedEventActions = (state: TState['value'], continueAfterStop?: () => boolean) => {
    const version = this[lifecycleVersionKey]
    const stateNode = this.getStateNode(state)
    const event = this.state.event

    if (!stateNode || !stateNode.after)
      return

    const entries: VoidFunction[] = []
    const exits: VoidFunction[] = []

    if (isArray(stateNode.after)) {
      //
      const transition = this.determineTransition(stateNode.after, event)

      if (!transition || (version !== this[lifecycleVersionKey] && !continueAfterStop?.()))
        return

      if (!hasProp(transition, 'delay')) {
        throw new Error(`[@destyler/xstate > after] Delay is required for after transition: ${JSON.stringify(transition)}`)
      }

      const determineDelay = determineDelayFn((transition as any).delay, this.delayMap)
      const __delay = determineDelay(this.contextSnapshot, event)
      if ((version !== this[lifecycleVersionKey] && !continueAfterStop?.()))
        return

      const actions = this.getAfterActions(transition, __delay)

      entries.push(actions.entry)
      exits.push(actions.exit)

      return { entries, exits }
    }

    if (isObject(stateNode.after)) {
      //
      for (const delay in stateNode.after) {
        const transition = stateNode.after[delay]

        const determineDelay = determineDelayFn(delay, this.delayMap)
        const __delay = determineDelay(this.contextSnapshot, event)
        if ((version !== this[lifecycleVersionKey] && !continueAfterStop?.()))
          return

        const actions = this.getAfterActions(transition, __delay)

        entries.push(actions.entry)
        exits.push(actions.exit)
      }
    }

    return { entries, exits }
  }

  /**
   * A reference to the instance methods of the machine.
   * Useful when spawning child machines and managing the communication between them.
   */
  private get self(): XSelf<TContext, TState, TEvent> {
    // eslint-disable-next-line ts/no-this-alias
    const self = this
    return {
      id: this.id,
      send: this.send.bind(this),
      sendParent: this.sendParent.bind(this),
      sendChild: this.sendChild.bind(this),
      stop: this.stop.bind(this),
      stopChild: this.stopChild.bind(this),
      spawn: this.spawn.bind(this) as any,
      stopActivity: this.stopActivity.bind(this),
      get state() {
        return self.stateSnapshot
      },
      get initialContext() {
        return self.initialContext
      },
      get initialState() {
        return self.initialState?.target ?? ''
      },
    }
  }

  private get meta(): Meta<TContext, TState, TEvent> {
    return {
      state: this.stateSnapshot,
      guards: this.guardMap,
      send: this.send.bind(this),
      self: this.self,
      initialContext: this.initialContext,
      initialState: this.initialState?.target ?? '',
      getState: () => this.stateSnapshot,
      getAction: key => this.actionMap[key],
      getGuard: key => this.guardMap[key],
    }
  }

  private get guardMeta(): GuardMeta<TContext, TState, TEvent> {
    return {
      state: this.stateSnapshot,
    }
  }

  /**
   * Function to executes defined actions. It can accept actions as string
   * (referencing `options.actions`) or actual functions.
   */
  private executeActions = (
    actions: Actions<TContext, TState, TEvent> | undefined,
    event: TEvent,
    continueAfterStop?: () => boolean,
    work?: ExitWork,
  ) => {
    if (work) {
      if (work.selecting)
        return
      if (!work.tasks) {
        work.selecting = true
        try {
          if (!work.prepare) {
            work.prepare = () => {
              const picked = determineActionsFn(actions, this.guardMap)(this.contextSnapshot, event, this.guardMeta)
              return toArray(picked).map(action => () => this.executeActions(action, event, continueAfterStop))
            }
          }
          work.tasks = work.prepare()
        }
        finally {
          work.selecting = false
        }
      }
      for (let index = 0; index < work.tasks.length; index++) {
        if (work.running.has(index) || work.completed.has(index))
          continue
        work.running.add(index)
        try {
          work.tasks[index]()
          work.completed.add(index)
        }
        finally {
          work.running.delete(index)
        }
      }
      return
    }
    let version = this[lifecycleVersionKey]
    const pickedActions = determineActionsFn(actions, this.guardMap)(this.contextSnapshot, event, this.guardMeta)
    if (version !== this[lifecycleVersionKey]) {
      if (!continueAfterStop?.())
        return
      version = this[lifecycleVersionKey]
    }
    for (const action of toArray(pickedActions)) {
      const fn = isString(action) ? this.actionMap?.[action] : action
      if (version !== this[lifecycleVersionKey]) {
        if (!continueAfterStop?.())
          return
        version = this[lifecycleVersionKey]
      }
      if (isString(action) && !fn) {
        console.warn(`[@destyler/xstate > execute-actions] No implementation found for action: \`${action}\``)
      }

      fn?.(this.state.context, event, this.meta)
      if (version !== this[lifecycleVersionKey]) {
        if (!continueAfterStop?.())
          return
        version = this[lifecycleVersionKey]
      }
    }
  }

  /**
   * Function to execute running activities and registers
   * their cleanup function internally (to be called later on when we exit the state)
   */
  private executeActivities = (
    event: TEvent,
    activities: Array<Activity<TContext, TState, TEvent>>,
    state?: TState['value'],
    continueAfterStop?: () => boolean,
  ) => {
    let version = this[lifecycleVersionKey]
    for (const activity of activities) {
      const fn = isString(activity) ? this.activityMap?.[activity] : activity
      if (version !== this[lifecycleVersionKey]) {
        if (!continueAfterStop?.())
          return
        version = this[lifecycleVersionKey]
      }

      if (!fn) {
        console.warn(`[@destyler/xstate > execute-activity] No implementation found for activity: \`${activity}\``)
        continue
      }

      const cleanup = fn(this.state.context, event, this.meta)
      if (version !== this[lifecycleVersionKey] && !continueAfterStop?.()) {
        try {
          cleanup?.()
        }
        catch (error) {
          if (cleanup) {
            const key = isString(activity) ? activity : activity.name || uuid()
            this.addActivityCleanup(state || ActionTypes.Start, key, cleanup, true)
          }
          throw error
        }
        return
      }

      version = this[lifecycleVersionKey]
      if (cleanup) {
        const key = isString(activity) ? activity : activity.name || uuid()
        this.addActivityCleanup(state ?? this.state.value, key, cleanup)
      }
    }
  }

  /**
   * Normalizes the `every` definition to transition. `every` can be:
   * - An array of possible actions to run (we need to pick the first match based on guard)
   * - An object of intervals and actions
   */
  private createEveryActivities = (
    every: StateNode<TContext, TState, TEvent>['every'] | undefined,
    callbackfn: (activity: Activity<TContext, TState, TEvent>) => void,
    continueAfterStop?: () => boolean,
  ) => {
    if (!every)
      return
    const version = this[lifecycleVersionKey]

    // every: [{ interval: 2000, actions: [...], guard: "isValid" },  { interval: 1000, actions: [...] }]
    if (isArray(every)) {
      // picked = { interval: string | number | <ref>, actions: [...], guard: ... }
      const picked = toArray(every).find((transition) => {
        if ((version !== this[lifecycleVersionKey] && !continueAfterStop?.()))
          return false
        const delayOrFn = transition.delay
        const determineDelay = determineDelayFn(delayOrFn, this.delayMap)
        const delay = determineDelay(this.contextSnapshot, this.state.event)
        if ((version !== this[lifecycleVersionKey] && !continueAfterStop?.()))
          return false

        const determineGuard = determineGuardFn(transition.guard, this.guardMap)
        const guard = determineGuard(this.contextSnapshot, this.state.event, this.guardMeta)

        return guard ?? delay != null
      })

      if (!picked || (version !== this[lifecycleVersionKey] && !continueAfterStop?.()))
        return

      const determineDelay = determineDelayFn(picked.delay, this.delayMap)
      const delay = determineDelay(this.contextSnapshot, this.state.event)
      if ((version !== this[lifecycleVersionKey] && !continueAfterStop?.()))
        return

      const activity = () => {
        const id = globalThis.setInterval(() => {
          this.executeActions(picked.actions, this.state.event)
        }, delay)
        return () => {
          globalThis.clearInterval(id)
        }
      }
      callbackfn(activity)
      //
    }
    else {
      // every = { 1000: [fn, fn] }
      for (const interval in every) {
        const actions = every?.[interval]

        // interval could be a `ref` not the actual interval value, let's determine the actual value
        const determineDelay = determineDelayFn(interval, this.delayMap)
        const delay = determineDelay(this.contextSnapshot, this.state.event)
        if ((version !== this[lifecycleVersionKey] && !continueAfterStop?.()))
          return

        // create the activity to run for each `every` reaction
        const activity = () => {
          const id = globalThis.setInterval(() => {
            this.executeActions(actions, this.state.event)
          }, delay)
          return () => {
            globalThis.clearInterval(id)
          }
        }
        callbackfn(activity)
      }
    }
  }

  private setEvent = (event: TEvent | TEvent['type']) => {
    const version = this[lifecycleVersionKey]
    this.state.previousEvent = this.state.event
    if (version !== this[lifecycleVersionKey])
      return
    this.state.event = ref(toEvent(event))
  }

  private performExitEffects = (current: TState['value'] | undefined, event: TEvent) => {
    const currentState = this.state.value!
    const version = this[lifecycleVersionKey]
    const runVersion = this[runVersionKey]
    const stopPhase = this[stopPhaseKey]
    const canContinueStop = () => runVersion === this[runVersionKey]
    const existing = this[exitingStateKey]

    if (currentState === '')
      return
    if (this[stoppingKey] && existing?.value === currentState && existing.version === version) {
      if (stopPhase)
        stopPhase.stateWork = existing.work
      this.executeActions(undefined, event, canContinueStop, existing.work)
      return
    }

    const previousExit = existing
    const work = createExitWork()
    try {
      const stateNode = current ? this.getStateNode(current) : undefined

      try {
        this.stopActivities(currentState)
      }
      catch (error) {
        if (stopPhase)
          stopPhase.cleanup = Math.min(stopPhase.cleanup, 7)
        throw error
      }
      if (version !== this[lifecycleVersionKey])
        return

      this[exitingStateKey] = { value: currentState, version, work }
      if (stopPhase) {
        stopPhase.stateWork = work
        stopPhase.stateExit = currentState
      }
      work.prepare = () => {
        const picked = determineActionsFn(stateNode?.exit, this.guardMap)(this.contextSnapshot, event, this.guardMeta)
        if (version !== this[lifecycleVersionKey] && !stopPhase)
          return []
        const exitActions = toArray(picked)
        const afterExitActions = this.delayedEvents.get(currentState)
        if (afterExitActions)
          exitActions.push(...afterExitActions)
        return exitActions.map(action => () => this.executeActions(action, event, canContinueStop))
      }
      this.executeActions(undefined, event, canContinueStop, work)
      if (version !== this[lifecycleVersionKey] && !stopPhase)
        return

      this.delayedEvents.delete(currentState)
    }
    finally {
      this[exitingStateKey] = previousExit
    }
  }

  private performEntryEffects = (next: TState['value'], event: TEvent) => {
    const version = this[lifecycleVersionKey]
    const stateNode = this.getStateNode(next)
    const runVersion = this[runVersionKey]
    const canCompleteAfterStop = () => stateNode?.type === 'final'
      && runVersion === this[runVersionKey]
      && this.status === MachineStatus.Stopped

    // execute activities for next state
    const activities = toArray(stateNode?.activities)

    // if `every` is defined, create an activity and append to activities
    this.createEveryActivities(stateNode?.every, (activity) => {
      activities.unshift(activity)
    }, canCompleteAfterStop)
    if (version !== this[lifecycleVersionKey] && !canCompleteAfterStop())
      return

    if (activities.length > 0) {
      this.executeActivities(event, activities, stateNode?.type === 'final' ? next : undefined, canCompleteAfterStop)
      if (version !== this[lifecycleVersionKey] && !canCompleteAfterStop())
        return
    }

    // get all entry actions
    const pickedActions = determineActionsFn(stateNode?.entry, this.guardMap)(
      this.contextSnapshot,
      event,
      this.guardMeta,
    )
    if (version !== this[lifecycleVersionKey] && !canCompleteAfterStop())
      return
    const entryActions = toArray(pickedActions)

    const afterActions = this.getDelayedEventActions(next, canCompleteAfterStop)
    if (version !== this[lifecycleVersionKey] && !canCompleteAfterStop())
      return

    if (stateNode?.after && afterActions) {
      this.delayedEvents.set(next, afterActions?.exits)
      entryActions.push(...afterActions.entries)
    }

    // execute entry actions for next state
    this.executeActions(entryActions, event, canCompleteAfterStop)
    if (version !== this[lifecycleVersionKey] && !canCompleteAfterStop())
      return

    if (stateNode?.type === 'final') {
      this.state.done = true
      if (runVersion !== this[runVersionKey])
        return
      for (const listener of this.doneListeners) {
        listener(this.stateSnapshot)
        if (runVersion !== this[runVersionKey])
          return
      }
      this.stop()
    }
  }

  private performTransitionEffects = (
    transitions: Transitions<TContext, TState, TEvent> | undefined,
    event: TEvent,
    continueAfterStop?: () => boolean,
  ) => {
    const version = this[lifecycleVersionKey]
    const transition = this.determineTransition(transitions, event)
    if (version !== this[lifecycleVersionKey] && !continueAfterStop?.())
      return
    this.executeActions(transition?.actions, event, continueAfterStop)
  }

  /**
   * Performs all the requires side-effects or reactions when
   * we move from state A => state B.
   *
   * The Effect order:
   * Exit actions (current state) => Transition actions  => Go to state => Entry actions (next state)
   */
  private performStateChangeEffects = (
    current: TState['value'] | undefined,
    next: StateInfo<TContext, TState, TEvent>,
    event: TEvent,
  ) => {
    const version = this[lifecycleVersionKey]
    const runVersion = this[runVersionKey]
    const canCompleteAfterStop = () => next.stateNode?.type === 'final'
      && runVersion === this[runVersionKey]
      && this.status === MachineStatus.Stopped
    // update event
    this.setEvent(event)
    if (version !== this[lifecycleVersionKey] && !canCompleteAfterStop())
      return

    const changed = next.changed || next.reenter

    if (changed) {
      this.performExitEffects(current, event)
      if (version !== this[lifecycleVersionKey] && !canCompleteAfterStop())
        return
    }

    // Preserve existing same-run final completion after a successful stop.
    // Toast relies on teardown preceding unmounted entry and onDone, including
    // copied configs and user-overridden removal actions. A restart or failed
    // stop never grants that continuation; non-final work is still cancelled.
    this.performTransitionEffects(next.transition, event, canCompleteAfterStop)
    if (version !== this[lifecycleVersionKey]) {
      if (!canCompleteAfterStop())
        return
      const completionVersion = this[lifecycleVersionKey]
      this.setState(next.target)
      if (completionVersion !== this[lifecycleVersionKey] && !canCompleteAfterStop())
        return
      this.performEntryEffects(next.target, event)
      return
    }

    // go to next state
    this.setState(next.target)
    if (version !== this[lifecycleVersionKey] && !canCompleteAfterStop())
      return

    if (changed) {
      this.performEntryEffects(next.target, event)
    }
  }

  private determineTransition = (transition: Transitions<TContext, TState, TEvent> | undefined, event: TEvent) => {
    const fn = determineTransitionFn(transition, this.guardMap)
    return fn?.(this.contextSnapshot, event, this.guardMeta)
  }

  /**
   * Function to send event to parent machine from spawned child
   */
  public sendParent = (evt: Event<AnyEventObject>) => {
    if (!this.parent) {
      throw new Error(
        '[@destyler/xstate > send-parent] Cannot send event to parent machine, no parent is set. Use `machine.spawn()` to spawn a child machine.',
      )
    }
    const event = toEvent<AnyEventObject>(evt)
    this.parent?.send(event)
  }

  private log = (...args: any[]) => {
    if (this.options.debug) {
      // eslint-disable-next-line no-console
      console.log(...args)
    }
  }

  /**
   * Function to send an event to current machine
   */
  public send = (evt: Event<TEvent>) => {
    const event = toEvent<TEvent>(evt)
    this.transition(this.state.value, event)
  }

  public transition = (state: TState['value'] | StateInfo<TContext, TState, TEvent> | null, evt: Event<TEvent>) => {
    if (this.status === MachineStatus.Stopped || this[stoppingKey]) {
      console.warn('[@destyler/xstate > transition] Cannot transition a stopped machine')
      return
    }

    const version = this[lifecycleVersionKey]
    const stateNode = isString(state) ? this.getStateNode(state) : state?.stateNode

    const event = toEvent(evt)

    if (!stateNode && !this.config.on) {
      const msg = `[destyler/xstate > transition] State does not have a definition for \`state\`: ${state}, \`event\`: ${event.type}`
      console.warn(msg)
      return
    }

    const transitions: Transitions<TContext, TState, TEvent>
      // @ts-expect-error - Fix this
      = stateNode?.on?.[event.type] ?? this.config.on?.[event.type]

    const next = this.getNextStateInfo(transitions, event)
    if (version !== this[lifecycleVersionKey])
      return
    this.performStateChangeEffects(this.state.value!, next, event)

    return next.stateNode
  }

  subscribe = (listener: StateListener<TContext, TState, TEvent>) => {
    this.stateListeners.add(listener)

    if (this.status === MachineStatus.Running) {
      listener(this.stateSnapshot)
    }

    return () => {
      this.stateListeners.delete(listener)
    }
  }

  public onDone = (listener: StateListener<TContext, TState, TEvent>) => {
    this.doneListeners.add(listener)
    return this
  }

  public onTransition = (listener: StateListener<TContext, TState, TEvent>) => {
    this.stateListeners.add(listener)
    if (this.status === MachineStatus.Running) {
      listener(this.stateSnapshot)
    }
    return this
  }

  get [Symbol.toStringTag]() {
    return 'Machine'
  }

  public getHydrationState(): StateInit<TContext, TState> {
    const state = this.getState()
    return {
      value: state.value,
      tags: state.tags,
    }
  }
}

export type MachineSrc<
  TContext extends Dict,
  TState extends StateSchema,
  TEvent extends EventObject = AnyEventObject,
> = Machine<TContext, TState, TEvent> | (() => Machine<TContext, TState, TEvent>)

export type AnyMachine = Machine<Dict, StateSchema, AnyEventObject>

export function createMachine<
  TContext extends Dict,
  TState extends StateSchema = StateSchema,
  TEvent extends EventObject = AnyEventObject,
>(config: MachineConfig<TContext, TState, TEvent>, options?: MachineOptions<TContext, TState, TEvent>) {
  return new Machine(config, options)
}

export function isMachine(value: any): value is AnyMachine {
  return value instanceof Machine || value?.type === MachineType.Machine
}
