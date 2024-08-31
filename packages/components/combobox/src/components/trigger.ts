import type { PropType } from 'vue'
import { computed, defineComponent, h, mergeProps } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectComboboxRootContext } from './root'

export const comboboxTriggerProps = {
  ...primitiveProps,
  /**
   * @default button
   */
  as: {
    ...primitiveProps.as,
    default: 'button',
  },
  /**
   * When `true`, prevents the user from interacting with item.
   */
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type ComboboxTriggerProps = ExtractPublicPropTypes<typeof comboboxTriggerProps>

export const ComboboxTrigger = defineComponent({
  name: 'DestylerComboboxTrigger',
  props: comboboxTriggerProps,
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
    return h(Primitive, mergeProps(this.$props, {
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
