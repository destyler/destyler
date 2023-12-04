import type { PropType } from 'vue'
import { defineComponent, h, ref, watch } from 'vue'
import { MaybeArray } from '@destyler/shared'
import { OnBeforeLeave, OnUpdateValue, OnClose, tabsInjectionKey } from './interface'
import { useCompitable, useMergedState } from '@destyler/composition'
import { flatten, ExtractPublicPropTypes } from '@destyler/shared'

const destylerTabsProps = {
  value: {
    type: [String, Number] as PropType<string | number>
  },
  defaultValue: {
    type: [String, Number] as PropType<string | number>
  },
  trigger: {
    type: String as PropType<'click' | 'hover'>,
    default: 'click'
  },
  closable: {
    type: Boolean as PropType<boolean>
  },
  onBeforeLeave: {
    type: Function as PropType<OnBeforeLeave>
  },
  onAdd: {
    type: Function as PropType<() => void>,
  },
  'onUpdate:value': {
    type: [Function, Array] as PropType<MaybeArray<OnUpdateValue>>
  },
  onUpdateValue: {
    type: [Function, Array] as PropType<MaybeArray<OnUpdateValue>>
  },
  onClose: {
    type: [Function, Array] as PropType<MaybeArray<OnClose>>
  },
  activeName: {
    type: [String, Number] as PropType<string | number>
  },
  onActiveNameChange: {
    type: [Function, Array] as PropType<MaybeArray<(value: string & number) => void>>
  }
}

export type TabsProps = ExtractPublicPropTypes<typeof destylerTabsProps>

const DestylerTabs = defineComponent({
  name: 'DestylerTabs',
  props: destylerTabsProps,
  setup(props, { slots }) {
    const tabsElRef = ref<HTMLElement | null>(null)
    const startReachedRef = ref(true)
    const endReachedRef = ref(true)
    const compitableValueRef = useCompitable(props, ['activeName', 'value'])
    const uncontrolledValueRef = ref(
      compitableValueRef.value ??
        props.defaultValue ??
        (slots.default
          ? ((flatten((slots as any).default())[0] as any)?.props?.name as
              | string
              | number)
          : null)
    )
    const mergedValueRef = useMergedState( compitableValueRef, uncontrolledValueRef )
    const tabChangeIdRef = { id: 0 }

    watch(mergedValueRef,()=>{
      tabChangeIdRef.id = 0
    })
    function getCurrentEl (): HTMLElement | null {
      const { value } = mergedValueRef
      if (value === null) return null
      const tabEl = tabsElRef.value?.querySelector(`[data-name="${value}"]`)
      return tabEl as HTMLElement | null
    }
  },
  render() {
  },
})

export {
  DestylerTabs,
}
