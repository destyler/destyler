import { defineComponent, h } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectContextBreadcrumbsContext } from './content'
import { injectContextBreadcrumbsItemContext } from './item'

export const destylerBreadcrumbsSeparatorProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'span',
  },
} as const

export type DestylerBreadcrumbsSeparatorProps = ExtractPublicPropTypes<typeof destylerBreadcrumbsSeparatorProps>

export const DestylerBreadcrumbsSeparator = defineComponent({
  name: 'DestylerBreadcrumbsSeparator',
  props: destylerBreadcrumbsSeparatorProps,
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
      as: this.$props.as,
      asChild: this.$props.asChild,
      ...this.content.lastItemId.value === this.itemContent.itemId ? { style: { display: 'none' } } : {},
    }, {
      default: () => this.$slots.default ? this.$slots.default?.() : '/',
    })
  },
})
