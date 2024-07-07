import type { PropType, SlotsType, VNode } from 'vue'
import { computed, defineComponent, h, nextTick, onMounted, onUnmounted } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { Primitive, primitiveProps } from '@destyler/primitive'
import { useCollection, useId } from '@destyler/composition'
import { focusFirst, wrapArray } from '@destyler/shared'

import { getFocusIntent } from '../utils'
import { injectRovingFocusGroupContext } from './group'

export const rovingFocusItemProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'span',
  },
  tabStopId: {
    type: String as PropType<string>,
    required: false,
  },
  focusable: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
  },
  active: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
  },
} as const

export type RovingFocusItemProps = ExtractPublicPropTypes<typeof rovingFocusItemProps>

export const RovingFocusItem = defineComponent({
  name: 'DestylerRovingFocusItem',
  props: rovingFocusItemProps,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup(props) {
    const context = injectRovingFocusGroupContext()
    const autoId = useId()
    const id = computed(() => props.tabStopId || autoId)
    const isCurrentTabStop = computed(
      () => context.currentTabStopId.value === id.value,
    )

    const { injectCollection } = useCollection('rovingFocus')
    const collections = injectCollection()

    onMounted(() => {
      if (props.focusable)
        context.onFocusableItemAdd()
    })
    onUnmounted(() => {
      if (props.focusable)
        context.onFocusableItemRemove()
    })

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === 'Tab' && event.shiftKey) {
        context.onItemShiftTab()
        return
      }

      if (event.target !== event.currentTarget)
        return

      const focusIntent = getFocusIntent(
        event,
        context.orientation.value,
        context.dir.value,
      )

      if (focusIntent !== undefined) {
        event.preventDefault()
        let candidateNodes = [...collections.value]

        if (focusIntent === 'last') {
          candidateNodes.reverse()
        }
        else if (focusIntent === 'prev' || focusIntent === 'next') {
          if (focusIntent === 'prev')
            candidateNodes.reverse()
          const currentIndex = candidateNodes.indexOf(
            event.currentTarget as HTMLElement,
          )

          candidateNodes = context.loop.value
            ? wrapArray(candidateNodes, currentIndex + 1)
            : candidateNodes.slice(currentIndex + 1)
        }

        nextTick(() => focusFirst(candidateNodes))
      }
    }

    return {
      isCurrentTabStop,
      context,
      id,
      handleKeydown,
    }
  },
  render() {
    return h(Primitive, {
      'data-destyler-collection-item': '',
      'tabindex': this.isCurrentTabStop ? 0 : -1,
      'data-orientation': this.context.orientation.value,
      'data-active': this.$props.active,
      'data-disabled': !this.focusable || undefined,
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'onMousedown': (event: any) => {
        if (!this.$props.focusable)
          event.preventDefault()
        else this.context.onItemFocus(this.id)
      },
      'onFocus': () => {
        this.context.onItemFocus(this.id)
      },
      'onKeydown': (event: any) => {
        this.handleKeydown(event)
      },
    }, {
      default: () => this.$slots.default?.(),
    })
  },
})
