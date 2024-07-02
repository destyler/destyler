import type { PropType } from 'vue'
import { defineComponent, h, onMounted, withDirectives } from 'vue'
import { primitiveProps } from '@destyler/primitive'
import { useForwardExpose } from '@destyler/composition'
import { FocusScope } from '@destyler/focus-scope'
import { DismissableLayer } from '@destyler/dismissable-layer'
import { BindOnceDirective } from '@destyler/directives'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { getOpenState } from '@destyler/shared'

import { injectModalRootContext } from './root'

export const modalContentImplProps = {
  ...primitiveProps,
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  trapFocus: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type ModalContentImplProps = ExtractPublicPropTypes<typeof modalContentImplProps>

export const ModalContentImpl = defineComponent({
  name: 'DestylerModalContentImpl',
  props: modalContentImplProps,
  emits: ['openAutoFocus', 'closeAutoFocus', 'escapeKeyDown', 'pointerDownOutside', 'focusOutside', 'interactOutside', 'dismiss'],
  setup() {
    const rootContext = injectModalRootContext()
    const { forwardRef, currentElement: contentElement } = useForwardExpose()

    onMounted(() => {
      rootContext.contentElement = contentElement
    })

    return {
      rootContext,
      forwardRef,
    }
  },
  render() {
    return h(FocusScope, {
      asChild: true,
      loop: true,
      trapped: this.$props.trapFocus,
      onMountAutoFocus: (event) => {
        this.$emit('openAutoFocus', event)
      },
      onUnmountAutoFocus: (event) => {
        this.$emit('closeAutoFocus', event)
      },
    }, () => withDirectives(h(DismissableLayer, {
      ...this.$attrs,
      'ref': (el: any) => this.forwardRef(el),
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'role': 'Modal',
      'aria-describedby': this.rootContext.descriptionId,
      'aria-labelledby': this.rootContext.titleId,
      'data-state': getOpenState(this.rootContext.open.value),
      'onEscapeKeyDown': (event) => {
        this.$emit('escapeKeyDown', event)
      },
      'onFocusOutside': (event) => {
        this.$emit('focusOutside', event)
      },
      'onInteractOutside': (event) => {
        this.$emit('interactOutside', event)
      },
      'onPointerDownOutside': (event) => {
        this.$emit('pointerDownOutside', event)
      },
    }, () => this.$slots.default?.()), [
      [BindOnceDirective, { id: this.rootContext.contentId }],
    ]))
  },
})
