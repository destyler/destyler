import { defineComponent, h, onMounted } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import { PopperAnchor } from '@destyler/popper'
import { useForwardExpose } from '@destyler/composition'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectPopoverRootContext } from './root'

export const popoverTriggerProps = {
  ...primitiveProps,
  /**
   * @default button
   */
  as: {
    ...primitiveProps.as,
    default: 'button',
  },
} as const

export type PopoverTriggerProps = ExtractPublicPropTypes<typeof popoverTriggerProps>

export const PopoverTrigger = defineComponent({
  name: 'DestylerPopoverTrigger',
  props: popoverTriggerProps,
  setup() {
    const rootContext = injectPopoverRootContext()

    const { forwardRef, currentElement: triggerElement } = useForwardExpose()

    onMounted(() => {
      rootContext.triggerElement.value = triggerElement.value
    })

    return {
      rootContext,
      forwardRef,
    }
  },
  render() {
    return h(this.rootContext.hasCustomAnchor.value ? Primitive : PopperAnchor, {
      asChild: true,
    }, () => h(Primitive, {
      'ref': (el: any) => this.forwardRef(el),
      'type': this.$props.as === 'button' ? 'button' : undefined,
      'as': this.$props.as,
      'aria-haspopup': 'dialog',
      'asChild': this.$props.asChild,
      'aria-expanded': this.rootContext.open.value,
      'aria-controls': this.rootContext.contentId,
      'data-state': this.rootContext.open.value ? 'open' : 'closed',
      'onClick': () => {
        this.rootContext.onOpenToggle()
      },
    }, () => this.$slots.default?.()))
  },
})
