import type { MachineContext as Ctx } from './types'
import { createScope } from '@zag-js/dom-query'

export const dom = createScope({
  getRootId: (ctx: Ctx) => ctx.ids?.root ?? `qrcode:${ctx.id}:root`,
  getFrameId: (ctx: Ctx) => ctx.ids?.frame ?? `qrcode:${ctx.id}:frame`,
  getFrameEl: (ctx: Ctx) => dom.getById<SVGSVGElement>(ctx, dom.getFrameId(ctx)),
})
