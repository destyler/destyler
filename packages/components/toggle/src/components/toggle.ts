import type { PropType, SlotsType } from 'vue'
import { computed, defineComponent, h } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose, useVModel } from '@destyler/composition'

export const toggleProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'button',
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

export type ToggleProps = ExtractPublicPropTypes<typeof toggleProps>

export const toggleEmits = {
  'update:pressed': (_value: boolean) => true,
}

export type DataState = 'on' | 'off'

export const Toggle = defineComponent({
  name: 'DestylerToggle',
  props: toggleProps,
  emits: toggleEmits,
  slots: Object as SlotsType<{
    default: () => void
  }>,
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
    return h(Primitive, {
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
