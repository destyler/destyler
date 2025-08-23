import type { MachineContext as Ctx, GroupMachineContext as GroupCtx, Placement } from './types'
import { createScope } from '@destyler/dom'

export const dom = createScope({
  getRegionId: (placement: Placement) => `toast-group:${placement}`,
  getRegionEl: (ctx: GroupCtx, placement: Placement) => dom.getById(ctx, `toast-group:${placement}`),

  getRootId: (ctx: Ctx) => `toast:${ctx.id}`,
  getRootEl: (ctx: Ctx) => dom.getById(ctx, dom.getRootId(ctx)),
  getTitleId: (ctx: Ctx) => `toast:${ctx.id}:title`,
  getDescriptionId: (ctx: Ctx) => `toast:${ctx.id}:description`,
  getCloseTriggerId: (ctx: Ctx) => `toast${ctx.id}:close`,
})
