import type { SlotsType, VNode } from 'vue'
import { defineComponent, h } from 'vue'
import { primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { Divider } from '@destyler/divider'

import { injectToolbarRootContext } from './root'

export const toolbarSeparatorProps = {
  ...primitiveProps,
} as const

export type ToolbarSeparatorProps = ExtractPublicPropTypes<typeof toolbarSeparatorProps>

export const ToolbarSeparator = defineComponent({
  name: 'DestylerToolbarSeparator',
  props: toolbarSeparatorProps,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup() {
    const rootContext = injectToolbarRootContext()
    useForwardExpose()

    return {
      rootContext,
    }
  },
  render() {
    return h(Divider, {
      orientation: this.rootContext.orientation.value,
      asChild: this.$props.asChild,
      as: this.$props.as,
    }, {
      default: () => this.$slots.default?.(),
    })
  },
})
