import { defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useEmitAsProps, useForwardExpose } from '@destyler/composition'
import { DestylerToggleGroupRoot, destylerToggleGroupRootProps } from '@destyler/toggle'

import { injectToolbarRootContext } from './root'

export type TypeEnum = 'single' | 'multiple'

export const destylerToolbarToggleGroupProps = {
  ...destylerToggleGroupRootProps,
} as const

export type DestylerToolbarToggleGroupProps = ExtractPublicPropTypes<typeof destylerToolbarToggleGroupProps>

export const DestylerToolbarToggleGroup = defineComponent({
  name: 'DestylerToolbarToggleGroup',
  props: destylerToolbarToggleGroupProps,
  emits: ['update:modelValue'],
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
    return h(DestylerToggleGroupRoot, mergeProps(this.$props, this.emitsAsProps, {
      'rovingFocus': false,
      'dir': this.rootContext.dir.value,
      'data-orientation': this.rootContext.orientation.value,
    }), {
      default: () => this.$slots.default?.(),
    })
  },
})
