import { defineComponent, h } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectContextBreadcrumbsContext } from './content'
import { injectContextBreadcrumbsItemContext } from './item'

export const destylerBreadcrumbsLabelProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'a',
  },
} as const

export type DestylerBreadcrumbsLabelProps = ExtractPublicPropTypes<typeof destylerBreadcrumbsLabelProps>

export const DestylerBreadcrumbsLabel = defineComponent({
  name: 'DestylerBreadcrumbsLabel',
  props: destylerBreadcrumbsLabelProps,
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
    return h(DestylerPrimitive, {
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'data-state': this.content.lastItemId.value === this.itemContent.itemId ? 'active' : 'inactive',
    }, {
      default: () => this.$slots.default?.(),
    })
  },
})
