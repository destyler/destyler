export interface LiveRegionOptions {
  level: 'polite' | 'assertive'
  document?: Document | undefined
  root?: HTMLElement | null | undefined
  delay?: number | undefined
}

export type LiveRegion = ReturnType<typeof createLiveRegion>

const ID = '__live-region__'

export function createLiveRegion(opts: Partial<LiveRegionOptions> = {}) {
  const { level = 'polite', document: doc = document, root, delay: _delay = 0 } = opts

  const win = doc.defaultView ?? window
  const parent = root ?? doc.body
  let ownedRegion: HTMLSpanElement | undefined
  let timeoutId: number | undefined

  function announce(message: string, delay?: number) {
    destroy()
    const oldRegion = doc.getElementById(ID)

    // remove old region
    oldRegion?.remove()

    // Did an override level get set?
    delay = delay ?? _delay

    // create fresh region
    const region = doc.createElement('span')
    ownedRegion = region
    region.id = ID
    region.dataset.liveAnnouncer = 'true'

    // Determine redundant role
    const role = level !== 'assertive' ? 'status' : 'alert'

    // add role and attributes
    region.setAttribute('aria-live', level)
    region.setAttribute('role', role)

    // hide live region
    Object.assign(region.style, {
      border: '0',
      clip: 'rect(0 0 0 0)',
      height: '1px',
      margin: '-1px',
      overflow: 'hidden',
      padding: '0',
      position: 'absolute',
      width: '1px',
      whiteSpace: 'nowrap',
      wordWrap: 'normal',
    })

    parent.appendChild(region)

    // populate region to trigger it
    timeoutId = win.setTimeout(() => {
      region.textContent = message
      timeoutId = undefined
    }, delay)
  }

  function destroy() {
    if (timeoutId !== undefined) {
      win.clearTimeout(timeoutId)
      timeoutId = undefined
    }
    ownedRegion?.remove()
    ownedRegion = undefined
  }

  return {
    announce,
    destroy,
    toJSON() {
      return ID
    },
  }
}
