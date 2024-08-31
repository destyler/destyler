import type { PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose, useForwardPropsEmits, useId } from '@destyler/composition'
import { Presence } from '@destyler/presence'

import { injectComboboxRootContext } from './root'
import { ComboboxContentImpl, comboboxCOntentImplEmits, comboboxContentImplProps } from './contentImpl'

export const comboboxContentProps = {
  ...comboboxContentImplProps,
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type ComboboxContentProps = ExtractPublicPropTypes<typeof comboboxContentProps>

export const comboboxContentEmits = {
  ...comboboxCOntentImplEmits,
}

export const ComboboxContent = defineComponent({
  name: 'DestylerComboboxContent',
  props: comboboxContentProps,
  emits: comboboxContentEmits,

  setup(props, { emit }) {
    const forwarded = useForwardPropsEmits(props, emit)
    const { forwardRef } = useForwardExpose()

    const rootContext = injectComboboxRootContext()

    rootContext.contentId ||= useId(undefined, 'destyler-combobox-content')

    return {
      forwardRef,
      forwarded,
      rootContext,
    }
  },
  render() {
    return h(Presence, {
      present: this.$props.forceMount || this.rootContext.open.value,
    }, () => h(ComboboxContentImpl, mergeProps(this.$attrs, this.forwarded, {
      ref: (el: any) => this.forwardRef(el),
    }), () => this.$slots.default?.()))
  },
})
