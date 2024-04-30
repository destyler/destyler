import { type PropType, defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose, useForwardPropsEmits } from '@destyler/composition'
import { DestylerPresence } from '@destyler/presence'

import { injectComboboxRootContext } from './root'
import { DestylerComboboxContentImpl, destylerComboboxContentImplProps } from './contentImpl'

export const destylerComboboxContentProps = {
  ...destylerComboboxContentImplProps,
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type DestylerComboboxContentProps = ExtractPublicPropTypes<typeof destylerComboboxContentProps>

export const DestylerComboboxContent = defineComponent({
  name: 'DestylerComboboxContent',
  props: destylerComboboxContentProps,
  emits: ['escapeKeyDown', 'pointerDownOutside', 'focusOutside', 'interactOutside', 'dismiss'],
  setup(props, { emit }) {
    const forwarded = useForwardPropsEmits(props, emit)
    const { forwardRef } = useForwardExpose()

    const rootContext = injectComboboxRootContext()

    return {
      forwardRef,
      forwarded,
      rootContext,
    }
  },
  render() {
    return h(DestylerPresence, {
      present: this.$props.forceMount || this.rootContext.open.value,
    }, () => h(DestylerComboboxContentImpl, mergeProps(this.$attrs, this.forwarded, {
      ref: (el: any) => this.forwardRef(el),
    }), () => this.$slots.default?.()))
  },
})
