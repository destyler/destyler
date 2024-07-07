import type { SlotsType, VNode } from 'vue'
import { defineComponent, h } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectContextBreadcrumbsContext } from './content'
import { injectContextBreadcrumbsItemContext } from './item'

export const breadcrumbsLabelProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'a',
  },
} as const

export type BreadcrumbsLabelProps = ExtractPublicPropTypes<typeof breadcrumbsLabelProps>

export const BreadcrumbsLabel = defineComponent({
  name: 'DestylerBreadcrumbsLabel',
  props: breadcrumbsLabelProps,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup() {
    useForwardExpose()
    const content = injectContextBreadcrumbsContext()
    const itemContent = injectContextBreadcrumbsItemContext()

    return {
      content,
      itemContent,
    }
  },
  render() {
    return h(Primitive, {
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'data-state': this.content.lastItemId.value === this.itemContent.itemId ? 'active' : 'inactive',
    }, {
      default: () => this.$slots.default?.(),
    })
  },
})
