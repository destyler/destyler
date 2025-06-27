import { createScope, query, queryAll } from "@destyler/dom"
import type { DateView, MachineContext as Ctx } from "./types"

export const dom = createScope({
  getLabelId: (ctx: Ctx, index: number) => ctx.ids?.label?.(index) ?? `calendar:${ctx.id}:label:${index}`,
  getRootId: (ctx: Ctx) => ctx.ids?.root ?? `calendar:${ctx.id}`,
  getTableId: (ctx: Ctx, id: string) => ctx.ids?.table?.(id) ?? `calendar:${ctx.id}:table:${id}`,
  getTableHeaderId: (ctx: Ctx, id: string) => ctx.ids?.tableHeader?.(id) ?? `calendar:${ctx.id}:thead`,
  getTableBodyId: (ctx: Ctx, id: string) => ctx.ids?.tableBody?.(id) ?? `calendar:${ctx.id}:tbody`,
  getTableRowId: (ctx: Ctx, id: string) => ctx.ids?.tableRow?.(id) ?? `calendar:${ctx.id}:tr:${id}`,
  getContentId: (ctx: Ctx) => ctx.ids?.content ?? `calendar:${ctx.id}:content`,
  getCellTriggerId: (ctx: Ctx, id: string) => ctx.ids?.cellTrigger?.(id) ?? `calendar:${ctx.id}:cell-trigger:${id}`,
  getPrevTriggerId: (ctx: Ctx, view: DateView) => ctx.ids?.prevTrigger?.(view) ?? `calendar:${ctx.id}:prev:${view}`,
  getNextTriggerId: (ctx: Ctx, view: DateView) => ctx.ids?.nextTrigger?.(view) ?? `calendar:${ctx.id}:next:${view}`,
  getViewTriggerId: (ctx: Ctx, view: DateView) => ctx.ids?.viewTrigger?.(view) ?? `calendar:${ctx.id}:view:${view}`,
  getClearTriggerId: (ctx: Ctx) => ctx.ids?.clearTrigger ?? `calendar:${ctx.id}:clear`,
  getControlId: (ctx: Ctx) => ctx.ids?.control ?? `calendar:${ctx.id}:control`,
  getInputId: (ctx: Ctx, index: number) => ctx.ids?.input?.(index) ?? `calendar:${ctx.id}:input:${index}`,
  getTriggerId: (ctx: Ctx) => ctx.ids?.trigger ?? `calendar:${ctx.id}:trigger`,
  getPositionerId: (ctx: Ctx) => ctx.ids?.positioner ?? `calendar:${ctx.id}:positioner`,
  getMonthSelectId: (ctx: Ctx) => ctx.ids?.monthSelect ?? `calendar:${ctx.id}:month-select`,
  getYearSelectId: (ctx: Ctx) => ctx.ids?.yearSelect ?? `calendar:${ctx.id}:year-select`,

  getFocusedCell: (ctx: Ctx, view = ctx.view) =>
    query(
      dom.getContentEl(ctx),
      `[data-part=table-cell-trigger][data-view=${view}][data-focus]:not([data-outside-range])`,
    ),
  getTriggerEl: (ctx: Ctx) => dom.getById<HTMLButtonElement>(ctx, dom.getTriggerId(ctx)),
  getContentEl: (ctx: Ctx) => dom.getById(ctx, dom.getContentId(ctx)),
  getInputEls: (ctx: Ctx) => queryAll<HTMLInputElement>(dom.getControlEl(ctx), `[data-part=input]`),
  getYearSelectEl: (ctx: Ctx) => dom.getById<HTMLSelectElement>(ctx, dom.getYearSelectId(ctx)),
  getMonthSelectEl: (ctx: Ctx) => dom.getById<HTMLSelectElement>(ctx, dom.getMonthSelectId(ctx)),
  getClearTriggerEl: (ctx: Ctx) => dom.getById<HTMLButtonElement>(ctx, dom.getClearTriggerId(ctx)),
  getPositionerEl: (ctx: Ctx) => dom.getById(ctx, dom.getPositionerId(ctx)),
  getControlEl: (ctx: Ctx) => dom.getById(ctx, dom.getControlId(ctx)),
})
