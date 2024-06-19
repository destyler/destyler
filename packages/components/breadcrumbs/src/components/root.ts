import { defineComponent, h } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

export const destylerBreadcrumbsRootProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'nav',
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
