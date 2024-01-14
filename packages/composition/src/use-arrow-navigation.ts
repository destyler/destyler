import type { ArrowKeyOptions, Direction } from '@destyler/shared'

interface ArrowNavigationOptions {
  /**
   * The arrow key options to allow navigation
   *
   * @default "both"
   */
  arrowKeyOptions?: ArrowKeyOptions

  /**
   * The attribute name to find the collection items in the parent element.
   *
   * @default "data-destyler-vue-collection-item"
   */
  attributeName?: string

  /**
   * The parent element where contains all the collection items, this will collect every item to be used when nav
   * It will be ignored if attributeName is provided
   *
   * @default []
   */
  itemsArray?: HTMLElement[]

  /**
   * Allow loop navigation. If false, it will stop at the first and last element
   *
   * @default true
   */
  loop?: boolean

  /**
   * The orientation of the collection
   *
   * @default "ltr"
   */
  dir?: Direction

  /**
   * Prevent the scroll when navigating. This happens when the direction of the
   * key matches the scroll direction of any ancestor scrollable elements.
   *
   * @default true
   */
  preventScroll?: boolean

  /**
   * Focus the element after navigation
   *
   * @default false
   */
  focus?: boolean
}

/**
 * Allow arrow navigation for every html element with data-radix-vue-collection-item tag
 *
 * @param e               Keyboard event
 * @param currentElement  Event initiator element or any element that wants to handle the navigation
 * @param parentElement   Parent element where contains all the collection items, this will collect every item to be used when nav
 * @param options         further options
 * @returns               the navigated html element or null if none
 */
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

/**
 * Recursive function to find the next focusable element to avoid disabled elements
 *
 * @param elements Elements to navigate
 * @param currentElement Current active element
 * @param options
 * @returns
 */
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
