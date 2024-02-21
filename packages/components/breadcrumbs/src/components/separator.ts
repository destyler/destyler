import type { Component, PropType } from 'vue'
import { defineComponent, h } from 'vue'
import { type AsTag, DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectContextBreadcrumbsContext } from './content'
import { injectContextBreadcrumbsItemContext } from './item'

export const destylerBreadcrumbsSeparatorProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'span',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
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
