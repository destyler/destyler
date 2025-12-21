import type { MachineContext as Ctx } from './types'
import { createScope } from '@destyler/dom'

export const dom = createScope({
  getRootId: (ctx: Ctx) => ctx.ids?.root ?? `scroll-area:${ctx.id}`,
  getViewportId: (ctx: Ctx) => ctx.ids?.viewport ?? `scroll-area:${ctx.id}:viewport`,
  getContentId: (ctx: Ctx) => ctx.ids?.content ?? `scroll-area:${ctx.id}:content`,
  getScrollbarXId: (ctx: Ctx) => ctx.ids?.scrollbarX ?? `scroll-area:${ctx.id}:scrollbar-x`,
  getScrollbarYId: (ctx: Ctx) => ctx.ids?.scrollbarY ?? `scroll-area:${ctx.id}:scrollbar-y`,
  getThumbXId: (ctx: Ctx) => ctx.ids?.thumbX ?? `scroll-area:${ctx.id}:thumb-x`,
  getThumbYId: (ctx: Ctx) => ctx.ids?.thumbY ?? `scroll-area:${ctx.id}:thumb-y`,
  getCornerId: (ctx: Ctx) => ctx.ids?.corner ?? `scroll-area:${ctx.id}:corner`,

  getRootEl: (ctx: Ctx) => dom.getById(ctx, dom.getRootId(ctx)),
  getViewportEl: (ctx: Ctx) => dom.getById(ctx, dom.getViewportId(ctx)),
  getContentEl: (ctx: Ctx) => dom.getById(ctx, dom.getContentId(ctx)),
  getScrollbarXEl: (ctx: Ctx) => dom.getById(ctx, dom.getScrollbarXId(ctx)),
  getScrollbarYEl: (ctx: Ctx) => dom.getById(ctx, dom.getScrollbarYId(ctx)),
  getThumbXEl: (ctx: Ctx) => dom.getById(ctx, dom.getThumbXId(ctx)),
  getThumbYEl: (ctx: Ctx) => dom.getById(ctx, dom.getThumbYId(ctx)),
  getCornerEl: (ctx: Ctx) => dom.getById(ctx, dom.getCornerId(ctx)),
})
