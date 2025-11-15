import { render as litRender, nothing } from 'lit'
import { AsyncDirective } from 'lit/async-directive.js'
import { directive } from 'lit/directive.js'

/**
 * The acceptable types used to specify a portal target.
 */
export type TargetOrSelector = Node | string
type TargetResolvable = TargetOrSelector | Promise<TargetOrSelector>

const canUseDOM = () => typeof window !== 'undefined' && typeof document !== 'undefined'

function createPortalId() {
  return typeof globalThis.crypto?.randomUUID === 'function'
    ? globalThis.crypto.randomUUID()
    : Math.random().toString(36).slice(2)
}

function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return typeof (value as any)?.then === 'function'
}

function isDocumentNode(value: unknown): value is Document {
  return typeof Document !== 'undefined' && value instanceof Document
}

function resolveDocument(root?: ShadowRoot | Document | Node | null): Document | null {
  if (!canUseDOM())
    return null
  if (!root)
    return document
  if (isDocumentNode(root))
    return root
  return (root as Node).ownerDocument ?? document
}

function getDefaultTargetNode(doc: Document | null, root?: ShadowRoot | Document | Node | null): Node | null {
  if (root && !isDocumentNode(root))
    return root
  if (!doc)
    return null
  return doc.body ?? doc.documentElement ?? null
}

function resolveTargetNode(targetOrSelector: TargetOrSelector, doc: Document): Node {
  if (typeof targetOrSelector === 'string') {
    const target = doc.querySelector(targetOrSelector)
    if (!target) {
      throw new Error(`Could not locate portal target with selector "${targetOrSelector}".`)
    }
    return target
  }
  return targetOrSelector
}

/**
 * @property placeholder - When provided, `placeholder` will be rendered while `content` promises are pending.
 * @property modifyContainer - Hook to customize the internally created container element (e.g. class names).
 * @property target - Explicit mount point for the portal. Accepts a node, selector, or promise.
 * @property container - Alias for {@link PortalOptions.target} for parity with other frameworks.
 * @property getRootNode - Function used to derive the document/root when no explicit target was provided.
 * @property disabled - When true (or when the DOM is unavailable) the directive renders inline without portaling.
 */
export interface PortalOptions {
  placeholder?: unknown
  modifyContainer?: (container: HTMLElement) => void
  target?: TargetResolvable
  container?: TargetResolvable
  getRootNode?: () => ShadowRoot | Document | Node
  disabled?: boolean
}

/**
 * A directive to render a Lit template somewhere in the DOM.
 *
 * See [Lit docs on Custom Directives](https://lit.dev/docs/templates/custom-directives/).
 */
export class PortalDirective extends AsyncDirective {
  private readonly containerId = `portal-${createPortalId()}`
  private container: HTMLElement | undefined
  private target: Node | undefined
  private renderToken = 0

  /**
   * Main render function for the directive.
   *
   * For clarity's sake, here is the outline of the function body::
   *
   * - Resolve `targetOrSelector` to an element.
   *
   * - If the directive's `container` property is `undefined`,
   *   - then create the container element and store it in the property.
   *
   * - If `modifyContainer` is provided in the `options`,
   *   - then call `modifyContainer(container)`.
   *
   * - If the target has changed from one element to another,
   *   - then migrate `container` to the new target and reassign the directive's `target` property.
   *
   * - If the directive's `target` property is `undefined`,
   *   - then store the target element in the property.
   *
   *   - If a `placeholder` is provided in the `options`,
   *     - then append `container` to `target` (if necessary) and render `placeholder` in `container`.
   *
   * - Resolve `content` (awaited).
   *
   * - Append `container` to `target` (if necessary) and render `content` in `container`.
   *
   * The steps are organized this way to balance the initalization and refreshing of crucial properties
   * like `container` and `target` while ensuring that `container` isn't added to the DOM until
   * the directive is about to render something (either `placeholder` or `content`).
   *
   * @param content - The content of the portal.
   * This parameter is passed as the `value` parameter in [Lit's `render` function](https://lit.dev/docs/api/templates/#render).
   *
   * The `content` parameter can be a promise, which will be rendered in the portal once it resolves.
   *
   * @param targetOrSelector - The "target" for the portal.
   * If the value is a string, then it is treated as a query selector and passed to `document.querySelector()` in order to locate the portal target.
   * If no element is found with the selector, then an error is thrown.
   *
   * @param options - See {@link PortalOptions}.
   *
   * @returns This function always returns Lit's [`nothing`](https://lit.dev/docs/api/templates/#nothing) value,
   * because nothing ever renders where the portal is used.
   */
  render(
    content: unknown | Promise<unknown>,
    targetOrSelector?: TargetResolvable,
    options?: PortalOptions,
  ) {
    const resolvedOptions = options ?? {}

    if (!canUseDOM() || resolvedOptions.disabled) {
      this.renderToken++
      this.reset(true)
      return this.getInlineValue(content, resolvedOptions.placeholder)
    }

    const explicitTarget = targetOrSelector ?? resolvedOptions.target ?? resolvedOptions.container
    const rootNode = resolvedOptions.getRootNode?.()
    const doc = resolveDocument(rootNode)
    const fallback = getDefaultTargetNode(doc, rootNode)

    const candidate = explicitTarget ?? fallback
    if (!candidate) {
      console.warn('[@destyler/lit > portal] No portal target available; nothing will render.')
      return nothing
    }

    const requestId = ++this.renderToken

    void Promise.resolve(candidate)
      .then(async (resolvedCandidate) => {
        if (requestId !== this.renderToken)
          return

        if (!resolvedCandidate) {
          console.warn('[@destyler/lit > portal] Resolved portal target was nullish; skipping render.')
          return
        }

        const resolvedDoc = typeof resolvedCandidate === 'string'
          ? doc
          : isDocumentNode(resolvedCandidate)
            ? resolvedCandidate
            : (resolvedCandidate as Node).ownerDocument ?? doc

        if (!resolvedDoc) {
          console.warn('[@destyler/lit > portal] Unable to determine document for portal target.')
          return
        }

        let targetNode: Node
        try {
          targetNode
            = typeof resolvedCandidate === 'string'
              ? resolveTargetNode(resolvedCandidate, resolvedDoc)
              : resolvedCandidate
        }
        catch (error) {
          console.error(error)
          return
        }

        this.ensureContainer(resolvedDoc, resolvedOptions)
        this.updateTarget(targetNode)

        if (this.shouldShowPlaceholder(content, resolvedOptions.placeholder)) {
          this.renderPlaceholder(resolvedOptions.placeholder)
        }

        await this.renderContent(content, requestId)
      })
      .catch((error) => {
        console.error('[@destyler/lit > portal] Failed to resolve portal target', error)
      })

    return nothing
  }

  /** Remove container from target when the directive is disconnected. */
  protected disconnected(): void {
    this.renderToken++
    this.detachContainer(false)
  }

  /** Append container to target when the directive is reconnected. */
  protected reconnected(): void {
    this.appendContainer()
  }

  private ensureContainer(doc: Document, options?: PortalOptions) {
    if (this.container && this.container.ownerDocument === doc)
      return
    this.detachContainer(true)
    const newContainer = doc.createElement('div')
    newContainer.id = this.containerId
    options?.modifyContainer?.(newContainer)
    this.container = newContainer
  }

  private updateTarget(target: Node) {
    if (this.container && this.target && this.target !== target && this.target.contains(this.container)) {
      this.target.removeChild(this.container)
    }
    this.target = target
  }

  private appendContainer() {
    if (this.container && this.target && !this.target.contains(this.container)) {
      this.target.appendChild(this.container)
    }
  }

  private renderPlaceholder(placeholder: unknown) {
    if (!this.container)
      return
    this.appendContainer()
    litRender(placeholder as any, this.container)
  }

  private async renderContent(content: unknown | Promise<unknown>, requestId: number) {
    try {
      const resolvedContent = await Promise.resolve(content)
      if (requestId !== this.renderToken)
        return
      if (!this.container) {
        console.warn('[@destyler/lit > portal] Portal container was missing during render.')
        return
      }
      this.appendContainer()
      litRender(resolvedContent as any, this.container)
    }
    catch (error) {
      console.error('[@destyler/lit > portal] Error rendering portal content', error)
    }
  }

  private shouldShowPlaceholder(content: unknown, placeholder?: unknown) {
    return placeholder !== undefined && isPromiseLike(content)
  }

  private getInlineValue(content: unknown, placeholder?: unknown) {
    if (isPromiseLike(content))
      return placeholder ?? nothing
    return content ?? placeholder ?? nothing
  }

  private detachContainer(clearAll: boolean) {
    if (this.container && this.target && this.target.contains(this.container)) {
      this.target.removeChild(this.container)
    }
    if (clearAll) {
      this.container = undefined
      this.target = undefined
    }
  }

  private reset(clearAll: boolean) {
    this.detachContainer(clearAll)
  }
}

/**
 * To be used in Lit templates.
 *
 * See {@link PortalDirective.render | PortalDirective.render}
 */
export const portal = directive(PortalDirective)
