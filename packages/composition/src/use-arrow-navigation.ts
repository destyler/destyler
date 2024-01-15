import type { ArrowKeyOptions, Direction } from '@destyler/shared'

interface ArrowNavigationOptions {
  /**
   * @default "both"
   */
  arrowKeyOptions?: ArrowKeyOptions

  /**
   * @default "data-destyler-vue-collection-item"
   */
  attributeName?: string

  /**
   * @default []
   */
  itemsArray?: HTMLElement[]

  /**
   * @default true
   */
  loop?: boolean

  /**
   * @default "ltr"
   */
  dir?: Direction

  /**
   * @default true
   */
  preventScroll?: boolean

  /**
   * @default false
   */
  focus?: boolean
}

export function useArrowNavigation(
  e: KeyboardEvent,
  currentElement: HTMLElement,
  parentElement: HTMLElement | undefined,
  options: ArrowNavigationOptions = {},
): HTMLElement | null {
  if (!currentElement)
    return null

  const {
    arrowKeyOptions = 'both',
    attributeName = 'data-destyler-vue-collection-item',
    itemsArray = [],
    loop = true,
    dir = 'ltr',
    preventScroll = true,
    focus = false,
  } = options

  const [right, left, up, down, home, end] = [
    e.key === 'ArrowRight',
    e.key === 'ArrowLeft',
    e.key === 'ArrowUp',
    e.key === 'ArrowDown',
    e.key === 'Home',
    e.key === 'End',
  ]
  const goingVertical = up || down
  const goingHorizontal = right || left
  if (
    !home
    && !end
    && ((!goingVertical && !goingHorizontal)
    || (arrowKeyOptions === 'vertical' && goingHorizontal)
    || (arrowKeyOptions === 'horizontal' && goingVertical))
  )
    return null

  const allCollectionItems: HTMLElement[] = parentElement
    ? Array.from(parentElement.querySelectorAll(`[${attributeName}]`))
    : itemsArray

  if (!allCollectionItems.length)
    return null

  if (preventScroll)
    e.preventDefault()

  let item: HTMLElement | null = null

  if (goingHorizontal || goingVertical) {
    const goForward = goingVertical ? down : dir === 'ltr' ? right : left
    item = findNextFocusableElement(allCollectionItems, currentElement, {
      goForward,
      loop,
    })
  }
  else if (home) {
    item = allCollectionItems.at(0) || null
  }
  else if (end) {
    item = allCollectionItems.at(-1) || null
  }

  if (focus)
    item?.focus()

  return item
}

function findNextFocusableElement(
  elements: HTMLElement[],
  currentElement: HTMLElement,
  { goForward, loop }: { goForward: boolean, loop?: boolean },
  iterations = elements.length,
): HTMLElement | null {
  if (--iterations === 0)
    return null

  const index = elements.indexOf(currentElement)
  const newIndex = goForward ? index + 1 : index - 1

  if (!loop && (newIndex < 0 || newIndex >= elements.length))
    return null

  const adjustedNewIndex = (newIndex + elements.length) % elements.length
  const candidate = elements[adjustedNewIndex]
  if (!candidate)
    return null

  const isDisabled
    = candidate.hasAttribute('disabled')
    && candidate.getAttribute('disabled') !== 'false'
  if (isDisabled) {
    return findNextFocusableElement(
      elements,
      candidate,
      { goForward, loop },
      iterations,
    )
  }
  return candidate
}
