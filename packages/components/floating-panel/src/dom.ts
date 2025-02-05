import type { MachineContext as Ctx } from './types'
import { createScope, isHTMLElement } from '@zag-js/dom-query'
import { createRect, getElementRect, getWindowRect, type Rect } from '@zag-js/rect-utils'
import { pick } from '@zag-js/utils'

export const dom = createScope({
  getTriggerId: (ctx: Ctx) => ctx.ids?.trigger ?? `float-panel:${ctx.id}:trigger`,
  getPositionerId: (ctx: Ctx) => ctx.ids?.positioner ?? `float-panel:${ctx.id}:positioner`,
  getContentId: (ctx: Ctx) => ctx.ids?.content ?? `float-panel:${ctx.id}:content`,
  getTitleId: (ctx: Ctx) => ctx.ids?.title ?? `float-panel:${ctx.id}:title`,
  getHeaderId: (ctx: Ctx) => ctx.ids?.header ?? `float-panel:${ctx.id}:header`,

  getTriggerEl: (ctx: Ctx) => dom.getById(ctx, dom.getTriggerId(ctx)),
  getPositionerEl: (ctx: Ctx) => dom.getById(ctx, dom.getPositionerId(ctx)),
  getContentEl: (ctx: Ctx) => dom.getById(ctx, dom.getContentId(ctx)),
  getHeaderEl: (ctx: Ctx) => dom.getById(ctx, dom.getHeaderId(ctx)),
  getBoundaryRect: (ctx: Ctx, allowOverflow: boolean) => {
    const boundaryEl = ctx.getBoundaryEl?.()
    let boundaryRect: Rect

    if (isHTMLElement(boundaryEl)) {
      boundaryRect = getElementRect(boundaryEl)
    }
    else {
      boundaryRect = getWindowRect(dom.getWin(ctx))
    }

    if (allowOverflow) {
      boundaryRect = createRect({
        x: -boundaryRect.width, // empty(left)
        y: boundaryRect.minY,
        width: boundaryRect.width * 3, // empty(left) + win + empty(right)
        height: boundaryRect.height * 2, // win + empty(bottom)
      })
    }

    return pick(boundaryRect, ['x', 'y', 'width', 'height'])
  },
})
