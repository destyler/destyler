import type {
  AnyEventObject,
  EventObject,
  HookOptions,
  Machine,
  StateSchema,
  UserContext,
  XState,
} from '@destyler/xstate'
import { hydrateSpreadProps } from './spread-props'

export interface ContextSource<TContext> {
  get?: () => Partial<TContext> | undefined
  subscribe: (fn: (ctx: Partial<TContext>) => void) => () => void
}

export type ComponentOptions<
  TUserContext extends Record<string, any>,
  TMachineContext extends Record<string, any>,
  TState extends StateSchema,
  TEvent extends EventObject,
> = Omit<HookOptions<TMachineContext, TState, TEvent>, 'context'> & {
  context?: UserContext<TUserContext> | ContextSource<TUserContext>
}

function isContextSource<T>(value: any): value is ContextSource<T> {
  return value && typeof value === 'object' && typeof value.subscribe === 'function'
}

export abstract class Component<
  TUserContext extends Record<string, any>,
  TApi,
  TMachineContext extends Record<string, any> = TUserContext,
  TState extends StateSchema = any,
  TEvent extends EventObject = AnyEventObject,
> {
  protected service!: Machine<TMachineContext, TState, TEvent>
  protected api!: TApi
  protected options?: ComponentOptions<TUserContext, TMachineContext, TState, TEvent>

  private unsubscribe?: () => void
  private contextUnsubscribe?: () => void
  private initialized = false

  constructor(
    protected rootEl: HTMLElement,
    protected context: TUserContext,
    options?: ComponentOptions<TUserContext, TMachineContext, TState, TEvent>,
  ) {
    this.options = options
  }

  /**
   * Initialize the machine, subscribe to updates, and trigger the first render.
   */
  init(): void {
    if (this.initialized)
      return
    this.initialized = true

    this.service = this.initService(this.context)

    if (this.options?.actions) {
      this.service.setOptions({ actions: this.options.actions })
    }

    if (this.options?.context) {
      this.applyContextOption(this.options.context)
    }

    this.service._created()
    this.service.start(this.options?.state)

    this.updateApi()
    this.performRender()

    this.unsubscribe = this.service.subscribe((state) => {
      this.updateApi()
      this.onTransition(state)
      this.performRender()
    })
  }

  destroy(): void {
    this.unsubscribe?.()
    this.contextUnsubscribe?.()
    this.service?.stop()
    this.initialized = false
  }

  /**
   * Allows subclasses to react to state changes before render.
   */
  // eslint-disable-next-line ts/no-empty-function
  protected onTransition(_state: XState<TContext, TState, TEvent>): void {}

  protected abstract initService(context: TUserContext): Machine<TMachineContext, TState, TEvent>
  protected abstract initApi(): TApi
  protected abstract render(): void

  protected updateApi(): void {
    this.api = this.initApi()
  }

  protected applyContext(context: Partial<TUserContext>): void {
    this.service?.setContext(context as Partial<TMachineContext>)
  }

  setOptions(options: Partial<ComponentOptions<TUserContext, TMachineContext, TState, TEvent>>): void {
    this.options = { ...this.options, ...options }

    if (options.actions) {
      this.service?.setOptions({ actions: options.actions })
    }

    if (options.context) {
      this.applyContextOption(options.context)
    }
  }

  get state(): XState<TMachineContext, TState, TEvent> | undefined {
    return this.service?.getState()
  }

  get send() {
    return this.service?.send
  }

  private applyContextOption(context: UserContext<TUserContext> | ContextSource<TUserContext>) {
    this.contextUnsubscribe?.()
    this.contextUnsubscribe = undefined

    if (isContextSource<TUserContext>(context)) {
      const initial = context.get?.()
      if (initial)
        this.service.setContext(initial as Partial<TMachineContext>)
      this.contextUnsubscribe = context.subscribe((ctx) => {
        this.service.setContext(ctx as Partial<TMachineContext>)
        this.updateApi()
        this.performRender()
      })
    }
    else {
      this.service.setContext(context as Partial<TMachineContext>)
    }
  }

  private performRender(): void {
    this.render()
    hydrateSpreadProps(this.rootEl)
  }
}
