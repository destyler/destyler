import type { MachineContext as Ctx } from './types'
import { createScope, nextById, prevById, queryAll } from '@destyler/dom'
import { first, last } from '@destyler/utils'

export const dom = createScope({
  getRootId: (ctx: Ctx) => ctx.ids?.root ?? `collapse:${ctx.id}`,
  getItemId: (ctx: Ctx, value: string) => ctx.ids?.item?.(value) ?? `collapse:${ctx.id}:item:${value}`,
  getItemContentId: (ctx: Ctx, value: string) =>
    ctx.ids?.itemContent?.(value) ?? `collapse:${ctx.id}:content:${value}`,
  getItemTriggerId: (ctx: Ctx, value: string) =>
    ctx.ids?.itemTrigger?.(value) ?? `collapse:${ctx.id}:trigger:${value}`,

  getRootEl: (ctx: Ctx) => dom.getById(ctx, dom.getRootId(ctx)),
  getTriggerEls: (ctx: Ctx) => {
    const ownerId = CSS.escape(dom.getRootId(ctx))
    const selector = `[aria-controls][data-ownedby='${ownerId}']:not([disabled])`
    return queryAll(dom.getRootEl(ctx), selector)
  },

  getFirstTriggerEl: (ctx: Ctx) => first(dom.getTriggerEls(ctx)),
  getLastTriggerEl: (ctx: Ctx) => last(dom.getTriggerEls(ctx)),
  getNextTriggerEl: (ctx: Ctx, id: string) => nextById(dom.getTriggerEls(ctx), dom.getItemTriggerId(ctx, id)),
  getPrevTriggerEl: (ctx: Ctx, id: string) => prevById(dom.getTriggerEls(ctx), dom.getItemTriggerId(ctx, id)),
})
