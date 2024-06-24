import { defineComponent, h } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { DestylerToggleGroupItem, destylerToggleGroupItemProps } from '@destyler/toggle'

import { DestylerToolbarButton } from './button'

export const destylerToolbarToggleItemProps = {
  ...destylerToggleGroupItemProps,
} as const

export type DestylerToolbarToggleItemProps = ExtractPublicPropTypes<typeof destylerToolbarToggleItemProps>

export const DestylerToolbarToggleItem = defineComponent({
  name: 'DestylerToolbarToggleItem',
  props: destylerToolbarToggleItemProps,
  setup() {
    const { forwardRef } = useForwardExpose()

    return {
      forwardRef,
    }
  },
  render() {
    return h(DestylerToolbarButton, {
      asChild: true,
    }, {
      default: () => {
        return h(DestylerToggleGroupItem, {
          ...this.$props,
          ref: (el: any) => this.forwardRef(el),
        }, {
          default: () => this.$slots.default?.(),
        })
      },
    })
  },
})
