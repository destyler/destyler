import type { MachineContext as Ctx } from './types'
import { createScope } from '@zag-js/dom-query'

export const dom = createScope({
  getRootId: (ctx: Ctx) => ctx.ids?.root ?? `breadcrumbs:${ctx.id}`,
  getListId: (ctx: Ctx) => ctx.ids?.list ?? `breadcrumbs:${ctx.id}:list`,
})
