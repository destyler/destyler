import { defineComponent, h } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

export const breadcrumbsRootProps = {
  ...primitiveProps,
  /**
   * @default nav
   */
  as: {
    ...primitiveProps.as,
    default: 'nav',
  },
} as const

export type BreadcrumbsRootProps = ExtractPublicPropTypes<typeof breadcrumbsRootProps>

export const BreadcrumbsRoot = defineComponent({
  name: 'DestylerBreadcrumbsRoot',
  props: breadcrumbsRootProps,
  setup(_) {
    useForwardExpose()
  },
  render() {
    return h(Primitive, {
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'aria-label': 'breadcrumbs',
    }, {
      default: () => this.$slots.default?.(),
    })
  },
})
