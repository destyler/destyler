import type { MachineContext as Ctx } from './types'
import { createScope } from '@destyler/dom'

export const dom = createScope({
  getRootId: (ctx: Ctx) => ctx.ids?.root ?? `edit:${ctx.id}`,
  getAreaId: (ctx: Ctx) => ctx.ids?.area ?? `edit:${ctx.id}:area`,
  getLabelId: (ctx: Ctx) => ctx.ids?.label ?? `edit:${ctx.id}:label`,
  getPreviewId: (ctx: Ctx) => ctx.ids?.preview ?? `edit:${ctx.id}:preview`,
  getInputId: (ctx: Ctx) => ctx.ids?.input ?? `edit:${ctx.id}:input`,
  getControlId: (ctx: Ctx) => ctx.ids?.control ?? `edit:${ctx.id}:control`,
  getSubmitTriggerId: (ctx: Ctx) => ctx.ids?.submitTrigger ?? `edit:${ctx.id}:submit`,
  getCancelTriggerId: (ctx: Ctx) => ctx.ids?.cancelTrigger ?? `edit:${ctx.id}:cancel`,
  getEditTriggerId: (ctx: Ctx) => ctx.ids?.editTrigger ?? `edit:${ctx.id}:edit`,

  getInputEl: (ctx: Ctx) => dom.getById<HTMLInputElement>(ctx, dom.getInputId(ctx)),
  getPreviewEl: (ctx: Ctx) => dom.getById<HTMLInputElement>(ctx, dom.getPreviewId(ctx)),
  getSubmitTriggerEl: (ctx: Ctx) => dom.getById<HTMLButtonElement>(ctx, dom.getSubmitTriggerId(ctx)),
  getCancelTriggerEl: (ctx: Ctx) => dom.getById<HTMLButtonElement>(ctx, dom.getCancelTriggerId(ctx)),
  getEditTriggerEl: (ctx: Ctx) => dom.getById<HTMLButtonElement>(ctx, dom.getEditTriggerId(ctx)),
})
