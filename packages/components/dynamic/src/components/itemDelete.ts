import type { Component, PropType } from 'vue'
import { computed, defineComponent, h, mergeProps } from 'vue'
import { type AsTag, DestylerPrimitive } from '@destyler/primitive'
import { useForwardExpose } from '@destyler/composition'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectDynamicRootContext } from './root'
import { injectDynamicItemContext } from './item'

export const destylerDynamicItemDeleteProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'button',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type DestylerDynamicItemDeleteProps = ExtractPublicPropTypes<typeof destylerDynamicItemDeleteProps>

export const DestylerDynamicItemDelete = defineComponent({
  name: 'DestylerDynamicItemDelete',
  props: destylerDynamicItemDeleteProps,
  setup() {
    useForwardExpose()
    const context = injectDynamicRootContext()
    const itemContext = injectDynamicItemContext()

    const disabled = computed(() => itemContext.disabled?.value || context.disabled.value)

    function handleDelete() {
      if (disabled.value)
        return
      const index = context.modelValue.value.findIndex(i => i === itemContext.value.value)
      context.onRemoveValue(index)
    }

    return {
      context,
      itemContext,
      disabled,
      handleDelete,
    }
  },
  render() {
    return h(DestylerPrimitive, mergeProps(this.$props, {
      'tabindex': '-1',
      'aria-labelledby': this.itemContext.textId,
      'aria-current': this.itemContext.isSelected.value,
      'data-state': this.itemContext.isSelected.value ? 'active' : 'inactive',
      'data-disabled': this.disabled ? '' : undefined,
      'type': this.$props.as === 'button' ? 'button' : undefined,
      'onClick': () => {
        this.handleDelete()
      },
    }), () => this.$slots.default?.())
  },
})
