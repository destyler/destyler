import type { PropType, SlotsType, VNode } from 'vue'
import { computed, defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useEmitAsProps, useForwardExpose, useMounted } from '@destyler/composition'
import { Presence } from '@destyler/presence'
import { TeleportPrimitive } from '@destyler/teleport'

import { getOpenState } from '../utils'
import type { PointerDownOutsideEvent } from './contentImpl'
import { NavigationContentImpl, navigationContentImplEmits, navigationContentImplProps } from './contentImpl'
import { injectNavigationContext } from './root'
import { injectNavigationItemContext } from './item'

export const navigationContentProps = {
  ...navigationContentImplProps,
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type NavigationContentProps = ExtractPublicPropTypes<typeof navigationContentProps>

export const navigationContentEmits = {
  ...navigationContentImplEmits,
}

export const NavigationContent = defineComponent({
  name: 'DestylerNavigationContent',
  props: navigationContentProps,
  emits: navigationContentEmits,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup(_, { emit }) {
    const emitsAsProps = useEmitAsProps(emit)
    const { forwardRef } = useForwardExpose()

    const isClientMounted = useMounted()
    const menuContext = injectNavigationContext()
    const itemContext = injectNavigationItemContext()

    const open = computed(() => itemContext.value === menuContext.modelValue.value)

    const isLastActiveValue = computed(() => {
      if (!menuContext.modelValue.value && menuContext.previousValue.value)
        return (menuContext.previousValue.value === itemContext.value)
      return false
    })

    function handlePointerDown(ev: PointerDownOutsideEvent) {
      emit('pointerDownOutside', ev)
      if (!ev.preventDefault)
        menuContext.onContentLeave()
    }
    return {
      menuContext,
      isClientMounted,
      open,
      isLastActiveValue,
      emitsAsProps,
      itemContext,
      forwardRef,
      handlePointerDown,
    }
  },
  render() {
    if (this.isClientMounted) {
      return h(TeleportPrimitive, {
        to: this.menuContext.viewport.value,
        disabled: !this.menuContext.viewport.value,
      }, () => h(Presence, {
        present: this.$props.forceMount || this.open || this.isLastActiveValue,
      }, () => h(NavigationContentImpl, mergeProps(this.$attrs, this.$props, this.emitsAsProps, {
        'ref': (el: any) => this.forwardRef(el),
        'data-state': getOpenState(this.open),
        'style': {
          pointerEvents: !this.open && this.menuContext.isRootMenu ? 'none' : undefined,
        },
        'onPointerenter': () => {
          this.menuContext.onContentEnter(this.itemContext.value)
        },
        'onPointerleave': () => {
          this.menuContext.onContentLeave()
        },
        'onPointerdown': (event: any) => {
          this.handlePointerDown(event)
        },
        'onFocusOutside': (event: any) => {
          this.$emit('focusOutside', event)
        },
        'onInteractOutside': (event: any) => {
          this.$emit('interactOutside', event)
        },
      }), () => this.$slots.default?.())))
    }
  },
})
