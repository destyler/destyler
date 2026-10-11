export interface PortalOptions {
  disabled?: boolean
  container?: HTMLElement
  getRootNode?: () => ShadowRoot | Document | Node
}

const cleanupKey = Symbol('portal.cleanup')

export class Portal {
  private [cleanupKey]: { cleanup?: () => void } | undefined
  private children: HTMLElement[] = []

  constructor(
    private elements: HTMLElement | HTMLElement[],
    private options: PortalOptions = {},
  ) {
    this.children = Array.isArray(this.elements) ? this.elements : [this.elements]
  }

  /** Repeated mounts share one cleanup until the current mount is released. */
  mount(): () => void {
    const activeCleanup = this[cleanupKey]?.cleanup
    if (activeCleanup)
      return activeCleanup
    const { container, disabled, getRootNode } = this.options

    const isServer = typeof window === 'undefined'
    if (isServer || disabled) {
      return () => {}
    }

    const root = getRootNode?.()
    const doc = root?.nodeType === 9 ? root as Document : root?.ownerDocument ?? document
    const mountNode = container ?? doc.body

    const origins = [...new Set(this.children)].map((child) => {
      const anchor = child.ownerDocument.createComment('portal')
      child.before(anchor)
      return { child, anchor, restored: false }
    })
    const owner: { cleanup?: () => void } = {}
    let cleanupStarted = false
    const cleanup = () => {
      if (!owner.cleanup)
        return
      cleanupStarted = true
      owner.cleanup = undefined
      try {
        for (const origin of origins) {
          const { child, anchor } = origin
          // A newer mount or an external move releases ownership of the node.
          if (!origin.restored && this[cleanupKey] === owner) {
            if (child.parentNode === mountNode) {
              if (anchor.parentNode)
                anchor.replaceWith(child)
              else
                child.remove()
            }
            origin.restored = true
          }
          anchor.remove()
        }
      }
      catch (error) {
        // Retain explicit retry without replacing a newer mount's owner.
        owner.cleanup = cleanup
        throw error
      }
    }
    owner.cleanup = cleanup
    this[cleanupKey] = owner
    try {
      for (const { child } of origins) {
        if (this[cleanupKey] !== owner || cleanupStarted)
          break
        mountNode.appendChild(child)
      }
    }
    catch (error) {
      if (!cleanupStarted)
        cleanup()
      throw error
    }
    return cleanup
  }

  /** Restore owned nodes without reclaiming externally moved or removed nodes. */
  unmount(): void {
    this[cleanupKey]?.cleanup?.()
  }
}

export function createPortal(
  elements: HTMLElement | HTMLElement[],
  options?: PortalOptions,
): Portal {
  return new Portal(elements, options)
}
