import type { AnyEventObject, EventObject, HookOptions, Machine, StateInit, StateSchema, UserContext, XState } from '@destyler/xstate'
import type { ReactiveController, ReactiveControllerHost } from 'lit'
import { snapshot, subscribe } from '@destyler/store'
import { MachineStatus } from '@destyler/xstate'

/**
 * MachineController
 * - Manages a @destyler/xstate Machine lifecycle within a Lit component
 * - Mirrors React's useMachine ergonomics: exposes state, send, and service
 * - Triggers host.requestUpdate() when the machine state changes
 */
export interface ContextSource<TContext> {
  get?: () => Partial<TContext> | undefined
  subscribe: (fn: (ctx: Partial<TContext>) => void) => () => void
}

type OptionsEx<TContext extends Record<string, any>, TState extends StateSchema, TEvent extends EventObject>
  = Omit<HookOptions<TContext, TState, TEvent>, 'context'> & {
    context?: UserContext<TContext> | ContextSource<TContext>
  }

function isContextSource<T>(value: unknown): value is ContextSource<T> {
  return !!value && typeof value === 'object' && 'subscribe' in (value as any)
}

interface Connection {
  unsubscribe?: () => void
  contextUnsub?: () => void
  disconnected: boolean
}

const connectedKey = Symbol('machine-controller.connected')
const contextOwnerKey = Symbol('machine-controller.context-owner')
const interruptedStartKey = Symbol('machine-controller.interrupted-start')
const refreshContextKey = Symbol('machine-controller.refresh-context')
const stopServiceKey = Symbol('machine-controller.stop-service')
const stopOwnerKey = Symbol('machine-controller.stop-owner')

export class MachineController<
  TContext extends Record<string, any>,
  TState extends StateSchema,
  TEvent extends EventObject = AnyEventObject,
> implements ReactiveController {
  private host: ReactiveControllerHost
  public service: Machine<TContext, TState, TEvent>

  private _state!: XState<TContext, TState, TEvent>
  private options?: OptionsEx<TContext, TState, TEvent>
  private [connectedKey]?: Connection
  private [contextOwnerKey] = Symbol('initial-context')
  private [interruptedStartKey] = false
  private [stopOwnerKey]?: symbol

  constructor(
    host: ReactiveControllerHost,
    machine: Machine<TContext, TState, TEvent> | (() => Machine<TContext, TState, TEvent>),
    options?: OptionsEx<TContext, TState, TEvent>,
  ) {
    this.host = host
    this.options = options

    const instance = typeof machine === 'function' ? machine() : machine

    // Apply initial context/options before created
    if (options?.context) {
      if (isContextSource<TContext>(options.context)) {
        const initial = options.context.get?.()
        if (initial)
          instance.setContext(initial)
      }
      else {
        instance.setContext(options.context as UserContext<TContext>)
      }
    }

    // Ensure DOM queries inside machines (via createScope) work with Lit's shadowRoot.
    // We only set this if the user hasn't provided a custom getRootNode.
    const ctxWithRoot = instance.getState().context as Record<string, any>
    if (ctxWithRoot && typeof ctxWithRoot.getRootNode !== 'function') {
      // Prefer Lit host's renderRoot/shadowRoot, fall back to host.getRootNode(), then document.
      instance.setContext({
        getRootNode: () => (
          (this.host as any)?.renderRoot
          ?? (typeof (this.host as any)?.getRootNode === 'function'
            ? (this.host as any).getRootNode()
            : undefined)
          ?? document
        ),
      } as unknown as UserContext<TContext>)
    }
    if (options?.actions) {
      instance.setOptions({ actions: options.actions })
    }

    // Run `created` lifecycle before start (aligns with React hook behavior)
    instance._created()

    this.service = instance
    this._state = this.service.getState()
    // An already connected Lit host invokes hostConnected synchronously here.
    this.host.addController(this)
  }

  /** Current immutable state snapshot */
  get state(): XState<TContext, TState, TEvent> {
    return this._state
  }

  /** Send function passthrough */
  get send() {
    return this.service.send
  }

  /** Start service and subscribe to state changes when host is connected */
  hostConnected(): void {
    if (this[connectedKey])
      return
    const connection: Connection = { disconnected: false }
    this[connectedKey] = connection
    this[interruptedStartKey] = false
    const stateInit: StateInit<TContext, TState> | undefined = this.options?.state

    const unsubscribe = subscribe(
      this.service.state,
      () => {
        if (this[connectedKey] !== connection)
          return
        this._state = snapshot(this.service.state)
        this.host.requestUpdate()
      },
      this.options?.sync,
    )
    if (this[connectedKey] !== connection) {
      unsubscribe()
      return
    }
    connection.unsubscribe = unsubscribe

    this[refreshContextKey](connection, false)
    if (this[connectedKey] !== connection)
      return

    try {
      this.service.start(stateInit)
    }
    finally {
      // A synchronous core start can continue after a callback disconnects it.
      // Preserve the existing ability to explicitly stop that resumed run.
      if (connection.disconnected && !this[connectedKey])
        this[interruptedStartKey] = true
    }
  }

  /** Stop service and cleanup when host is disconnected */
  hostDisconnected(): void {
    const connection = this[connectedKey]
    if (!connection) {
      if (this[interruptedStartKey])
        this[stopServiceKey]()
      return
    }
    this[connectedKey] = undefined
    this[contextOwnerKey] = Symbol('disconnected-context')
    connection.disconnected = true
    const { unsubscribe, contextUnsub } = connection
    connection.unsubscribe = undefined
    connection.contextUnsub = undefined
    try {
      unsubscribe?.()
    }
    finally {
      try {
        contextUnsub?.()
      }
      finally {
        // Cleanup callbacks may have connected a new owner already.
        if (!this[connectedKey])
          this[stopServiceKey]()
      }
    }
  }

  private [stopServiceKey]() {
    const owner = Symbol('stop-owner')
    this[stopOwnerKey] = owner
    this[interruptedStartKey] = false
    try {
      this.service.stop()
      if (!this[connectedKey] && this.service.status === MachineStatus.Stopped)
        this[interruptedStartKey] = false
    }
    catch (error) {
      if (this[stopOwnerKey] === owner && !this[connectedKey] && this.service.status !== MachineStatus.Stopped)
        this[interruptedStartKey] = true
      throw error
    }
  }

  private [refreshContextKey](connection = this[connectedKey], applyPlainContext = true) {
    const previousOwner = this[contextOwnerKey]
    const owner = Symbol('context-owner')
    this[contextOwnerKey] = owner
    const isCurrent = () => this[connectedKey] === connection && this[contextOwnerKey] === owner
    const previousUnsubscribe = connection?.contextUnsub
    if (connection)
      connection.contextUnsub = undefined
    try {
      previousUnsubscribe?.()
    }
    catch (error) {
      if (isCurrent() && connection) {
        connection.contextUnsub = previousUnsubscribe
        this[contextOwnerKey] = previousOwner
      }
      throw error
    }
    if (!isCurrent())
      return

    const context = this.options?.context
    if (!isCurrent())
      return
    if (isContextSource<TContext>(context)) {
      const initial = context.get?.()
      if (!isCurrent())
        return
      if (initial)
        this.service.setContext(initial)
      if (!isCurrent() || !connection)
        return
      const unsubscribe = context.subscribe((ctx) => {
        if (!isCurrent())
          return
        this.service.setContext(ctx)
        if (isCurrent())
          this.host.requestUpdate()
      })
      if (isCurrent())
        connection.contextUnsub = unsubscribe
      else
        unsubscribe()
    }
    else if (applyPlainContext && context) {
      this.service.setContext(context as UserContext<TContext>)
    }
  }

  /**
   * Update controller options at runtime (actions/context). Safe to call anytime.
   */
  public setOptions(options: Partial<OptionsEx<TContext, TState, TEvent>>) {
    this.options = { ...this.options, ...options }
    if (options?.actions) {
      this.service.setOptions({ actions: options.actions })
    }
    if ('context' in options)
      this[refreshContextKey]()
  }
}
