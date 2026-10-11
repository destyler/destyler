import type { CSSProperties, Style } from '@destyler/types'
import type { MachineContext as Ctx, PanelId } from './types'
import { createScope, queryAll } from '@destyler/dom'

const cursorStyles = new WeakMap<Ctx, HTMLStyleElement>()

export const dom = createScope({
  getRootId: (ctx: Ctx) => ctx.ids?.root ?? `splitter:${ctx.id}`,
  getResizeTriggerId: (ctx: Ctx, id: string) => ctx.ids?.resizeTrigger?.(id) ?? `splitter:${ctx.id}:splitter:${id}`,
  getLabelId: (ctx: Ctx) => ctx.ids?.label ?? `splitter:${ctx.id}:label`,
  getPanelId: (ctx: Ctx, id: string | number) => ctx.ids?.panel?.(id) ?? `splitter:${ctx.id}:panel:${id}`,
  getGlobalCursorId: (ctx: Ctx) => `splitter:${ctx.id}:global-cursor`,

  getRootEl: (ctx: Ctx) => dom.getById(ctx, dom.getRootId(ctx)),
  getResizeTriggerEl: (ctx: Ctx, id: string) => dom.getById(ctx, dom.getResizeTriggerId(ctx, id)),
  getPanelEl: (ctx: Ctx, id: string | number) => dom.getById(ctx, dom.getPanelId(ctx, id)),

  getCursor(ctx: Ctx) {
    const x = ctx.isHorizontal
    let cursor: Style['cursor'] = x ? 'col-resize' : 'row-resize'
    if (ctx.activeResizeState.isAtMin)
      cursor = x ? 'e-resize' : 's-resize'
    if (ctx.activeResizeState.isAtMax)
      cursor = x ? 'w-resize' : 'n-resize'
    return cursor
  },

  getPanelStyle(ctx: Ctx, id: PanelId): CSSProperties {
    const flexGrow = ctx.panels.find(panel => panel.id === id)?.size ?? '0'
    return {
      flexBasis: 0,
      flexGrow,
      flexShrink: 1,
      overflow: 'hidden',
    }
  },

  getActiveHandleEl(ctx: Ctx) {
    const activeId = ctx.activeResizeId
    if (activeId == null)
      return
    return dom.getById(ctx, dom.getResizeTriggerId(ctx, activeId))
  },

  getResizeTriggerEls(ctx: Ctx) {
    const ownerId = CSS.escape(dom.getRootId(ctx))
    return queryAll(dom.getRootEl(ctx), `[role=separator][data-ownedby='${ownerId}']`)
  },

  setupGlobalCursor(ctx: Ctx) {
    let style = cursorStyles.get(ctx)
    if (!style) {
      style = dom.getDoc(ctx).createElement('style')
      style.id = dom.getGlobalCursorId(ctx)
      cursorStyles.set(ctx, style)
    }
    style.textContent = `* { cursor: ${dom.getCursor(ctx)} !important; }`
    if (!style.isConnected)
      dom.getDoc(ctx).head.appendChild(style)
  },

  removeGlobalCursor(ctx: Ctx) {
    cursorStyles.get(ctx)?.remove()
    cursorStyles.delete(ctx)
  },
})
