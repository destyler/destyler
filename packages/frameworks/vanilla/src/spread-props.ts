import { toStyleString } from './utils/style'

export interface SpreadAttributes {
  [key: string]: any
}

interface EventInfo {
  name: string
  options?: AddEventListenerOptions
  handler: EventListenerOrEventListenerObject
}

interface ElementState {
  props: Record<string, any>
  events: Map<string, EventInfo>
}

const SPREAD_ATTRIBUTE = 'data-destyler-spread'

const spreadState = new WeakMap<Element, ElementState>()
const pendingPropSets = new Map<string, SpreadAttributes>()

const booleanAttributes = new Set([
  'checked',
  'disabled',
  'hidden',
  'readonly',
  'required',
  'selected',
  'multiple',
  'open',
  'autoplay',
  'controls',
  'default',
  'inert',
])

const propertyNameMap: Record<string, string> = {
  readonly: 'readOnly',
}

let spreadUid = 0

function isElement(value: unknown): value is Element {
  return typeof Element !== 'undefined' && value instanceof Element
}

function getPendingId(props: SpreadAttributes | null | undefined) {
  spreadUid = (spreadUid + 1) % Number.MAX_SAFE_INTEGER
  const id = `sp-${spreadUid}`
  pendingPropSets.set(id, props ?? {})
  return id
}

function applyPropsToElement<T extends Element>(element: T | null | undefined, props?: SpreadAttributes | null) {
  if (!element)
    return element
  const nextProps = props ?? {}
  const state: ElementState = spreadState.get(element) ?? { props: {}, events: new Map() }

  for (const key of Object.keys(state.props)) {
    if (!(key in nextProps)) {
      removeProp(element, key, state)
      delete state.props[key]
    }
  }

  for (const [key, value] of Object.entries(nextProps)) {
    if (state.props[key] === value && !key.startsWith('on'))
      continue
    applyProp(element, key, value, state)
    state.props[key] = value
  }

  spreadState.set(element, state)
  return element
}

export function spreadProps<T extends Element>(element: T, props?: SpreadAttributes | null): T
export function spreadProps(element: null | undefined, props?: SpreadAttributes | null): null | undefined
export function spreadProps(props?: SpreadAttributes | null): string
export function spreadProps(
  elementOrProps?: Element | SpreadAttributes | null,
  maybeProps?: SpreadAttributes | null,
): Element | string | null | undefined {
  if (isElement(elementOrProps)) {
    return applyPropsToElement(elementOrProps, maybeProps)
  }

  if (elementOrProps == null) {
    return applyPropsToElement(elementOrProps, maybeProps)
  }

  const id = getPendingId(elementOrProps)
  return `${SPREAD_ATTRIBUTE}="${id}"`
}

export function hydrateSpreadProps(root?: ParentNode | null) {
  if (typeof document === 'undefined')
    return

  const scope = root ?? document
  const selector = `[${SPREAD_ATTRIBUTE}]`
  const elements = scope.querySelectorAll<Element>(selector)

  elements.forEach((element) => {
    const id = element.getAttribute(SPREAD_ATTRIBUTE)
    if (!id)
      return
    const props = pendingPropSets.get(id)
    pendingPropSets.delete(id)
    element.removeAttribute(SPREAD_ATTRIBUTE)
    applyPropsToElement(element, props)
  })
}

function applyProp(element: Element, key: string, value: any, state: ElementState) {
  if (key === 'children' || key === 'dangerouslySetInnerHTML')
    return

  if (key === 'value' && element instanceof HTMLInputElement) {
    if (element.value === String(value)) {
      return
    }
  }

  if (key === 'style') {
    if (typeof value === 'string') {
      element.setAttribute('style', value)
    }
    else if (value && typeof value === 'object') {
      const styleString = toStyleString(value)
      if (styleString)
        element.setAttribute('style', styleString)
      else
        element.removeAttribute('style')
    }
    else {
      element.removeAttribute('style')
    }
    return
  }

  if (key === 'ref' && typeof value === 'function') {
    value(element)
    return
  }

  if (key.startsWith('on') && typeof value === 'function') {
    updateEventListener(element, key, value, state)
    return
  }

  if (key === 'textcontent') {
    element.textContent = value ?? ''
    return
  }

  if (key === 'innerhtml') {
    element.innerHTML = value ?? ''
    return
  }

  if (booleanAttributes.has(key)) {
    if (value) {
      element.setAttribute(key, '')
      setProperty(element, key, true)
    }
    else {
      element.removeAttribute(key)
      setProperty(element, key, false)
    }
    return
  }

  if (value === false || value === null || value === undefined) {
    element.removeAttribute(key)
    setProperty(element, key, undefined)
    return
  }

  if (typeof value === 'object') {
    element.removeAttribute(key)
    setProperty(element, key, value)
    return
  }

  const attrValue = typeof value === 'string' ? value : String(value)

  if (key in (element as any)) {
    setProperty(element, key, attrValue)
  }
  else {
    element.setAttribute(key, attrValue)
  }
}

function removeProp(element: Element, key: string, state: ElementState) {
  if (key.startsWith('on')) {
    removeEventListener(element, key, state)
    return
  }
  if (key === 'style' || key === 'class' || key === 'textcontent' || key === 'innerhtml') {
    element.removeAttribute(key)
    return
  }
  element.removeAttribute(key)
  setProperty(element, key, undefined)
}

function getEventName(key: string) {
  let event = key.slice(2) // remove "on"
  let capture = false
  if (event.endsWith('Capture')) {
    capture = true
    event = event.slice(0, -7)
  }
  event = event.replace(/[A-Z]/g, match => match.toLowerCase())
  return { name: event, capture }
}

function updateEventListener(
  element: Element,
  key: string,
  handler: EventListenerOrEventListenerObject,
  state: ElementState,
) {
  removeEventListener(element, key, state)
  const { name, capture } = getEventName(key)
  const info: EventInfo = {
    name,
    handler,
    options: capture ? { capture: true } : undefined,
  }
  element.addEventListener(name, handler, info.options)
  state.events.set(key, info)
}

function removeEventListener(element: Element, key: string, state: ElementState) {
  const info = state.events.get(key)
  if (!info)
    return
  element.removeEventListener(info.name, info.handler, info.options)
  state.events.delete(key)
}

function setProperty(element: Element, key: string, value: any) {
  const target = element as any
  const propKey = propertyNameMap[key] ?? key
  if (propKey in target) {
    try {
      target[propKey] = value
      return
    }
    catch {
      // ignore assignment error and fallback to attribute
    }
  }
  if (value === undefined) {
    element.removeAttribute(key)
  }
  else {
    element.setAttribute(key, typeof value === 'string' ? value : String(value))
  }
}
