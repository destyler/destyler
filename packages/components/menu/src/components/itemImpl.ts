import type { PropType } from 'vue'
import { defineComponent, h, nextTick, ref } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { isMouseEvent } from '@destyler/shared'
import { Primitive, primitiveProps } from '@destyler/primitive'

import { injectMenuContentContext } from './contentImpl'

export const menuItemImplProps = {
  ...primitiveProps,
  /**
   * When `true`, prevents the user from interacting with the item.
   */
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  /**
   * Optional text used for typeahead purposes. By default the typeahead behavior will use the `.textContent` of the item. <br>
   * Use this when the content is complex, or you have non-textual content inside.
   */
  textValue: {
    type: String as PropType<string>,
    required: false,
  },
} as const

export type MenuItemImplProps = ExtractPublicPropTypes<typeof menuItemImplProps>

export const MenuItemImpl = defineComponent({
  name: 'DestylerMenuItemImpl',
  props: menuItemImplProps,
  setup(props) {
    const contentContext = injectMenuContentContext()

    const isFocused = ref(false)

    async function handlePointerMove(event: PointerEvent) {
      if (event.defaultPrevented)
        return
      if (!isMouseEvent(event))
        return

      if (props.disabled) {
        contentContext.onItemLeave(event)
      }
      else {
        const defaultPrevented = contentContext.onItemEnter(event)
        if (!defaultPrevented) {
          const item = event.currentTarget;
          (item as HTMLElement)?.focus()
        }
      }
    }

    async function handlePointerLeave(event: PointerEvent) {
      await nextTick()
      if (event.defaultPrevented)
        return
      if (!isMouseEvent(event))
        return

      contentContext.onItemLeave(event)
    }

    return {
      contentContext,
      isFocused,
      handlePointerMove,
      handlePointerLeave,
    }
  },
  render() {
    return h(Primitive, {
      'role': 'menuitem',
      'tabindex': -1,
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'data-destyler-collection-item': '',
      'aria-disabled': this.$props.disabled || undefined,
      'data-disabled': this.$props.disabled ? '' : undefined,
      'data-highlighted': this.isFocused ? '' : undefined,
      'onPointermove': (event: any) => {
        this.handlePointerMove(event)
      },
      'onPointerleave': (event: any) => {
        this.handlePointerLeave(event)
      },
      'onFocus': async (event: any) => {
        await nextTick()
        if (event.defaultPrevented || this.$props.disabled)
          return
        this.isFocused = true
      },
      'onBlur': async (event: any) => {
        await nextTick()
        if (event.defaultPrevented)
          return
        this.isFocused = false
      },
    }, () => this.$slots.default?.())
  },
})
