import { defineComponent, h, withDirectives } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose, useId } from '@destyler/composition'
import { BindOnceDirective } from '@destyler/directives'
import { createContext } from '@destyler/shared'

import { injectContextBreadcrumbsContext } from './content'

export const breadcrumbsItemProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'li',
  },
}

export type BreadcrumbsItemProps = ExtractPublicPropTypes<typeof breadcrumbsItemProps>

export interface ContextBreadcrumbsItemContext {
  itemId: string
}

export const [injectContextBreadcrumbsItemContext, provideContextBreadcrumbsItemContext] = createContext<ContextBreadcrumbsItemContext>('DestylerContextBreadcrumbsItemContent')

export const BreadcrumbsItem = defineComponent({
  name: 'DestylerBreadcrumbsItem',
  props: breadcrumbsItemProps,
  setup() {
    const { forwardRef } = useForwardExpose()
    const id = useId()
    const content = injectContextBreadcrumbsContext()

    provideContextBreadcrumbsItemContext({
      itemId: id,
    })

    return {
      id,
      forwardRef,
      content,
    }
  },
  render() {
    return withDirectives(h(Primitive, {
      'ref': (el: any) => this.forwardRef(el),
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'aria-label': 'breadcrumb item',
      'data-destyler-breadcrumb-item': '',
      'data-state': this.content.lastItemId.value === this.id ? 'active' : 'inactive',
    }, {
      default: () => this.$slots.default?.(),
    }), [
      [BindOnceDirective, { id: this.id }],
    ])
  },
})
