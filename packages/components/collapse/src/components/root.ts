import type { ComputedRef, PropType, Ref, SlotsType, VNode } from 'vue'
import { defineComponent, h, toRefs } from 'vue'
import { createContext } from '@destyler/shared'
import type { DataOrientation, Direction, ExtractPublicPropTypes, SingleOrMultipleProps, SingleOrMultipleType } from '@destyler/shared'
import { Primitive, primitiveProps } from '@destyler/primitive'
import { useDirection, useForwardExpose, useSingleOrMultipleValue } from '@destyler/composition'

export const collapseRootProps = {
  ...primitiveProps,
  type: {
    type: String as PropType<SingleOrMultipleProps<string | string[], SingleOrMultipleType>['type']>,
    required: false,
  },
  modelValue: {
    type: [String, Array] as PropType<SingleOrMultipleProps<string | string[], SingleOrMultipleType>['modelValue']>,
    required: false,
    default: undefined,
  },
  defaultValue: {
    type: [String, Array] as PropType<SingleOrMultipleProps<string | string[], SingleOrMultipleType>['defaultValue']>,
    required: false,
    default: undefined,
  },
  collapsible: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  dir: {
    type: String as PropType<Direction>,
    required: false,
    default: 'ltr',
  },
  orientation: {
    type: String as PropType<DataOrientation>,
    required: false,
    default: 'vertical',
  },
} as const

export type CollapseRootProps = ExtractPublicPropTypes<typeof collapseRootProps>

export const collapseRootEmits = {
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
    default: (opts: { modelValue: string | string[] | undefined }) => VNode[]
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
      ref: (el: any) => this.forwardRef(el),
      asChild: this.$props.asChild,
      as: this.$props.as,
    }, () => this.$slots.default?.({ modelValue: this.modelValue }))
  },
})
