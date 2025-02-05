import type { MachineContext as Ctx } from './types'
import { createScope } from '@zag-js/dom-query'

export const dom = createScope({
  getRootId: (ctx: Ctx) => ctx.ids?.root ?? `divider:${ctx.id}`,
  getRootEl: (ctx: Ctx) => dom.getById(ctx, dom.getRootId(ctx)),
})
