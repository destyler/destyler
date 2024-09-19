import type { PropType, Ref } from 'vue'
import { defineComponent, h, toRefs } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { DataOrientation, Direction, ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useDirection, useVModel } from '@destyler/composition'
import { RovingFocusGroup } from '@destyler/roving-focus'

export const radioGroupRootProps = {
  ...primitiveProps,
  /**
   * The controlled value of the radio item to check. Can be binded as `v-model`.
   */
  modelValue: {
    type: String as PropType<string>,
    required: false,
  },
  /**
   * The value of the radio item that should be checked when initially rendered.
   *
   * Use when you do not need to control the state of the radio items.
   */
  defaultValue: {
    type: String as PropType<string>,
    required: false,
  },
  /**
   * When `true`, prevents the user from interacting with radio items.
   */
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  /**
   * The name of the group. Submitted with its owning form as part of a name/value pair.
   */
  name: {
    type: String as PropType<string>,
    required: false,
  },
  /**
   * When `true`, indicates that the user must check a radio item before the owning form can be submitted.
   *
   * @default false
   */
  required: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  /**
   * The orientation of the component.
   *
   * @default undefined
   */
  orientation: {
    type: String as PropType<DataOrientation>,
    required: false,
    default: undefined,
  },
  /**
   * The reading direction of the radio when applicable.
   */
  dir: {
    type: String as PropType<Direction>,
    required: false,
  },
  /**
   * When `true`, keyboard navigation will loop from last item to first, and vice versa.
   *
   * @default true
   */
  loop: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
  },
} as const

export type RadioGroupRootProps = ExtractPublicPropTypes<typeof radioGroupRootProps>

export const radioGroupRootEmits = {
  /**
   * Event handler called when the radio group value changes
   */
  'update:modelValue': (_value: string) => true,
}

export interface RadioGroupRootContext {
  modelValue?: Readonly<Ref<string | undefined>>
  changeModelValue: (value?: string) => void
  disabled: Ref<boolean>
  loop: Ref<boolean>
  orientation: Ref<DataOrientation | undefined>
  name?: string
  required: Ref<boolean>
}

export const [injectRadioGroupRootContext, provideRadioGroupRootContext] = createContext<RadioGroupRootContext>('DestylerRadioGroupRoot')

export const RadioGroupRoot = defineComponent({
  name: 'DestylerRadioGroupRoot',
  props: radioGroupRootProps,
  emits: radioGroupRootEmits,
  setup(props, { emit }) {
    const modelValue = useVModel(props, 'modelValue', emit, {
      defaultValue: props.defaultValue,
      passive: (props.modelValue === undefined) as false,
    })
    const { disabled, loop, orientation, name, required, dir: propDir } = toRefs(props)
    const dir = useDirection(propDir)
    provideRadioGroupRootContext({
      modelValue,
      changeModelValue: (value) => {
        modelValue.value = value
      },
      disabled,
      loop,
      orientation,
      name: name?.value,
      required,
    })

    return {
      orientation,
      dir,
      loop,
      disabled,
      required,
      name,
    }
  },
  render() {
    return h(RovingFocusGroup, {
      asChild: true,
      orientation: this.orientation,
      dir: this.dir,
      loop: this.loop,
    }, () => h(Primitive, {
      'role': 'radiogroup',
      'data-disabled': this.disabled ? '' : undefined,
      'asChild': this.$props.asChild,
      'aria-required': this.required,
      'dir': this.dir,
      'name': this.name,
    }, () => this.$slots.default?.()))
  },
})
