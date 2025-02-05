import type { MachineContext as Ctx } from './types'
import { createScope } from '@zag-js/dom-query'

export const dom = createScope({
  getRootId: (ctx: Ctx) => ctx.ids?.root ?? `file-upload:${ctx.id}`,
  getDropzoneId: (ctx: Ctx) => ctx.ids?.dropzone ?? `file-upload:${ctx.id}:dropzone`,
  getHiddenInputId: (ctx: Ctx) => ctx.ids?.hiddenInput ?? `file-upload:${ctx.id}:input`,
  getTriggerId: (ctx: Ctx) => ctx.ids?.trigger ?? `file-upload:${ctx.id}:trigger`,
  getLabelId: (ctx: Ctx) => ctx.ids?.label ?? `file-upload:${ctx.id}:label`,
  getItemId: (ctx: Ctx, id: string) => ctx.ids?.item?.(id) ?? `file-upload:${ctx.id}:item:${id}`,
  getItemNameId: (ctx: Ctx, id: string) => ctx.ids?.itemName?.(id) ?? `file-upload:${ctx.id}:item-name:${id}`,
  getItemSizeTextId: (ctx: Ctx, id: string) => ctx.ids?.itemSizeText?.(id) ?? `file-upload:${ctx.id}:item-size:${id}`,
  getItemPreviewId: (ctx: Ctx, id: string) => ctx.ids?.itemPreview?.(id) ?? `file-upload:${ctx.id}:item-preview:${id}`,

  getRootEl: (ctx: Ctx) => dom.getById<HTMLElement>(ctx, dom.getRootId(ctx)),
  getHiddenInputEl: (ctx: Ctx) => dom.getById<HTMLInputElement>(ctx, dom.getHiddenInputId(ctx)),
  getDropzoneEl: (ctx: Ctx) => dom.getById(ctx, dom.getDropzoneId(ctx)),
})
