import type { PropType, Ref } from 'vue'
import { defineComponent, h, toRefs } from 'vue'
import type { DataOrientation, Direction, ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useDirection, useForwardExpose, useSingleOrMultipleValue } from '@destyler/composition'
import { RovingFocusGroup } from '@destyler/roving-focus'
import { Primitive, primitiveProps } from '@destyler/primitive'

export type TypeEnum = 'single' | 'multiple'

export const toggleGroupRootProps = {
  ...primitiveProps,
  /**
   * Determines whether a "single" or "multiple" items can be pressed at a time.
   *
   * This prop will be ignored if any of `v-model` or `defaultValue` is an defined, as the type will be inferred from the value.
   *
   * @default single
   */
  type: {
    type: String as PropType<TypeEnum>,
    required: false,
    default: 'single',
  },
  /**
   * The default active value of the item(s).
   *
   * Use when you do not need to control the state of the item(s).
   */
  defaultValue: {
    type: [String, Array] as PropType<string | string[]>,
    required: false,
  },
  /**
   * The controlled value of the active item(s).
   *
   * Use this when you need to control the state of the items. Can be binded with `v-model`
   */
  modelValue: {
    type: [String, Array] as PropType<string | string[]>,
    required: false,
  },
  /**
   * When `false`, navigating through the items using arrow keys will be disabled.
   *
   * @default true
   */
  rovingFocus: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
  },
  /**
   * When `true`, prevents the user from interacting with the toggle group and all its items.
   *
   * @default false
   */
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  /**
   * The orientation of the component, which determines how focus moves: `horizontal` for left/right arrows and `vertical` for up/down arrows.
   */
  orientation: {
    type: String as PropType<DataOrientation>,
    required: false,
  },
  /**
   * The reading direction of the combobox when applicable.
   */
  dir: {
    type: String as PropType<Direction>,
    required: false,
  },
  /**
   * When `loop` and `rovingFocus` is `true`, keyboard navigation will loop from last item to first, and vice versa.
   */
  loop: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
  },
} as const

export type ToggleGroupRootProps = ExtractPublicPropTypes<typeof toggleGroupRootProps>

export const toggleGroupRootEmits = {
  /**
   * Event handler called when the value changes.
   */
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
