import type { PropType } from 'vue'
import { defineComponent, h, mergeProps, withDirectives, withModifiers } from 'vue'
import { useForwardExpose, useForwardPropsEmits } from '@destyler/composition'
import { Presence } from '@destyler/presence'
import { BindOnceDirective } from '@destyler/directives'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { SUB_CLOSE_KEYS } from '../utils'
import { injectMenuContext, injectMenuRootContext } from './root'
import { injectMenuSubContext } from './sub'
import { MenuContentImpl, menuContentImplProps } from './contentImpl'

const SIDE_OPTIONS = ['top', 'right', 'bottom', 'left'] as const
const ALIGN_OPTIONS = ['start', 'center', 'end'] as const

export type Side = (typeof SIDE_OPTIONS)[number]
export type Align = (typeof ALIGN_OPTIONS)[number]

export const menuSubContentProps = {
  as: {
    ...menuContentImplProps.as,
  },
  asChild: {
    ...menuContentImplProps.asChild,
  },
  sideOffset: {
    ...menuContentImplProps.sideOffset,
  },
  alignOffset: {
    ...menuContentImplProps.alignOffset,
  },
  avoidCollisions: {
    ...menuContentImplProps.avoidCollisions,
  },
  collisionBoundary: {
    ...menuContentImplProps.collisionBoundary,
  },
  collisionPadding: {
    ...menuContentImplProps.collisionPadding,
  },
  arrowPadding: {
    ...menuContentImplProps.arrowPadding,
  },
  sticky: {
    ...menuContentImplProps.sticky,
  },
  hideWhenDetached: {
    ...menuContentImplProps.hideWhenDetached,
  },
  updatePositionStrategy: {
    ...menuContentImplProps.updatePositionStrategy,
  },
  prioritizePosition: {
    ...menuContentImplProps.prioritizePosition,
  },
  loop: {
    ...menuContentImplProps.loop,
  },
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type MenuSubContentProps = ExtractPublicPropTypes<typeof menuSubContentProps>

export const MenuSubContent = defineComponent({
  name: 'DestylerMenuSubContent',
  props: menuSubContentProps,
  emits: ['escapeKeyDown', 'pointerDownOutside', 'focusOutside', 'interactOutside', 'entryFocus', 'openAutoFocus', 'closeAutoFocus', 'dismiss'],
  setup(props, { emit }) {
    const forwarded = useForwardPropsEmits(props, emit)

    const menuContext = injectMenuContext()
    const rootContext = injectMenuRootContext()
    const menuSubContext = injectMenuSubContext()

    const { forwardRef, currentElement: subContentElement } = useForwardExpose()

    return {
      forwarded,
      menuContext,
      rootContext,
      menuSubContext,
      forwardRef,
      subContentElement,
    }
  },
  render() {
    return h(Presence, {
      present: this.forceMount || this.menuContext.open.value,
    }, () => withDirectives(h(MenuContentImpl, mergeProps(this.forwarded, {
      'ref': (el: any) => this.forwardRef(el),
      'align': 'start',
      'side': this.rootContext.dir.value === 'rtl' ? 'left' : 'right',
      'disableOutsidePointerEvents': false,
      'disable-outside-scroll': false,
      'trap-focus': false,
      'onOpenAutoFocus': withModifiers(() => {
        if (this.rootContext.isUsingKeyboardRef.value)
          this.subContentElement?.focus()
      }, ['prevent']),
      'onFocusOutside': (event: any) => {
        if (event.defaultPrevented)
          return
        if (event.target !== this.menuSubContext.trigger.value)
          this.menuContext.onOpenChange(false)
      },
      'onEscapeKeyDown': (event: any) => {
        this.rootContext.onClose()
        event.preventDefault()
      },
      'onKeydown': (event: KeyboardEvent) => {
        const isKeyDownInside = (event.currentTarget as HTMLElement)?.contains(event.target as HTMLElement)
        const isCloseKey = SUB_CLOSE_KEYS[this.rootContext.dir.value].includes(event.key)
        if (isKeyDownInside && isCloseKey) {
          this.menuContext.onOpenChange(false)
          this.menuSubContext.trigger.value?.focus()
          event.preventDefault()
        }
      },
    }), () => this.$slots.default?.()), [
      [BindOnceDirective, { id: this.menuSubContext.contentId }],
    ]))
  },
})
