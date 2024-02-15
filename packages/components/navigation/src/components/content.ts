import { type PropType, Teleport, computed, defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useEmitAsProps, useForwardExpose, useMounted } from '@destyler/composition'
import { DestylerPresence } from '@destyler/presence'

import { getOpenState } from '../utils'
import type { PointerDownOutsideEvent } from './contentImpl'
import { DestylerNavigationContentImpl, destylerNavigationContentImplProps } from './contentImpl'
import { injectNavigationContext } from './root'
import { injectNavigationItemContext } from './item'

export const destylerNavigationContentProps = {
  ...destylerNavigationContentImplProps,
  forceMount: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
} as const

export type DestylerNavigationContentProps = ExtractPublicPropTypes<typeof destylerNavigationContentProps>

export const DestylerNavigationContent = defineComponent({
  name: 'DestylerNavigationContent',
  props: destylerNavigationContentProps,
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
    return this.isClientMounted
      ? h(Teleport, {
        to: this.menuContext.viewport.value,
        disabled: !this.menuContext.viewport.value,
      }, {
        default: () => {
          return h(DestylerPresence, {
            present: this.$props.forceMount || this.open || this.isLastActiveValue,
          }, {
            default: () => {
              return h(DestylerNavigationContentImpl, mergeProps(this.$attrs, this.$props, this.emitsAsProps, {
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
              }), {})
            },
          })
        },
      })
      : null
  },
})
