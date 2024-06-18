import type { PropType } from 'vue'
import { computed, defineComponent, h, mergeProps } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectComboboxRootContext } from './root'

export const destylerComboboxTriggerProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'button',
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type DestylerComboboxTriggerProps = ExtractPublicPropTypes<typeof destylerComboboxTriggerProps>

export const DestylerComboboxTrigger = defineComponent({
  name: 'DestylerComboboxTrigger',
  props: destylerComboboxTriggerProps,
  setup(props) {
    useForwardExpose()
    const rootContext = injectComboboxRootContext()
    const disabled = computed(() => props.disabled || rootContext.disabled.value || false)

    return {
      rootContext,
      disabled,
    }
  },
  render() {
    return h(DestylerPrimitive, mergeProps(this.$props, {
      'type': this.$props.as === 'button' ? 'button' : undefined,
      'tabindex': '-1',
      'aria-label': 'Show popup',
      'aria-haspopup': 'listbox',
      'aria-expanded': this.rootContext.open.value,
      'aria-controls': this.rootContext.contentId,
      'data-state': this.rootContext.open.value ? 'open' : 'closed',
      'disabled': this.disabled,
      'data-disabled': this.disabled ? '' : undefined,
      'aria-disabled': this.disabled ?? undefined,
      'onClick': () => {
        this.rootContext.onOpenChange(!this.rootContext.open.value)
      },
    }), {
      default: () => this.$slots.default?.(),
    })
  },
})
