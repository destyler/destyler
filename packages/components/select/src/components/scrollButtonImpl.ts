import type { SlotsType, VNode } from 'vue'
import { defineComponent, h, mergeProps, onBeforeUnmount, ref, watchEffect } from 'vue'
import { useCollection } from '@destyler/composition'
import { Primitive } from '@destyler/primitive'

import { SelectContentDefaultContextValue, injectSelectContentContext } from './contentImpl'

export const scrollSelectButtonImplEmits = {
  autoScroll: () => true,
}

export const ScrollSelectButtonImpl = defineComponent({
  name: 'DestylerSelectButtonImpl',
  emits: scrollSelectButtonImplEmits,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup(_, { emit }) {
    const { injectCollection } = useCollection()

    const collectionItems = injectCollection()
    const contentContext = injectSelectContentContext(SelectContentDefaultContextValue)
    const autoScrollTimerRef = ref<number | null>(null)

    function clearAutoScrollTimer() {
      if (autoScrollTimerRef.value !== null) {
        window.clearInterval(autoScrollTimerRef.value)
        autoScrollTimerRef.value = null
      }
    }

    watchEffect(() => {
      const activeItem = collectionItems.value.find(
        item => item === document.activeElement,
      )
      activeItem?.scrollIntoView({ block: 'nearest' })
    })

    function handlePointerDown() {
      if (autoScrollTimerRef.value === null) {
        autoScrollTimerRef.value = window.setInterval(() => {
          emit('autoScroll')
        }, 50)
      }
    }

    function handlePointerMove() {
      contentContext.onItemLeave?.()
      if (autoScrollTimerRef.value === null) {
        autoScrollTimerRef.value = window.setInterval(() => {
          emit('autoScroll')
        }, 50)
      }
    }

    onBeforeUnmount(() => clearAutoScrollTimer())

    return {
      handlePointerDown,
      handlePointerMove,
      clearAutoScrollTimer,
    }
  },
  render() {
    return h(Primitive, mergeProps(
      { ...this.$parent?.$props },
      {
        'aria-hidden': '',
        'style': {
          flexShrink: 0,
        },
        'onPointerdown': () => {
          this.handlePointerDown()
        },
        'onPointermove': () => {
          this.handlePointerMove()
        },
        'onPointerleave': () => {
          this.clearAutoScrollTimer()
        },
      },
    ), () => this.$slots.default?.())
  },
})
