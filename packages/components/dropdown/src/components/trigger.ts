import type { PropType } from 'vue'
import { defineComponent, h, nextTick, onMounted, withDirectives, withModifiers } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { MenuAnchor } from '@destyler/menu'
import { BindOnceDirective } from '@destyler/directives'

import { injectDropdownMenuRootContext } from './root'

export const dropdownTriggerProps = {
  ...primitiveProps,
  /**
   * @default button
   */
  as: {
    ...primitiveProps.as,
    default: 'button',
  },
  /**
   * When `true`, prevents the user from interacting with item
   */
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type DropdownTriggerProps = ExtractPublicPropTypes<typeof dropdownTriggerProps>

export const DropdownTrigger = defineComponent({
  name: 'DestylerDropdownTrigger',
  props: dropdownTriggerProps,
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
    return h(MenuAnchor, {
      asChild: true,
    }, () => withDirectives(h(Primitive, {
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
