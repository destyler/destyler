import type { MachineContext as Ctx } from './types'
import { createScope } from '@zag-js/dom-query'

export const dom = createScope({
  getPositionerId: (ctx: Ctx) => ctx.ids?.positioner ?? `tour-positioner-${ctx.id}`,
  getContentId: (ctx: Ctx) => ctx.ids?.content ?? `tour-content-${ctx.id}`,
  getTitleId: (ctx: Ctx) => ctx.ids?.title ?? `tour-title-${ctx.id}`,
  getDescriptionId: (ctx: Ctx) => ctx.ids?.description ?? `tour-desc-${ctx.id}`,
  getArrowId: (ctx: Ctx) => ctx.ids?.arrow ?? `tour-arrow-${ctx.id}`,
  getBackdropId: (ctx: Ctx) => ctx.ids?.backdrop ?? `tour-backdrop-${ctx.id}`,
  getContentEl: (ctx: Ctx) => dom.getById(ctx, dom.getContentId(ctx)),
  getPositionerEl: (ctx: Ctx) => dom.getById(ctx, dom.getPositionerId(ctx)),
  getBackdropEl: (ctx: Ctx) => dom.getById(ctx, dom.getBackdropId(ctx)),
})
