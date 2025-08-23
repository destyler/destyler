import type { MachineContext as Ctx } from './types'
import { createScope } from '@destyler/dom'

export const dom = createScope({
  getRootId: (ctx: Ctx) => ctx.ids?.root ?? `timer:${ctx.id}:root`,
  getAreaId: (ctx: Ctx) => ctx.ids?.area ?? `timer:${ctx.id}:area`,
  getAreaEl: (ctx: Ctx) => dom.getById(ctx, dom.getAreaId(ctx)),
})
