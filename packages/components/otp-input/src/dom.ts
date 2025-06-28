import { createScope, queryAll } from "@destyler/dom"
import type { MachineContext as Ctx } from "./types"

export const dom = createScope({
  getRootId: (ctx: Ctx) => ctx.ids?.root ?? `otp-input:${ctx.id}`,
  getInputId: (ctx: Ctx, id: string) => ctx.ids?.input?.(id) ?? `otp-input:${ctx.id}:${id}`,
  getHiddenInputId: (ctx: Ctx) => ctx.ids?.hiddenInput ?? `otp-input:${ctx.id}:hidden`,
  getLabelId: (ctx: Ctx) => ctx.ids?.label ?? `otp-input:${ctx.id}:label`,
  getControlId: (ctx: Ctx) => ctx.ids?.control ?? `otp-input:${ctx.id}:control`,

  getRootEl: (ctx: Ctx) => dom.getById(ctx, dom.getRootId(ctx)),
  getInputEls: (ctx: Ctx) => {
    const ownerId = CSS.escape(dom.getRootId(ctx))
    const selector = `input[data-ownedby=${ownerId}]`
    return queryAll<HTMLInputElement>(dom.getRootEl(ctx), selector)
  },
  getInputEl: (ctx: Ctx, id: string) => dom.getById<HTMLInputElement>(ctx, dom.getInputId(ctx, id)),
  getFocusedInputEl: (ctx: Ctx) => dom.getInputEls(ctx)[ctx.focusedIndex],
  getFirstInputEl: (ctx: Ctx) => dom.getInputEls(ctx)[0],
  getHiddenInputEl: (ctx: Ctx) => dom.getById<HTMLInputElement>(ctx, dom.getHiddenInputId(ctx)),
})
