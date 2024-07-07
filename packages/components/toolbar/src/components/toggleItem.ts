import type { SlotsType } from 'vue';
import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { ToggleGroupItem, toggleGroupItemProps } from '@destyler/toggle'

import { ToolbarButton } from './button'

export const toolbarToggleItemProps = {
  ...toggleGroupItemProps,
} as const

export type ToolbarToggleItemProps = ExtractPublicPropTypes<typeof toolbarToggleItemProps>

export const ToolbarToggleItem = defineComponent({
  name: 'DestylerToolbarToggleItem',
  props: toolbarToggleItemProps,
  slots: Object as SlotsType<{
    default: () => void
  }>,
  setup() {
    const { forwardRef } = useForwardExpose()

    return {
      forwardRef,
    }
  },
  render() {
    return h(ToolbarButton, {
      asChild: true,
    }, {
      default: () => {
        return h(ToggleGroupItem, {
          ...this.$props,
          ref: (el: any) => this.forwardRef(el),
        }, {
          default: () => this.$slots.default?.(),
        })
      },
    })
  },
})
