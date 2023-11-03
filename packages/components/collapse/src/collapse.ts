import type { ExtractPropTypes, PropType, Ref, Slots } from 'vue'
import { computed, defineComponent, h, provide, ref } from 'vue'
import { useMergedState } from '@destyler/composition'
import type { MaybeArray } from '@destyler/shared'
import { call, createInjectionKey } from '@destyler/shared'
import type { HeaderClickInfo, OnItemHeaderClick, OnItemHeaderClickImpl, OnUpdateExpandedNames, OnUpdateExpandedNamesImpl } from './interface'

export const Prop = {
  'defaultExpandedNames': {
    type: [Array, String] as PropType<string | number | Array<string | number> | null>,
    default: null,
  },
  'expandedNames': {
    type: [Array, String] as PropType<string | number | Array<string | number> | null>,
  },
  'accordion': {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  'displayDirective': {
    type: String as PropType<'if' | 'show'>,
    default: 'if',
  },
  'onItemHeaderClick': {
    type: [Function, Array] as PropType<MaybeArray<OnItemHeaderClick>>,
  },
  'onUpdateExpandedNames': {
    type: [Function, Array] as PropType<MaybeArray<OnUpdateExpandedNames>>,
  },
  'onUpdate:expandedNames': {
    type: [Function, Array] as PropType<MaybeArray<OnUpdateExpandedNames>>,
  },
}

export interface DestylerCollapseInjection {
  props: ExtractPropTypes<typeof Prop>
  expandedNamesRef: Ref<string | number | Array<string | number> | null>
  slots: Slots
  toggleItem: (
    collapse: boolean,
    name: string | number,
    event: MouseEvent
  ) => void
}

export const collapseInjectionKey = createInjectionKey<DestylerCollapseInjection>('destyler-collapse')

export default defineComponent({
  name: 'DestylerCollapse',
  props: Prop,
  setup(props, { slots }) {
    const uncontrolledExpandedNamesRef = ref<string | number | Array<string | number> | null>(props.defaultExpandedNames)
    const controlledExpandedNamesRef = computed(() => props.expandedNames)
    const mergedExpandedNamesRef = useMergedState(
      controlledExpandedNamesRef,
      uncontrolledExpandedNamesRef,
    )

    function doUpdateExpandedNames(names: Array<string | number> | string | number): void {
      const {
        'onUpdate:expandedNames': _onUpdateExpandedNames,
        onUpdateExpandedNames,
      } = props
      if (onUpdateExpandedNames)
        call(onUpdateExpandedNames as OnUpdateExpandedNamesImpl, names)

      if (_onUpdateExpandedNames)
        call(_onUpdateExpandedNames as OnUpdateExpandedNamesImpl, names)

      uncontrolledExpandedNamesRef.value = names
    }

    function doItemHeaderClick<T extends string | number>(info: HeaderClickInfo<T>): void {
      const { onItemHeaderClick } = props
      if (onItemHeaderClick)
        call(onItemHeaderClick as OnItemHeaderClickImpl, info)
    }
    function toggleItem(collapse: boolean, name: string | number, event: MouseEvent): void {
      const { accordion } = props
      const { value: expandedNames } = mergedExpandedNamesRef
      if (accordion) {
        if (collapse) {
          doUpdateExpandedNames([name])
          doItemHeaderClick({ name, expanded: true, event })
        }
        else {
          doUpdateExpandedNames([])
          doItemHeaderClick({ name, expanded: false, event })
        }
      }
      else {
        if (!Array.isArray(expandedNames)) {
          doUpdateExpandedNames([name])
          doItemHeaderClick({ name, expanded: true, event })
        }
        else {
          const activeNames = expandedNames.slice()
          const index = activeNames.findIndex(
            activeName => name === activeName,
          )
          if (~index) {
            activeNames.splice(index, 1)
            doUpdateExpandedNames(activeNames)
            doItemHeaderClick({ name, expanded: false, event })
          }
          else {
            activeNames.push(name)
            doUpdateExpandedNames(activeNames)
            doItemHeaderClick({ name, expanded: true, event })
          }
        }
      }
    }

    provide(collapseInjectionKey, {
      props,
      expandedNamesRef: mergedExpandedNamesRef,
      slots,
      toggleItem,
    })
  },
  render() {
    return h('div', {
      destyler: 'collapse',
    }, this.$slots)
  },
})
