import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'

export const destylerButtonProps = {
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'button',
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type DestylerButtonProps = ExtractPublicPropTypes<typeof destylerButtonProps>

export const DestylerButton = defineComponent({
  name: 'DestylerButton',
  inheritAttrs: false,
  props: destylerButtonProps,
  emits: ['click'],
  setup(props, { emit }) {
    function handleClick(e: MouseEvent) {
      if (!props.disabled)
        emit('click', e)
    }

    return {
      handleClick,
    }
  },
  render() {
    return h(DestylerPrimitive, mergeProps(this.$attrs, {
      as: this.$props.as,
      asChild: this.$props.asChild,
      disabled: this.$props.disabled,
      role: 'button',
      onClick: (e: any) => {
        this.handleClick(e)
      },
    }), {
      default: () => this.$slots.default?.(),
    })
  },
})
