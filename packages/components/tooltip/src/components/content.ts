import { defineComponent, h } from 'vue'
import { useForwardPropsEmits } from '@destyler/composition'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectTooltipRootContext } from './root'
import { DestylerTooltipContentImpl, destylerTooltipContentImplEmits, destylerTooltipContentImplProps } from './contentImpl'
import { DestylerTooltipContentHoverable } from './contentHoverable'

export const destylerTooltipContentProps = {
  ...destylerTooltipContentImplProps,
} as const

export type DestylerTooltipContentProps = ExtractPublicPropTypes<typeof destylerTooltipContentProps>

export const destylerTooltipContentEmits = [...destylerTooltipContentImplEmits]

export const DestylerTooltipContent = defineComponent({
  name: 'DestylerTooltipContent',
  props: destylerTooltipContentProps,
  emits: destylerTooltipContentEmits,
  setup(props, { emit }) {
    const rootContext = injectTooltipRootContext()
    const forwarded = useForwardPropsEmits(props, emit)

    return {
      rootContext,
      forwarded,
    }
  },
  render() {
    const useVShow = this.rootContext.open.value
    return useVShow
      ? h(this.rootContext.disableHoverableContent.value ? DestylerTooltipContentImpl : DestylerTooltipContentHoverable, {
        ...this.forwarded,
      }, this.$slots.default?.())
      : null
  },
})
