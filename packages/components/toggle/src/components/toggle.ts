import type { Component, PropType } from 'vue'
import { computed, defineComponent, h } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose, useVModel } from '@destyler/composition'

export const destylerToggleProps = {
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
  defaultValue: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  pressed: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: undefined,
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type DestylerToggleProps = ExtractPublicPropTypes<typeof destylerToggleProps>

export type DataState = 'on' | 'off'

export const DestylerToggle = defineComponent({
  name: 'DestylerToggle',
  props: destylerToggleProps,
  emits: ['update:pressed'],
  setup(props, { emit }) {
    useForwardExpose()
    const pressed = useVModel(props, 'pressed', emit, {
      defaultValue: props.defaultValue,
      passive: (props.pressed === undefined) as false,
    })

    function togglePressed() {
      pressed.value = !pressed.value
    }

    const dataState = computed<DataState>(() => {
      return pressed.value ? 'on' : 'off'
    })

    return {
      pressed,
      togglePressed,
      dataState,
    }
  },
  render() {
    return h(DestylerPrimitive, {
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'type': this.$props.as === 'button' ? 'button' : undefined,
      'aria-pressed': this.pressed,
      'data-state': this.dataState,
      'data-disabled': this.$props.disabled ? '' : undefined,
      'disabled': this.$props.disabled,
      'onClick': () => {
        this.togglePressed()
      },
    }, () => this.$slots.default?.())
  },
})
