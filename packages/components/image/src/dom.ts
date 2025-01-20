import type { MachineContext as Ctx } from './types'
import { createScope } from '@zag-js/dom-query'

export const dom = createScope({
  getRootId: (ctx: Ctx) => ctx.ids?.root ?? `image:${ctx.id}`,
  getImageId: (ctx: Ctx) => ctx.ids?.image ?? `image:${ctx.id}:image`,
  getFallbackId: (ctx: Ctx) => ctx.ids?.fallback ?? `image:${ctx.id}:fallback`,

  getRootEl: (ctx: Ctx) => dom.getById(ctx, dom.getRootId(ctx)),
  getImageEl: (ctx: Ctx) => dom.getById<HTMLImageElement>(ctx, dom.getImageId(ctx)),
})
