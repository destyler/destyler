import type { PropType, Ref } from 'vue'
import { defineComponent, h, ref, toRefs } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { DataOrientation, Direction, ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useDirection, useForwardExpose, useId, useVModel } from '@destyler/composition'

export const tabsRootProps = {
  ...primitiveProps,
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

export type TabsRootProps = ExtractPublicPropTypes<typeof tabsRootProps>

export const tabsRootEmits = {
  'update:modelValue': (_value: string | number) => true,
}

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

export const TabsRoot = defineComponent({
  name: 'DestylerTabsRoot',
  props: tabsRootProps,
  emits: tabsRootEmits,

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
    return h(Primitive, {
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'dir': this.dir,
      'data-orientation': this.orientation,
    }, () => this.$slots.default?.())
  },
})
