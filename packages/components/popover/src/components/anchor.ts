import type { SlotsType, VNode } from 'vue'
import { defineComponent, h, mergeProps, onBeforeMount, onUnmounted } from 'vue'
import { PopperAnchor, popperAnchorProps } from '@destyler/popper'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectPopoverRootContext } from './root'

export const popoverAnchorProps = {
  ...popperAnchorProps,
} as const

export type PopoverAnchorProps = ExtractPublicPropTypes<typeof popoverAnchorProps>

export const PopoverAnchor = defineComponent({
  name: 'DestylerPopoverAnchor',
  props: popoverAnchorProps,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup() {
    const rootContext = injectPopoverRootContext()

    onBeforeMount(() => {
      rootContext.hasCustomAnchor.value = true
    })
    onUnmounted(() => {
      rootContext.hasCustomAnchor.value = false
    })
  },
  render() {
    return h(PopperAnchor, mergeProps(this.$props, {
    }), () => this.$slots.default?.())
  },
})
