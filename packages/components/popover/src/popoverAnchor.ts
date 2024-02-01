import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps, onBeforeMount, onUnmounted } from 'vue'
import { DestylerPopperAnchor } from '@destyler/popper'
import type { AsTag } from '@destyler/primitive'
import type { ExtractPublicPropTypes, Measurable } from '@destyler/shared'

import { injectPopoverRootContext } from './popoverRoot'

export const destylerPopoverAnchorProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'div',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  element: {
    type: Object as PropType<Measurable>,
  },
} as const

export type DestylerPopoverAnchorProps = ExtractPublicPropTypes<typeof destylerPopoverAnchorProps>

export const DestylerPopoverAnchor = defineComponent({
  name: 'DestylerPopoverAnchor',
  props: destylerPopoverAnchorProps,
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
    return h(DestylerPopperAnchor, mergeProps(this.$props, {
    }), this.$slots.default?.())
  },
})
