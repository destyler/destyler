import type { MachineContext as Ctx } from './types'
import { createScope } from '@destyler/dom'

export const dom = createScope({
  getRootId: (ctx: Ctx) => ctx.ids?.root ?? `qr-code:${ctx.id}:root`,
  getFrameId: (ctx: Ctx) => ctx.ids?.frame ?? `qr-code:${ctx.id}:frame`,
  getFrameEl: (ctx: Ctx) => dom.getById<SVGSVGElement>(ctx, dom.getFrameId(ctx)),
})
