import type { ComputedRef, PropType, Ref, SlotsType, VNode } from 'vue'
import { defineComponent, h, toRefs } from 'vue'
import { createContext } from '@destyler/shared'
import type { DataOrientation, Direction, ExtractPublicPropTypes, SingleOrMultipleProps, SingleOrMultipleType } from '@destyler/shared'
import { Primitive, primitiveProps } from '@destyler/primitive'
import { useDirection, useForwardExpose, useSingleOrMultipleValue } from '@destyler/composition'

export const collapseRootProps = {
  ...primitiveProps,
  /**
   * Determines whether a "single" or "multiple" items can be pressed at a time.
   *
   * This prop will be ignored if any of `v-model` or `defaultValue` is defined, as the type will be inferred from the value.
   */
  type: {
    type: String as PropType<SingleOrMultipleProps<string | string[], SingleOrMultipleType>['type']>,
    required: false,
  },
  /**
   * The controlled value of the active item(s).
   *
   * Use this when you need to control the state of the items. Can be binded with `v-model`
   * @default undefined
   */
  modelValue: {
    type: [String, Array] as PropType<SingleOrMultipleProps<string | string[], SingleOrMultipleType>['modelValue']>,
    required: false,
    default: undefined,
  },
  /**
   * The default active value of the item(s).
   *
   * Use when you do not need to control the state of the item(s).
   * @default undefined
   */
  defaultValue: {
    type: [String, Array] as PropType<SingleOrMultipleProps<string | string[], SingleOrMultipleType>['defaultValue']>,
    required: false,
    default: undefined,
  },
  /**
   * When type is "single", allows closing content when clicking trigger for an open item.
   * When type is "multiple", this prop has no effect.
   * @default false
   */
  collapsible: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  /**
   * When `true`, prevents the user from interacting with the accordion and all its items
   * @default false
   */
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  /**
   * The reading direction of the accordion when applicable.
   * If omitted, assumes LTR (left-to-right) reading mode.
   * @default ltr
   */
  dir: {
    type: String as PropType<Direction>,
    required: false,
    default: 'ltr',
  },
  /**
   * The orientation of the accordion.
   * @default vertical
   */
  orientation: {
    type: String as PropType<DataOrientation>,
    required: false,
    default: 'vertical',
  },
} as const

export type CollapseRootProps = ExtractPublicPropTypes<typeof collapseRootProps>

export const collapseRootEmits = {
  /**
   * Event handler called when the expanded state of an item changes
   */
  'update:modelValue': (_value: string | string[]) => true,
}

export interface CollapseRootContext {
  disabled: Ref<boolean>
  direction: Ref<Direction>
  orientation: DataOrientation
  parentElement: Ref<HTMLElement | undefined>
  changeModelValue: (value: string) => void
  isSingle: ComputedRef<boolean>
  modelValue: Ref<string | undefined | string[]>
  collapsible: boolean
}

export const [injectCollapseRootContext, provideCollapseRootContext] = createContext<CollapseRootContext>('DestylerCollapseRoot')

export const CollapseRoot = defineComponent({
  name: 'DestylerCollapseRoot',
  props: collapseRootProps,
  emits: collapseRootEmits,
  slots: Object as SlotsType<{
    default: (opts: {
      /**
       * Current active value
       */
      modelValue: string | string[] | undefined
    }) => VNode[]
  }>,
  setup(props, { emit }) {
    const { dir, disabled } = toRefs(props)
    const direction = useDirection(dir)

    const { modelValue, changeModelValue, isSingle } = useSingleOrMultipleValue(props, emit)

    const { forwardRef, currentElement: parentElement } = useForwardExpose()

    provideCollapseRootContext({
      disabled,
      direction,
      orientation: props.orientation,
      parentElement,
      isSingle,
      collapsible: props.collapsible,
      modelValue,
      changeModelValue,
    })

    return {
      forwardRef,
      parentElement,
      modelValue,
    }
  },
  render() {
    return h(Primitive, {
      'ref': (el: any) => this.forwardRef(el),
      'asChild': this.$props.asChild,
      'as': this.$props.as,
      'data-orientation': this.$props.orientation,
    }, () => this.$slots.default?.({ modelValue: this.modelValue }))
  },
})
