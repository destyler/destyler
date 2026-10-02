export interface PortalActionProps {
  disabled?: boolean
  container?: HTMLElement
  getRootNode?: () => ShadowRoot | Document | Node
}

export function portal(node: HTMLElement, props: PortalActionProps = {}) {
  const anchor = node.ownerDocument.createComment('portal')
  node.before(anchor)
  let destroyed = false
  let mountNode: HTMLElement | undefined

  function update(props: PortalActionProps = {}) {
    if (destroyed)
      return
    const { container, disabled, getRootNode } = props
    if (disabled) {
      if (mountNode && node.parentNode === mountNode) {
        if (anchor.parentNode)
          anchor.after(node)
        else
          node.remove()
      }
      mountNode = undefined
      return
    }
    const doc = getRootNode?.().ownerDocument ?? document
    const nextMountNode = container ?? doc.body
    nextMountNode.appendChild(node)
    mountNode = nextMountNode
  }

  try {
    update(props)
  }
  catch (error) {
    anchor.remove()
    throw error
  }

  return {
    destroy: () => {
      if (destroyed)
        return
      destroyed = true
      anchor.remove()
      node.remove()
    },
    update,
  }
}
