import type { SlotsType, VNode } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useEmitAsProps, useForwardExpose } from '@destyler/composition'
import { ToggleGroupRoot, toggleGroupRootProps } from '@destyler/toggle'
import { toggleGroupRootEmits } from '@destyler/toggle/component'

import { injectToolbarRootContext } from './root'

export type TypeEnum = 'single' | 'multiple'

export const toolbarToggleGroupProps = {
  ...toggleGroupRootProps,
} as const

export type ToolbarToggleGroupProps = ExtractPublicPropTypes<typeof toolbarToggleGroupProps>

export const toolbarToggleGroupEmits = {
  ...toggleGroupRootEmits,
}

export const ToolbarToggleGroup = defineComponent({
  name: 'DestylerToolbarToggleGroup',
  props: toolbarToggleGroupProps,
  emits: toolbarToggleGroupEmits,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup(_, { emit }) {
    const rootContext = injectToolbarRootContext()

    const emitsAsProps = useEmitAsProps(emit)
    useForwardExpose()

    return {
      rootContext,
      emitsAsProps,
    }
  },
  render() {
    return h(ToggleGroupRoot, mergeProps(this.$props, this.emitsAsProps, {
      'rovingFocus': false,
      'dir': this.rootContext.dir.value,
      'data-orientation': this.rootContext.orientation.value,
    }), {
      default: () => this.$slots.default?.(),
    })
  },
})
