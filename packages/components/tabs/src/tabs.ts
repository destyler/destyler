import type { PropType } from 'vue'
import { defineComponent, h, ref } from 'vue'
import { MaybeArray } from '@destyler/shared'
import { OnBeforeLeave, OnUpdateValue, OnClose } from './interface'

const DestylerTabs = defineComponent({
  name: 'DestylerTabs',
  props: {
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
  },
  setup(props, { slots }) {
    const tabsElRef = ref<HTMLElement | null>(null)
    const startReachedRef = ref(true)
    const endReachedRef = ref(true)
    const compitableValueRef = useCompitable(props, ['activeName', 'value'])

  },
  render() {
  },
})

export {
  DestylerTabs,
}
