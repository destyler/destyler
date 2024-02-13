import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps, withDirectives, withModifiers } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { useForwardExpose, useForwardPropsEmits } from '@destyler/composition'
import { DestylerPresence } from '@destyler/presence'
import { BindOnceDirective } from '@destyler/directives'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { SUB_CLOSE_KEYS } from '../utils'
import { injectMenuContext, injectMenuRootContext } from './root'
import { injectMenuSubContext } from './sub'
import { DestylerMenuContentImpl } from './contentImpl'

const SIDE_OPTIONS = ['top', 'right', 'bottom', 'left'] as const
const ALIGN_OPTIONS = ['start', 'center', 'end'] as const

export type Side = (typeof SIDE_OPTIONS)[number]
export type Align = (typeof ALIGN_OPTIONS)[number]

export const destylerMenuSubContentProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'div',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  sideOffset: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
  },
  alignOffset: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
  },
  avoidCollisions: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
  },
  collisionBoundary: {
    type: [Object, Array, null] as PropType<Element | null | Array<Element | null>>,
    required: false,
    default: () => [],
  },
  collisionPadding: {
    type: [Number, Object] as PropType<number | Partial<Record<Side, number>>>,
    required: false,
    default: 0,
  },
  arrowPadding: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
  },
  sticky: {
    type: String as PropType<'partial' | 'always'>,
    required: false,
    default: 'partial',
  },
  hideWhenDetached: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  updatePositionStrategy: {
    type: String as PropType<'optimized' | 'always'>,
    required: false,
    default: 'optimized',
  },
  onPlaced: {
    type: Function as PropType<() => void>,
    required: false,
  },
  prioritizePosition: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
  },
  loop: {
    type: Boolean as PropType<boolean>,
    required: false,
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
    }, withDirectives(h(DestylerMenuContentImpl, mergeProps(this.forwarded, {
      'ref': (el: any) => this.forwardRef(el),
      'align': 'start',
      'side': this.rootContext.dir.value === 'rtl' ? 'left' : 'right',
      'disable-outside-pointer-events': false,
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
    }), {
      default: () => this.$slots.default?.(),
    }), [
      [BindOnceDirective, { id: this.menuSubContext.contentId }],
    ]))
  },
})
