import type { AnyEventObject, EventObject, HookOptions, Machine, StateInit, StateSchema, XState } from '@destyler/xstate'
import type { ReactiveController, ReactiveControllerHost } from 'lit'
import { snapshot, subscribe } from '@destyler/store'

/**
 * MachineController
 * - Manages a @destyler/xstate Machine lifecycle within a Lit component
 * - Mirrors React's useMachine ergonomics: exposes state, send, and service
 * - Triggers host.requestUpdate() when the machine state changes
 */
export class MachineController<
  TContext extends Record<string, any>,
  TState extends StateSchema,
  TEvent extends EventObject = AnyEventObject,
> implements ReactiveController {
  private host: ReactiveControllerHost
  public service: Machine<TContext, TState, TEvent>

  private unsubscribe?: () => void
  private _state!: XState<TContext, TState, TEvent>
  private options?: HookOptions<TContext, TState, TEvent>

  constructor(
    host: ReactiveControllerHost,
    machine: Machine<TContext, TState, TEvent> | (() => Machine<TContext, TState, TEvent>),
    options?: HookOptions<TContext, TState, TEvent>,
  ) {
    this.host = host
    this.host.addController(this)
    this.options = options

    const instance = typeof machine === 'function' ? machine() : machine

    // Apply initial context/options before created
    if (options?.context)
instance.setContext(options.context)
    if (options?.actions)
instance.setOptions({ actions: options.actions })

    // Run `created` lifecycle before start (aligns with React hook behavior)
    instance._created()

    this.service = instance
    this._state = this.service.getState()
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
    const stateInit: StateInit<TContext, TState> | undefined = this.options?.state

    // Subscribe to store updates; notify in sync if requested
    this.unsubscribe = subscribe(
      this.service.state,
      () => {
        this._state = snapshot(this.service.state)
        this.host.requestUpdate()
      },
      this.options?.sync,
    )

    // Start the machine last to ensure subscriptions are ready
    this.service.start(stateInit)
  }

  /** Stop service and cleanup when host is disconnected */
  hostDisconnected(): void {
    try {
      this.unsubscribe?.()
    }
    finally {
      this.unsubscribe = undefined
      this.service.stop()
    }
  }

  /**
   * Update controller options at runtime (actions/context). Safe to call anytime.
   */
  public setOptions(options: Partial<HookOptions<TContext, TState, TEvent>>) {
    this.options = { ...this.options, ...options }
    if (options?.actions)
this.service.setOptions({ actions: options.actions })
    if (options?.context)
this.service.setContext(options.context)
  }
}
