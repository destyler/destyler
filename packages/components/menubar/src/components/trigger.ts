import type { PropType, SlotsType, VNode } from 'vue'
import { computed, defineComponent, h, onMounted, ref, withDirectives, withModifiers } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { RovingFocusItem } from '@destyler/roving-focus'
import { MenuAnchor } from '@destyler/menu'
import { BindOnceDirective } from '@destyler/directives'

import { injectMenubarRootContext } from './root'
import { injectMenubarMenuContext } from './menu'

export const menubarTriggerProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'button',
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type MenubarTriggerProps = ExtractPublicPropTypes<typeof menubarTriggerProps>

export const MenubarTrigger = defineComponent({
  name: 'DestylerMenubarTrigger',
  props: menubarTriggerProps,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup() {
    const rootContext = injectMenubarRootContext()
    const menuContext = injectMenubarMenuContext()

    const { forwardRef, currentElement: triggerElement } = useForwardExpose()

    const isFocused = ref(false)

    const open = computed(() => rootContext.modelValue.value === menuContext.value)

    onMounted(() => {
      menuContext.triggerElement = triggerElement
    })

    return {
      forwardRef,
      isFocused,
      menuContext,
      rootContext,
      triggerElement,
      open,
    }
  },
  render() {
    return h(RovingFocusItem, {
      asChild: true,
      focusable: !this.$props.disabled,
      tabStopId: this.menuContext.value,
    }, () => h(MenuAnchor, {
      asChild: true,
    }, () => withDirectives(h(Primitive, {
      'ref': (el: any) => this.forwardRef(el),
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'type': this.$props.as === 'button' ? 'button' : undefined,
      'role': 'menuitem',
      'aria-haspopup': 'menu',
      'aria-expanded': 'open',
      'aria-controls': this.open ? this.menuContext.contentId : undefined,
      'data-highlighted': this.isFocused ? '' : undefined,
      'data-state': this.open ? 'open' : 'closed',
      'data-disabled': this.$props.disabled ? '' : undefined,
      'disabled': this.$props.disabled,
      'data-value': this.menuContext.value,
      'data-destyler-collection-item': '',
      'onPointerdown': (event: any) => {
        if (!this.$props.disabled && event.button === 0 && event.ctrlKey === false) {
          this.rootContext.onMenuOpen(this.menuContext.value)
          if (!this.open)
            event.preventDefault()
        }
      },
      'onPointerenter': () => {
        const menubarOpen = Boolean(this.rootContext.modelValue.value)
        if (menubarOpen && !this.open) {
          this.rootContext.onMenuOpen(this.menuContext.value)
          this.triggerElement?.focus()
        }
      },
      'onFocus': () => {
        this.isFocused = true
      },
      'onBlur': () => {
        this.isFocused = false
      },
      'onKeydown': withModifiers((event: any) => {
        if (this.$props.disabled)
          return
        if (['Enter', ' '].includes(event.key))
          this.rootContext.onMenuToggle(this.menuContext.value)
        if (event.key === 'ArrowDown')
          this.rootContext.onMenuOpen(this.menuContext.value)
        if (['Enter', ' ', 'ArrowDown'].includes(event.key)) {
          this.menuContext.wasKeyboardTriggerOpenRef.value = true
          event.preventDefault()
        }
      }, ['enter', 'space', 'arrow-down']),
    }, () => this.$slots.default?.()), [
      [BindOnceDirective, { id: this.menuContext.triggerId }],
    ])))
  },
})
