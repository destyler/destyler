export interface PortalOptions {
  disabled?: boolean
  container?: HTMLElement
  getRootNode?: () => ShadowRoot | Document | Node
}

export class Portal {
  private originalParent: HTMLElement | null = null
  private children: HTMLElement[] = []

  constructor(
    private elements: HTMLElement | HTMLElement[],
    private options: PortalOptions = {},
  ) {
    this.children = Array.isArray(elements) ? elements : [elements]
  }

  mount(): () => void {
    const { container, disabled, getRootNode } = this.options

    const isServer = typeof window === 'undefined'
    if (isServer || disabled) {
      return () => {}
    }

    // 保存原始父节点
    if (this.children.length > 0) {
      this.originalParent = this.children[0].parentElement
    }

    const doc = getRootNode?.().ownerDocument ?? document
    const mountNode = container ?? doc.body

    // 移动元素到目标容器
    this.children.forEach((child) => {
      mountNode.appendChild(child)
    })

    return () => this.unmount()
  }

  unmount(): void {
    if (this.originalParent) {
      this.children.forEach((child) => {
        if (child.parentElement) {
          this.originalParent?.appendChild(child)
        }
      })
    }
 else {
      // 如果没有原始父节点，从 DOM 中移除
      this.children.forEach((child) => {
        child.remove()
      })
    }
  }
}

export function createPortal(
  elements: HTMLElement | HTMLElement[],
  options?: PortalOptions,
): Portal {
  return new Portal(elements, options)
}
