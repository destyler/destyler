import type { PropType } from 'vue'
import { computed, defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useEmitAsProps, useForwardExpose, useMounted } from '@destyler/composition'
import { Presence } from '@destyler/presence'
import { TeleportPrimitive } from '@destyler/teleport'

import { getOpenState, whenMouse } from '../utils'
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
  inheritAttrs: false,
  props: navigationContentProps,
  emits: navigationContentEmits,

  setup(_, { emit }) {
    const emitsAsProps = useEmitAsProps(emit)
    const { forwardRef } = useForwardExpose()

    const isClientMounted = useMounted()
    const menuContext = injectNavigationContext()
    const itemContext = injectNavigationItemContext()

    const open = computed(() => itemContext.value === menuContext.modelValue.value)

    const isLastActiveValue = computed(() => {
      if (menuContext.viewport.value) {
        if (!menuContext.modelValue.value && menuContext.previousValue.value)
          return (menuContext.previousValue.value === itemContext.value)
      }
      return false
    })
    return {
      menuContext,
      isClientMounted,
      open,
      isLastActiveValue,
      emitsAsProps,
      itemContext,
      forwardRef,
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
        'onPointerleave': (event: any) => {
          whenMouse(() => this.menuContext.onContentLeave())(event)
        },
        'onPointerDownOutside': (event: any) => {
          this.$emit('pointerDownOutside', event)
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
