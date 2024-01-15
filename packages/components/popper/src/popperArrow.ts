import type { Component, PropType } from 'vue'
import { computed, defineComponent, h, mergeProps } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { destylerPrimitiveProp } from '@destyler/primitive'
import { DestylerArrow, destylerArrowProps } from '@destyler/arrow'
import { injectPopperContentContext } from './popperContent'
import type { Side } from './utils'

export const OPPOSITE_SIDE: Record<Side, Side> = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
}

export const destylerPopperArrowProps = {
  ...destylerPrimitiveProp,
  ...destylerArrowProps,
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'svg',
  },
}

export const DestylerPopperArrow = defineComponent({
  name: 'DestylerPopperArrow',
  inheritAttrs: false,
  props: destylerPopperArrowProps,
  setup() {
    const contentContext = injectPopperContentContext()

    const baseSide = computed(() => OPPOSITE_SIDE[contentContext.placedSide.value])

    return {
      contentContext,
      baseSide,
    }
  },
  render() {
    return h('span', {
      ref: (el: any) => {
        this.contentContext.onArrowChange(el)
        return undefined
      },
      style: {
        position: 'absolute',
        left: this.contentContext.arrowX?.value ? `${this.contentContext.arrowX?.value}px` : undefined,
        top: this.contentContext.arrowY?.value ? `${this.contentContext.arrowY?.value}px` : undefined,
        [this.baseSide]: 0,
        transformOrigin: {
          top: '',
          right: '0 0',
          bottom: 'center 0',
          left: '100% 0',
        }[this.contentContext.placedSide.value],
        transform: {
          top: 'translateY(100%)',
          right: 'translateY(50%) rotate(90deg) translateX(-50%)',
          bottom: `rotate(180deg)`,
          left: 'translateY(50%) rotate(-90deg) translateX(50%)',
        }[this.contentContext.placedSide.value],
        visibility: this.contentContext.shouldHideArrow.value ? 'hidden' : undefined,
      },
    }, h(DestylerArrow, mergeProps(this.$attrs, {
      as: this.$props.as,
      asChild: this.$props.asChild,
      width: this.$props.width,
      height: this.$props.height,
      style: {
        display: 'block',
      },
    }), this.$slots.default?.()))
  },
})
