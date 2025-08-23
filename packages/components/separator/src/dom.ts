import type { MachineContext as Ctx } from './types'
import { createScope } from '@destyler/dom'

export const dom = createScope({
  getRootId: (ctx: Ctx) => ctx.ids?.root ?? `separator:${ctx.id}`,
  getRootEl: (ctx: Ctx) => dom.getById(ctx, dom.getRootId(ctx)),
})
