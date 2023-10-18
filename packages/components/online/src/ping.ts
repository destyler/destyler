/**
 * Creates a Ping instance.
 */
export default class Ping {
  opt: {
    favicon?: string
    timeout?: number
    logError?: boolean
  }

  wasSuccess: boolean = false
  img: HTMLImageElement = new Image()

  constructor(opt?: {
    favicon?: string
    timeout?: number
    logError?: boolean
  }) {
    this.opt = opt || {}
    this.opt.favicon = this.opt.favicon || '/favicon.ico'
    this.opt.timeout = this.opt.timeout || 0
    this.opt.logError = this.opt.logError || false
  }

  /**
   * Pings source and triggers a callback when completed.
   * @param {string} source Source of the website or server, including protocol and port.
   * @param {Function} callback Callback function to trigger when completed. Returns error and ping value.
   * @returns {Promise<number>|undefined} A promise that both resolves and rejects to the ping value. Or undefined if the browser does not support Promise.
   */
  ping(source: string, callback?: (error: string | null, pingValue: number) => void): Promise<number> | undefined {
    let promise: Promise<number> | undefined
    let resolve: (value?: number | PromiseLike<number>) => void
    let reject: (reason?: any) => void
    if (typeof Promise !== 'undefined') {
      promise = new Promise<number>((_resolve, _reject) => {
        // @ts-expect-error - TS complains about resolve and reject not being initialized
        resolve = _resolve
        reject = _reject
      })
    }

    this.wasSuccess = false
    this.img = new Image()
    this.img.onload = onload.bind(this)
    // @ts-expect-error - TS complains about resolve and reject not being initialized
    this.img.onerror = onerror.bind(this)

    let timer: number | undefined
    const start = new Date()

    /**
     * Times ping and triggers callback.
     */
    const pingCheck = function (this: Ping, e?: Event) {
      if (timer)
        window.clearTimeout(timer)

      const pong = new Date().getTime() - start.getTime()

      if (!callback) {
        if (promise)
          return this.wasSuccess ? resolve(pong) : reject(pong)

        else
          throw new Error('Promise is not supported by your browser. Use callback instead.')
      }
      else if (typeof callback === 'function') {
        // When operating in timeout mode, the timeout callback doesn't pass [event] as e.
        // Notice [this] instead of [self], since .call() was used with context
        if (!this.wasSuccess) {
          if (this.opt.logError)
            console.error('error loading resource')

          if (promise)
            reject(pong)

          return callback('error', pong)
        }
        if (promise)
          resolve(pong)

        return callback(null, pong)
      }
      else {
        throw new TypeError('Callback is not a function.')
      }
    }.bind(this)

    function onload(this: Ping, e: Event) {
      this.wasSuccess = true
      pingCheck.call(this, e)
    }

    function onerror(this: Ping, e: Event) {
      this.wasSuccess = false
      pingCheck.call(this, e)
    }

    if (this.opt.timeout) {
      timer = window.setTimeout(() => {
        pingCheck.call(this, undefined)
      }, this.opt.timeout)
    }

    // Trigger image load with cache buster
    this.img.src = `${source + this.opt.favicon}?${new Date().getTime()}`
    return promise
  }
}
