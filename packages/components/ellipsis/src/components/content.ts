import { defineComponent, h } from 'vue'
import { useForwardPropsEmits } from '@destyler/composition'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectEllipsisRootContext } from './root'
import { DestylerEllipsisContentImpl, destylerEllipsisContentImplEmits, destylerEllipsisContentImplProps } from './contentImpl'
import { DestylerEllipsisContentHoverable } from './contentHoverable'

export const destylerEllipsisContentProps = {
  ...destylerEllipsisContentImplProps,
} as const

export type DestylerEllipsisContentProps = ExtractPublicPropTypes<typeof destylerEllipsisContentProps>

export const destylerEllipsisContentEmits = [...destylerEllipsisContentImplEmits]

export const DestylerEllipsisContent = defineComponent({
  name: 'DestylerEllipsisContent',
  props: destylerEllipsisContentProps,
  emits: destylerEllipsisContentEmits,
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
      ? h(this.rootContext.disableHoverableContent.value ? DestylerEllipsisContentImpl : DestylerEllipsisContentHoverable, {
        ...this.forwarded,
      }, {
        default: () => this.$slots.default ? this.$slots.default?.({ text: this.rootContext.text.value }) : this.rootContext.text.value,
      })
      : null
  },
})
