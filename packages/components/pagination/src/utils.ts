import type { MachineContext as Ctx, IntlTranslations, Pages } from './types'

export const defaultTranslations: IntlTranslations = {
  rootLabel: 'pagination',
  prevTriggerLabel: 'previous page',
  nextTriggerLabel: 'next page',
  itemLabel({ page, totalPages }) {
    const isLastPage = totalPages > 1 && page === totalPages
    return `${isLastPage ? 'last page, ' : ''}page ${page}`
  },
}

export function getTranslation<K extends keyof IntlTranslations>(translations: IntlTranslations, key: K): IntlTranslations[K] {
  // Preserve inherited fields and explicit undefined without cloning the receiver.
  return key in translations ? translations[key] : defaultTranslations[key]
}

export function range(start: number, end: number) {
  const length = end - start + 1
  return Array.from({ length }, (_, idx) => idx + start)
}

export function transform(items: (string | number)[]): Pages {
  return items.map((value) => {
    if (typeof value === 'number')
      return { type: 'page', value }
    return { type: 'ellipsis' }
  })
}

const ELLIPSIS = 'ellipsis'

export type PageContext = Pick<Ctx, 'siblingCount' | 'page' | 'totalPages'>

export function getRange(ctx: PageContext) {
  const totalPageNumbers = Math.min(2 * ctx.siblingCount + 5, ctx.totalPages)

  const firstPageIndex = 1
  const lastPageIndex = ctx.totalPages

  const leftSiblingIndex = Math.max(ctx.page - ctx.siblingCount, firstPageIndex)
  const rightSiblingIndex = Math.min(ctx.page + ctx.siblingCount, lastPageIndex)

  const showLeftEllipsis = leftSiblingIndex > firstPageIndex + 1
  const showRightEllipsis = rightSiblingIndex < lastPageIndex - 1

  const itemCount = totalPageNumbers - 2

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftRange = range(1, itemCount)
    return [...leftRange, ELLIPSIS, lastPageIndex]
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightRange = range(lastPageIndex - itemCount + 1, lastPageIndex)
    return [firstPageIndex, ELLIPSIS, ...rightRange]
  }

  if (showLeftEllipsis && showRightEllipsis) {
    const middleRange = range(leftSiblingIndex, rightSiblingIndex)
    return [firstPageIndex, ELLIPSIS, ...middleRange, ELLIPSIS, lastPageIndex]
  }

  const fullRange = range(firstPageIndex, lastPageIndex)
  return fullRange
}

export const getTransformedRange = (ctx: PageContext) => transform(getRange(ctx))
