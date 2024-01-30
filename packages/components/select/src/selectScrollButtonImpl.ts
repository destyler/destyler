import { defineComponent, h, onBeforeUnmount, ref, watchEffect } from 'vue'
import { useCollection } from '@destyler/composition'
import { DestylerPrimitive } from '@destyler/primitive'

import { SelectContentDefaultContextValue, injectSelectContentContext } from './selectContentImpl'

export const DestylerScrollSelectButtonImpl = defineComponent({
  name: 'DestylerSelectButtonImpl',
  emits: ['autoScroll'],
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
    return h(DestylerPrimitive, {
      ...this.$parent?.$props,
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
    }, this.$slots.default?.())
  },
})
