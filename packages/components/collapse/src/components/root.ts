import type { ComputedRef, PropType, Ref } from 'vue'
import { computed, defineComponent, h, toRefs } from 'vue'
import { createContext } from '@destyler/shared'
import type { DataOrientation, Direction, ExtractPublicPropTypes, Type } from '@destyler/shared'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import { useForwardExpose, useSingleOrMultipleValue } from '@destyler/composition'

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

export const destylerCollapseRootProps = {
  ...destylerPrimitiveProps,
  type: {
    type: String as PropType<Type>,
    required: true,
  },
  modelValue: {
    type: [String, Array] as PropType<string | string[]>,
    required: false,
    default: undefined,
  },
  defaultValue: {
    type: [String, Array] as PropType<string | string[]>,
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

export type DestylerCollapseRootProps = ExtractPublicPropTypes<typeof destylerCollapseRootProps>

export const DestylerCollapseRoot = defineComponent({
  name: 'DestylerCollapseRoot',
  props: destylerCollapseRootProps,
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { dir, disabled } = toRefs(props)
    const { modelValue, changeModelValue } = useSingleOrMultipleValue(props, emit)

    const { forwardRef, currentElement: parentElement } = useForwardExpose()

    provideCollapseRootContext({
      disabled,
      direction: dir,
      orientation: props.orientation,
      parentElement,
      isSingle: computed(() => props.type === 'single'),
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
    return h(DestylerPrimitive, {
      ref: (el: any) => this.forwardRef(el),
      asChild: this.$props.asChild,
      as: this.$props.as,
    }, () => this.$slots.default?.({ modelValue: this.modelValue }))
  },
})
