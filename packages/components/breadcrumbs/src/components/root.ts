import type { Component, PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

export const destylerBreadcrumbsRootProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'nav',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type DestylerBreadcrumbsRootProps = ExtractPublicPropTypes<typeof destylerBreadcrumbsRootProps>

export const DestylerBreadcrumbsRoot = defineComponent({
  name: 'DestylerBreadcrumbsRoot',
  props: destylerBreadcrumbsRootProps,
  setup(_) {
    useForwardExpose()
  },
  render() {
    return h(DestylerPrimitive, {
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'aria-label': 'breadcrumbs',
    }, {
      default: () => this.$slots.default?.(),
    })
  },
})
