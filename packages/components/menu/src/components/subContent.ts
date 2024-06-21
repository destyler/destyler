import type { PropType } from 'vue'
import { defineComponent, h, mergeProps, withDirectives, withModifiers } from 'vue'
import { useForwardExpose, useForwardPropsEmits } from '@destyler/composition'
import { DestylerPresence } from '@destyler/presence'
import { BindOnceDirective } from '@destyler/directives'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { SUB_CLOSE_KEYS } from '../utils'
import { injectMenuContext, injectMenuRootContext } from './root'
import { injectMenuSubContext } from './sub'
import { DestylerMenuContentImpl, destylerMenuContentImplProps } from './contentImpl'

const SIDE_OPTIONS = ['top', 'right', 'bottom', 'left'] as const
const ALIGN_OPTIONS = ['start', 'center', 'end'] as const

export type Side = (typeof SIDE_OPTIONS)[number]
export type Align = (typeof ALIGN_OPTIONS)[number]

export const destylerMenuSubContentProps = {
  as: {
    ...destylerMenuContentImplProps.as,
  },
  asChild: {
    ...destylerMenuContentImplProps.asChild,
  },
  sideOffset: {
    ...destylerMenuContentImplProps.sideOffset,
  },
  alignOffset: {
    ...destylerMenuContentImplProps.alignOffset,
  },
  avoidCollisions: {
    ...destylerMenuContentImplProps.avoidCollisions,
  },
  collisionBoundary: {
    ...destylerMenuContentImplProps.collisionBoundary,
  },
  collisionPadding: {
    ...destylerMenuContentImplProps.collisionPadding,
  },
  arrowPadding: {
    ...destylerMenuContentImplProps.arrowPadding,
  },
  sticky: {
    ...destylerMenuContentImplProps.sticky,
  },
  hideWhenDetached: {
    ...destylerMenuContentImplProps.hideWhenDetached,
  },
  updatePositionStrategy: {
    ...destylerMenuContentImplProps.updatePositionStrategy,
  },
  onPlaced: {
    ...destylerMenuContentImplProps.onPlaced,
  },
  prioritizePosition: {
    ...destylerMenuContentImplProps.prioritizePosition,
  },
  loop: {
    ...destylerMenuContentImplProps.loop,
  },
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type DestylerMenuSubContentProps = ExtractPublicPropTypes<typeof destylerMenuSubContentProps>

export const DestylerMenuSubContent = defineComponent({
  name: 'DestylerMenuSubContent',
  props: destylerMenuSubContentProps,
  emits: ['openAutoFocus', 'closeAutoFocus', 'escapeKeyDown', 'pointerDownOutside', 'focusOutside', 'interactOutside', 'dismiss', 'entryFocus'],
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
    return h(DestylerPresence, {
      present: this.forceMount || this.menuContext.open.value,
    }, () => withDirectives(h(DestylerMenuContentImpl, mergeProps(this.forwarded, {
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
