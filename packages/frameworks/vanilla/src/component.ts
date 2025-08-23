import type { Machine } from '@destyler/xstate'

interface ComponentInterface<Api> {
  rootEl: HTMLElement
  service: ReturnType<any>
  api: Api

  init: () => void
  destroy: () => void
  render: () => void
  updateContext: (context: any) => void
}

export abstract class Component<Context, Api> implements ComponentInterface<Api> {
  rootEl: HTMLElement
  service: ReturnType<any>
  api: Api
  private currentContext: Context
  protected cleanupFunctions: (() => void)[] = []
  private isInitialized = false

  constructor(rootEl: HTMLElement | null, context: Context) {
    if (!rootEl)
      throw new Error('Root element not found')
    this.rootEl = rootEl
    this.currentContext = context
    this.service = this.initService(context)
    this.api = this.initApi()
  }

  abstract initService(context: Context): Machine<any, any, any>
  abstract initApi(): Api

  protected addCleanup(cleanup: () => void) {
    this.cleanupFunctions.push(cleanup)
  }

  updateContext = (newContext: Context) => {
    if (this.currentContext === newContext)
      return

    this.currentContext = newContext
    this._cleanup()
    this.service = this.initService(newContext)
    this.api = this.initApi()
    this.init()
  }

  init = () => {
    if (this.isInitialized) {
      this._cleanup()
    }

    this.render()

    const unsubscribe = this.service.subscribe(() => {
      this.api = this.initApi()
      this.render()
    })

    this.addCleanup(unsubscribe)
    this.service.start()
    this.isInitialized = true
  }

  private _cleanup = () => {
    this.cleanupFunctions.forEach(cleanup => cleanup())
    this.cleanupFunctions = []
  }

  destroy = () => {
    this._cleanup()
    this.service.stop()
    this.isInitialized = false
  }

  abstract render(): void
}
