import type { SlotsType, VNode } from 'vue'
import { defineComponent, h, mergeProps, nextTick, ref } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { ITEM_SELECT, SELECTION_KEYS } from '../utils'
import { MenuItemImpl, menuItemImplProps } from './itemImpl'
import { injectMenuContentContext } from './contentImpl'
import { injectMenuRootContext } from './root'

export const menuItemProps = {
  ...menuItemImplProps,
} as const

export type MenuItemProps = ExtractPublicPropTypes<typeof menuItemProps>

export const menuItemEmits = {
  select: (_event: Event) => true,
}

export const MenuItem = defineComponent({
  name: 'DestylerMenuItem',
  props: menuItemProps,
  emits: menuItemEmits,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup(props, { emit }) {
    const { forwardRef, currentElement } = useForwardExpose()
    const rootContext = injectMenuRootContext()
    const contentContext = injectMenuContentContext()

    const isPointerDownRef = ref(false)

    async function handleSelect() {
      const menuItem = currentElement.value
      if (!props.disabled && menuItem) {
        const itemSelectEvent = new CustomEvent(ITEM_SELECT, {
          bubbles: true,
          cancelable: true,
        })
        emit('select', itemSelectEvent)
        await nextTick()
        if (itemSelectEvent.defaultPrevented)
          isPointerDownRef.value = false
        else rootContext.onClose()
      }
    }

    return {
      forwardRef,
      contentContext,
      isPointerDownRef,
      handleSelect,
    }
  },
  render() {
    return h(MenuItemImpl, mergeProps(this.$props, {
      ref: (el: any) => this.forwardRef(el),
      onClick: () => {
        this.handleSelect()
      },
      onPointerdown: () => {
        this.isPointerDownRef = true
      },
      onPointerup: async (event: any) => {
        await nextTick()
        if (event.defaultPrevented)
          return
        if (!this.isPointerDownRef)
          event.currentTarget?.click()
      },
      onKeydown: async (event: any) => {
        const isTypingAhead = this.contentContext.searchRef.value !== ''
        if (this.$props.disabled || (isTypingAhead && event.key === ' '))
          return
        if (SELECTION_KEYS.includes(event.key)) {
          event.currentTarget.click()
          event.preventDefault()
        }
      },
    }), () => this.$slots.default?.())
  },
})
