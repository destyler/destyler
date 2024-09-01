import type { PropType } from 'vue'
import { computed, defineComponent, h } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose, useVModel } from '@destyler/composition'

export const toggleProps = {
  ...primitiveProps,
  /**
   * @default button
   */
  as: {
    ...primitiveProps.as,
    default: 'button',
  },
  /**
   * The pressed state of the toggle when it is initially rendered. Use when you do not need to control its open state.
   */
  defaultValue: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  /**
   * The controlled pressed state of the toggle. Can be bind as `v-model`.
   *
   * @default undefined
   */
  pressed: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: undefined,
  },
  /**
   * When `true`, prevents the user from interacting with the toggle.
   */
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type ToggleProps = ExtractPublicPropTypes<typeof toggleProps>

export const toggleEmits = {
  /**
   * Event handler called when the pressed state of the toggle changes.
   */
  'update:pressed': (_value: boolean) => true,
}

export type DataState = 'on' | 'off'

export const Toggle = defineComponent({
  name: 'DestylerToggle',
  props: toggleProps,
  emits: toggleEmits,
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
