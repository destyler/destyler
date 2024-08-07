import type { PropType, Ref, SlotsType, VNode } from 'vue'
import { defineComponent, h, toRefs } from 'vue'
import type { DataOrientation, Direction, ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useDirection, useForwardExpose, useSingleOrMultipleValue } from '@destyler/composition'
import { RovingFocusGroup } from '@destyler/roving-focus'
import { Primitive, primitiveProps } from '@destyler/primitive'

export type TypeEnum = 'single' | 'multiple'

export const toggleGroupRootProps = {
  ...primitiveProps,
  type: {
    type: String as PropType<TypeEnum>,
    required: false,
    default: 'single',
  },
  defaultValue: {
    type: [String, Array] as PropType<string | string[]>,
    required: false,
  },
  modelValue: {
    type: [String, Array] as PropType<string | string[]>,
    required: false,
  },
  rovingFocus: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  orientation: {
    type: String as PropType<DataOrientation>,
    required: false,
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

export type ToggleGroupRootProps = ExtractPublicPropTypes<typeof toggleGroupRootProps>

export const toggleGroupRootEmits = {
  'update:modelValue': (_value: string) => true,
}

export interface ToggleGroupRootContext {
  type: TypeEnum
  modelValue: Ref<string | string[] | undefined>
  changeModelValue: (value: string) => void
  dir?: Ref<Direction>
  orientation?: DataOrientation
  loop: Ref<boolean>
  rovingFocus: Ref<boolean>
  disabled?: Ref<boolean>
}

export const [injectToggleGroupRootContext, provideToggleGroupRootContext] = createContext<ToggleGroupRootContext>('DestylerToggleGroupRoot')

export const ToggleGroupRoot = defineComponent({
  name: 'DestylerToggleGroupRoot',
  props: toggleGroupRootProps,
  emits: toggleGroupRootEmits,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup(props, { emit }) {
    const { loop, rovingFocus, disabled, dir: propDir } = toRefs(props)
    const dir = useDirection(propDir)
    const { forwardRef } = useForwardExpose()

    const { modelValue, changeModelValue } = useSingleOrMultipleValue(props, emit)

    provideToggleGroupRootContext({
      type: props.type,
      modelValue,
      changeModelValue,
      dir,
      orientation: props.orientation,
      loop,
      rovingFocus,
      disabled,
    })

    return {
      rovingFocus,
      dir,
      loop,
      forwardRef,
    }
  },
  render() {
    return h(this.rovingFocus ? RovingFocusGroup : Primitive, {
      asChild: true,
      orientation: this.rovingFocus ? this.$props.orientation : undefined,
      dir: this.dir,
      loop: this.rovingFocus ? this.loop : undefined,
    }, () => h(Primitive, {
      ref: (el: any) => this.forwardRef(el),
      role: 'group',
      as: this.$props.as,
      asChild: this.$props.asChild,
    }, () => this.$slots.default?.()))
  },
})
