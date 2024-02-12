import type { Component, PropType, Ref } from 'vue'
import { defineComponent, h, ref, toRefs } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive } from '@destyler/primitive'
import type { DataOrientation, Direction, ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useDirection, useForwardExpose, useId, useVModel } from '@destyler/composition'

export const destylerTabsRootProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'div',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  modelValue: {
    type: String as PropType<string>,
    required: false,
  },
  defaultValue: {
    type: String as PropType<string>,
    required: false,
  },
  activationMode: {
    type: String as PropType<'automatic' | 'manual'>,
    required: false,
    default: 'automatic',
  },
  dir: {
    type: String as PropType<Direction>,
    required: false,
  },
  orientation: {
    type: String as PropType<DataOrientation>,
    required: false,
    default: 'horizontal',
  },
} as const

export type DestylerTabsRootProps = ExtractPublicPropTypes<typeof destylerTabsRootProps>

export interface TabsRootContext {
  modelValue: Ref<string | undefined>
  changeModelValue: (value: string) => void
  orientation: Ref<DataOrientation>
  dir: Ref<Direction>
  activationMode: 'automatic' | 'manual'
  baseId: string
  tabsList: Ref<HTMLElement | undefined>
}

export const [injectTabsRootContext, provideTabsRootContext] = createContext<TabsRootContext>('DestylerTabsRoot')

export const DestylerTabsRoot = defineComponent({
  name: 'DestylerTabsRoot',
  props: destylerTabsRootProps,
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { orientation, dir: propDir } = toRefs(props)
    const dir = useDirection(propDir)
    useForwardExpose()

    const modelValue = useVModel(props, 'modelValue', emit, {
      defaultValue: props.defaultValue,
      passive: (props.modelValue === undefined) as false,
    })

    const tabsList = ref<HTMLElement>()

    provideTabsRootContext({
      modelValue,
      changeModelValue: (value: string) => {
        modelValue.value = value
      },
      orientation,
      dir,
      activationMode: props.activationMode,
      baseId: useId(),
      tabsList,
    })

    return {
      dir,
      orientation,
    }
  },
  render() {
    return h(DestylerPrimitive, {
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'dir': this.dir,
      'data-orientation': this.orientation,
    }, {
      default: () => this.$slots.default?.(),
    })
  },
})
