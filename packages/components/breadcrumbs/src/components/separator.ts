import { defineComponent, h } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectContextBreadcrumbsContext } from './content'
import { injectContextBreadcrumbsItemContext } from './item'

export const breadcrumbsSeparatorProps = {
  ...primitiveProps,
  /**
   * @default span
   */
  as: {
    ...primitiveProps.as,
    default: 'span',
  },
} as const

export type BreadcrumbsSeparatorProps = ExtractPublicPropTypes<typeof breadcrumbsSeparatorProps>

export const BreadcrumbsSeparator = defineComponent({
  name: 'DestylerBreadcrumbsSeparator',
  props: breadcrumbsSeparatorProps,
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
    if (this.content.lastItemId.value !== this.itemContent.itemId) {
      return h(Primitive, {
        as: this.$props.as,
        asChild: this.$props.asChild,
      }, () => this.$slots.default ? this.$slots.default?.() : '/')
    }
  },
})
