import type { Component, PropType } from 'vue'
import { defineComponent, h, onBeforeMount, onMounted } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive } from '@destyler/primitive'
import { renderSlotFragments } from '@destyler/shared'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { shouldShowPlaceholder } from '../utils'
import { injectSelectRootContext } from './root'

export const destylerSelectValueProps = {
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'span',
  },
  placeholder: {
    type: String as PropType<string>,
    required: false,
  },
} as const

export type DestylerSelectValueProps = ExtractPublicPropTypes<typeof destylerSelectValueProps>

export const DestylerSelectValue = defineComponent({
  name: 'DestylerSelectValue',
  props: destylerSelectValueProps,
  setup(_, { slots }) {
    const { forwardRef, currentElement } = useForwardExpose()

    const rootContext = injectSelectRootContext()

    onBeforeMount(() => {
      const hasChildren = !!renderSlotFragments(slots?.default?.()).length
      rootContext.onValueElementHasChildrenChange(hasChildren)
    })

    onMounted(() => {
      rootContext.valueElement = currentElement
    })

    return {
      rootContext,
      forwardRef,
    }
  },
  render() {
    return h(DestylerPrimitive, {
      ref: (el: any) => this.forwardRef(el),
      as: this.$props.as,
      asChild: this.$props.asChild,
      style: {
        pointerEvents: 'none',
      },
    }, () => [
      shouldShowPlaceholder(this.rootContext.modelValue?.value)
        ? this.$props.placeholder
        : this.$slots.default?.(),
    ])
  },
})
