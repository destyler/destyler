import type { PropType } from 'vue'
import { computed, defineComponent, h, inject } from 'vue'
import { createId, resolveSlotWithProps, resolveWrappedSlotWithProps } from '@destyler/shared'
import { useMemo } from '@destyler/composition'
import type { DestylerCollapseInjection } from './collapse'
import { collapseInjectionKey } from './collapse'
import { DestylerCollapseItemContent } from './collapseItemContent'

const DestylerCollapseItem = defineComponent({
  name: 'DestylerCollapseItem',
  props: {
    title: {
      type: String as PropType<string>,
    },
    name: {
      type: [String, Number] as PropType<string | number>,
    },
    disabled: {
      type: Boolean as PropType<boolean>,
    },
    displayDirective: {
      type: String as PropType<'if' | 'show'>,
    },
  },
  setup(props) {
    const randomName = createId()
    const mergedName = useMemo(() => {
      return props.name ?? randomName
    })

    const DestylerCollapse = inject<DestylerCollapseInjection>(collapseInjectionKey)
    if (!DestylerCollapse)
      throw new Error('error')

    const {
      expandedNamesRef,
      props: collapseProps,
      slots: collapseSlots,
    } = DestylerCollapse

    const collapsed = computed<boolean>(() => {
      const { value: expandedNames } = expandedNamesRef
      if (Array.isArray(expandedNames)) {
        const { value: name } = mergedName
        return !~expandedNames.findIndex(
          expandedName => expandedName === name,
        )
      }
      else if (expandedNames) {
        const { value: name } = mergedName
        return name !== expandedNames
      }
      return true
    })

    const mergedDisplayDirective = computed<'if' | 'show'>(() => {
      const { displayDirective } = props
      if (displayDirective)
        return displayDirective

      else
        return collapseProps.displayDirective
    })

    function handleClick(e: MouseEvent) {
      if (DestylerCollapse && !props.disabled)
        DestylerCollapse.toggleItem(collapsed.value, mergedName.value, e)
    }

    return {
      collapseSlots,
      randomName,
      collapsed,
      mergedDisplayDirective,
      handleClick,
    }
  },
  render() {
    const headerNode = resolveSlotWithProps(
      this.$slots.header,
      { collapsed: this.collapsed },
      () => [this.$props.title],
    )
    const headerExtraSlot = this.$slots['header-extra'] || this.collapseSlots['header-extra']
    return h('div', {
      'destyler': 'collapse-item',
      'destyler-status': !this.collapsed ? 'open' : 'close',
    }, [
      h('div', {
        destyler: 'collapse-item-header',
        onClick: this.handleClick,
      }, [
        headerNode,
        resolveWrappedSlotWithProps(headerExtraSlot, {
          collapsed: this.collapsed,
          handleClick: this.handleClick,
        }, (children) => {
          return h('div', {
            destyler: 'collapse-item-header-extra',
            onClick: this.handleClick,
          }, [children])
        }),
      ]),
      h(DestylerCollapseItemContent, {
        displayDirective: this.mergedDisplayDirective,
        show: !this.collapsed,
      }, this.$slots),
    ])
  },
})

export {
  DestylerCollapseItem,
}
