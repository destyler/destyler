export interface Attrs {
  [key: string]: any
}

const prevAttrsMap = new WeakMap<HTMLElement, Attrs>()

export function spreadProps(node: HTMLElement, attrs: Attrs): () => void {
  const oldAttrs = prevAttrsMap.get(node) || {}
  const cleanupFunctions: (() => void)[] = []

  const attrKeys = Object.keys(attrs)

  const addEvt = (e: string, f: EventListener) => {
    node.addEventListener(e.toLowerCase(), f)
    cleanupFunctions.push(() => node.removeEventListener(e.toLowerCase(), f))
  }

  const remEvt = (e: string, f: EventListener) => {
    node.removeEventListener(e.toLowerCase(), f)
  }

  const onEvents = (attr: string) => attr.startsWith('on')
  const others = (attr: string) => !attr.startsWith('on')

  const setup = (attr: string) => addEvt(attr.substring(2), attrs[attr])

  const apply = (attrName: string) => {
    let value = attrs[attrName]

    const oldValue = oldAttrs[attrName]
    if (value === oldValue)
      return

    if (typeof value === 'boolean') {
      value = value || undefined
    }

    if (value != null) {
      if (['value', 'checked', 'htmlFor'].includes(attrName)) {
        ;(node as any)[attrName] = value
      }
      else {
        node.setAttribute(attrName.toLowerCase(), value)
      }
      return
    }

    node.removeAttribute(attrName.toLowerCase())
  }

  // 清理旧属性
  for (const key in oldAttrs) {
    if (attrs[key] == null) {
      node.removeAttribute(key.toLowerCase())
    }
  }

  // 清理旧事件监听器
  const oldEvents = Object.keys(oldAttrs).filter(onEvents)
  oldEvents.forEach((evt) => {
    remEvt(evt.substring(2), oldAttrs[evt])
  })

  // 设置新事件监听器和属性
  attrKeys.filter(onEvents).forEach(setup)
  attrKeys.filter(others).forEach(apply)

  prevAttrsMap.set(node, attrs)

  return function cleanup() {
    cleanupFunctions.forEach(fn => fn())
  }
}
