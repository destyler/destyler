import { defineComponent, h } from 'vue'
import { destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { DestylerDivider } from '@destyler/divider'

import { injectToolbarRootContext } from './root'

export const destylerToolbarSeparatorProps = {
  ...destylerPrimitiveProps,
} as const

export type DestylerToolbarSeparatorProps = ExtractPublicPropTypes<typeof destylerToolbarSeparatorProps>

export const DestylerToolbarSeparator = defineComponent({
  name: 'DestylerToolbarSeparator',
  props: destylerToolbarSeparatorProps,
  setup() {
    const rootContext = injectToolbarRootContext()
    useForwardExpose()

    return {
      rootContext,
    }
  },
  render() {
    return h(DestylerDivider, {
      orientation: this.rootContext.orientation.value,
      asChild: this.$props.asChild,
      as: this.$props.as,
    }, {
      default: () => this.$slots.default?.(),
    })
  },
})
