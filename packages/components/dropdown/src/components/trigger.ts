import type { Component, PropType } from 'vue'
import { defineComponent, h, nextTick, onMounted, withDirectives, withModifiers } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { DestylerMenuAnchor } from '@destyler/menu'
import { BindOnceDirective } from '@destyler/directives'

import { injectDropdownMenuRootContext } from './root'

export const destylerDropdownTriggerProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'button',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type DestylerDropdownTriggerProps = ExtractPublicPropTypes<typeof destylerDropdownTriggerProps>

export const DestylerDropdownTrigger = defineComponent({
  name: 'DestylerDropdownTrigger',
  props: destylerDropdownTriggerProps,
  setup() {
    const rootContext = injectDropdownMenuRootContext()

    const { forwardRef, currentElement: triggerElement } = useForwardExpose()

    onMounted(() => {
      rootContext.triggerElement = triggerElement
    })

    return {
      forwardRef,
      rootContext,
    }
  },
  render() {
    return h(DestylerMenuAnchor, {
      asChild: true,
    }, () => withDirectives(h(DestylerPrimitive, {
      'ref': (el: any) => this.forwardRef(el),
      'type': this.$props.as === 'button' ? 'button' : undefined,
      'asChild': this.$props.asChild,
      'as': this.$props.as,
      'aria-haspopup': 'menu',
      'aria-expanded': this.rootContext.open.value,
      'aria-controls': this.rootContext.open.value ? this.rootContext.contentId : undefined,
      'data-disabled': this.$props.disabled ? '' : undefined,
      'disabled': this.$props.disabled,
      'data-state': this.rootContext.open.value ? 'open' : 'closed',
      'onPointerdown': async (event: any) => {
        if (!this.$props.disabled && event.button === 0 && event.ctrlKey === false) {
          this.rootContext?.onOpenToggle()
          await nextTick()
          if (this.rootContext.open.value)
            event.preventDefault()
        }
      },
      'onKeydown': withModifiers((event: any) => {
        if (this.$props.disabled)
          return
        if (['Enter', ' '].includes(event.key))
          this.rootContext.onOpenToggle()
        if (event.key === 'ArrowDown')
          this.rootContext.onOpenChange(true)
        if (['Enter', ' ', 'ArrowDown'].includes(event.key))
          event.preventDefault()
      }, ['enter', 'space', 'arrow-down']),
    }, () => this.$slots.default?.()), [
      [BindOnceDirective, { id: this.rootContext.triggerId }],
    ]))
  },
})
