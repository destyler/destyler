import type { PropType, Ref } from 'vue'
import { defineComponent, h, toRefs } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { DataOrientation, Direction, ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useDirection, useVModel } from '@destyler/composition'
import { RovingFocusGroup } from '@destyler/roving-focus'

export const radioGroupRootProps = {
  ...primitiveProps,
  modelValue: {
    type: String as PropType<string>,
    required: false,
  },
  defaultValue: {
    type: String as PropType<string>,
    required: false,
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  name: {
    type: String as PropType<string>,
    required: false,
  },
  required: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  orientation: {
    type: String as PropType<DataOrientation>,
    required: false,
    default: undefined,
  },
  dir: {
    type: String as PropType<Direction>,
    required: false,
  },
  loop: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
  },
} as const

export type RadioGroupRootProps = ExtractPublicPropTypes<typeof radioGroupRootProps>

export const radioGroupRootEmits = {
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
