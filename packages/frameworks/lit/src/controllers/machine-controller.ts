import type { AnyEventObject, EventObject, HookOptions, Machine, StateInit, StateSchema, UserContext, XState } from '@destyler/xstate'
import type { ReactiveController, ReactiveControllerHost } from 'lit'
import { snapshot, subscribe } from '@destyler/store'

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

export class MachineController<
  TContext extends Record<string, any>,
  TState extends StateSchema,
  TEvent extends EventObject = AnyEventObject,
> implements ReactiveController {
  private host: ReactiveControllerHost
  public service: Machine<TContext, TState, TEvent>

  private unsubscribe?: () => void
  private _state!: XState<TContext, TState, TEvent>
  private options?: OptionsEx<TContext, TState, TEvent>
  private contextUnsub?: () => void

  constructor(
    host: ReactiveControllerHost,
    machine: Machine<TContext, TState, TEvent> | (() => Machine<TContext, TState, TEvent>),
    options?: OptionsEx<TContext, TState, TEvent>,
  ) {
    this.host = host
    this.host.addController(this)
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

    // external context subscription
    if (this.options?.context && isContextSource<TContext>(this.options.context)) {
      this.contextUnsub = this.options.context.subscribe((ctx) => {
        this.service.setContext(ctx)
        this.host.requestUpdate()
      })
    }

    // Start the machine last to ensure subscriptions are ready
    this.service.start(stateInit)
  }

  /** Stop service and cleanup when host is disconnected */
  hostDisconnected(): void {
    try {
      this.unsubscribe?.()
      this.contextUnsub?.()
    }
    finally {
      this.unsubscribe = undefined
      this.contextUnsub = undefined
      this.service.stop()
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
    if (options?.context) {
      // swap subscriptions if necessary
      this.contextUnsub?.()
      this.contextUnsub = undefined
      if (isContextSource<TContext>(options.context)) {
        const initial = options.context.get?.()
        if (initial)
          this.service.setContext(initial)
        this.contextUnsub = options.context.subscribe((ctx) => {
          this.service.setContext(ctx)
          this.host.requestUpdate()
        })
      }
      else {
        this.service.setContext(options.context as UserContext<TContext>)
      }
    }
  }
}
