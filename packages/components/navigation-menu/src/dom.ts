import type { MachineContext as Ctx } from './types'
import { createScope, nextById, prevById, queryAll } from '@destyler/dom'
import { first, last } from '@destyler/utils'

export const dom = createScope({
  getRootId: (ctx: Ctx) => ctx.ids?.root ?? `nav-menu:${ctx.id}`,
  getListId: (ctx: Ctx) => ctx.ids?.list ?? `nav-menu:${ctx.id}:list`,
  getViewportId: (ctx: Ctx) => ctx.ids?.viewport ?? `nav-menu:${ctx.id}:viewport`,
  getViewportPositionerId: (ctx: Ctx) => ctx.ids?.viewportPositioner ?? `nav-menu:${ctx.id}:viewport-positioner`,
  getIndicatorId: (ctx: Ctx) => ctx.ids?.indicator ?? `nav-menu:${ctx.id}:indicator`,
  getTriggerId: (ctx: Ctx, value: string) => ctx.ids?.trigger?.(value) ?? `nav-menu:${ctx.id}:trigger:${value}`,
  getLinkId: (ctx: Ctx, value: string) => ctx.ids?.link?.(value) ?? `nav-menu:${ctx.id}:link:${value}`,
  getContentId: (ctx: Ctx, value: string) => ctx.ids?.content?.(value) ?? `nav-menu:${ctx.id}:content:${value}`,
  getItemId: (ctx: Ctx, value: string) => ctx.ids?.item?.(value) ?? `nav-menu:${ctx.id}:item:${value}`,

  getRootEl: (ctx: Ctx) => dom.getById(ctx, dom.getRootId(ctx)),
  getListEl: (ctx: Ctx) => dom.getById(ctx, dom.getListId(ctx)),
  getViewportEl: (ctx: Ctx) => dom.getById(ctx, dom.getViewportId(ctx)),
  getViewportPositionerEl: (ctx: Ctx) => dom.getById(ctx, dom.getViewportPositionerId(ctx)),
  getIndicatorEl: (ctx: Ctx) => dom.getById(ctx, dom.getIndicatorId(ctx)),
  getTriggerEl: (ctx: Ctx, value: string) => dom.getById(ctx, dom.getTriggerId(ctx, value)),
  getContentEl: (ctx: Ctx, value: string) => dom.getById(ctx, dom.getContentId(ctx, value)),
  getItemEl: (ctx: Ctx, value: string) => dom.getById(ctx, dom.getItemId(ctx, value)),

  getActiveTriggerEl: (ctx: Ctx) => {
    if (!ctx.value)
      return null
    return dom.getTriggerEl(ctx, ctx.value)
  },

  getActiveContentEl: (ctx: Ctx) => {
    if (!ctx.value)
      return null
    return dom.getContentEl(ctx, ctx.value)
  },

  getTriggerEls: (ctx: Ctx) => {
    const list = dom.getListEl(ctx)
    if (!list)
      return []
    return queryAll(list, '[data-part="trigger"]:not([disabled])')
  },

  getFirstTriggerEl: (ctx: Ctx) => first(dom.getTriggerEls(ctx)),
  getLastTriggerEl: (ctx: Ctx) => last(dom.getTriggerEls(ctx)),

  getNextTriggerEl: (ctx: Ctx, currentId: string, loop = true) => {
    const triggers = dom.getTriggerEls(ctx)
    return nextById(triggers, currentId, loop)
  },

  getPrevTriggerEl: (ctx: Ctx, currentId: string, loop = true) => {
    const triggers = dom.getTriggerEls(ctx)
    return prevById(triggers, currentId, loop)
  },

  getItemEls: (ctx: Ctx) => {
    const root = dom.getRootEl(ctx)
    if (!root)
      return []
    return queryAll(root, '[data-part="item"]')
  },
})
