import type { SlotsType, VNode } from 'vue'
import { defineComponent, h } from 'vue'
import { useForwardPropsEmits } from '@destyler/composition'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectEllipsisRootContext } from './root'
import { EllipsisContentImpl, ellipsisContentImplEmits, ellipsisContentImplProps } from './contentImpl'
import { EllipsisContentHoverable } from './contentHoverable'

export const ellipsisContentProps = {
  ...ellipsisContentImplProps,
} as const

export type EllipsisContentProps = ExtractPublicPropTypes<typeof ellipsisContentProps>

export const ellipsisContentEmits = {
  ...ellipsisContentImplEmits,
}

export const EllipsisContent = defineComponent({
  name: 'DestylerEllipsisContent',
  props: ellipsisContentProps,
  emits: ellipsisContentEmits,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup(props, { emit }) {
    const rootContext = injectEllipsisRootContext()
    const forwarded = useForwardPropsEmits(props, emit)

    return {
      rootContext,
      forwarded,
    }
  },
  render() {
    const useVShow = this.rootContext.open.value
    return useVShow
      ? h(this.rootContext.disableHoverableContent.value ? EllipsisContentImpl : EllipsisContentHoverable, {
        ...this.forwarded,
      }, () => this.$slots.default ? this.$slots.default?.({ text: this.rootContext.text.value }) : this.rootContext.text.value)
      : null
  },
})
