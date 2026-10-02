export interface PortalOptions {
  disabled?: boolean
  container?: HTMLElement
  getRootNode?: () => ShadowRoot | Document | Node
}

export class Portal {
  private cleanup: (() => void) | undefined
  private children: HTMLElement[] = []

  constructor(
    private elements: HTMLElement | HTMLElement[],
    private options: PortalOptions = {},
  ) {
    this.children = Array.isArray(elements) ? elements : [elements]
  }

  /** Repeated mounts share one cleanup until the current mount is released. */
  mount(): () => void {
    if (this.cleanup)
      return this.cleanup
    const { container, disabled, getRootNode } = this.options

    const isServer = typeof window === 'undefined'
    if (isServer || disabled) {
      return () => {}
    }

    const doc = getRootNode?.().ownerDocument ?? document
    const mountNode = container ?? doc.body

    const origins = [...new Set(this.children)].map((child) => {
      const anchor = child.ownerDocument.createComment('portal')
      child.before(anchor)
      return { child, anchor }
    })
    const cleanup = () => {
      if (this.cleanup !== cleanup)
        return
      this.cleanup = undefined
      for (const { child, anchor } of origins) {
        // A node moved elsewhere is no longer owned by this mount.
        if (child.parentNode === mountNode) {
          if (anchor.parentNode)
            anchor.replaceWith(child)
          else
            child.remove()
        }
        anchor.remove()
      }
    }
    this.cleanup = cleanup
    try {
      for (const { child } of origins) {
        if (this.cleanup !== cleanup)
          break
        mountNode.appendChild(child)
      }
    }
    catch (error) {
      cleanup()
      throw error
    }
    return cleanup
  }

  /** Restore owned nodes without reclaiming externally moved or removed nodes. */
  unmount(): void {
    this.cleanup?.()
  }
}

export function createPortal(
  elements: HTMLElement | HTMLElement[],
  options?: PortalOptions,
): Portal {
  return new Portal(elements, options)
}
