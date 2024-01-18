import type { PropType } from 'vue'
import { defineComponent, h, onMounted, withDirectives } from 'vue'
import { destylerPrimitiveProps } from '@destyler/primitive'
import { useCustomElement } from '@destyler/composition'
import { DestylerFocusScope } from '@destyler/focus-scope'
import { DestylerDismissableLayer } from '@destyler/dismissable-layer'
import { BindOnceDirective } from '@destyler/directives'

import { injectDialogRootContext } from './dialogRoot'
import { getOpenState } from './utils'

export const destylerDialogContentImplProps = {
  ...destylerPrimitiveProps,
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  trapFocus: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
}

export const DestylerDialogContentImpl = defineComponent({
  name: 'DestylerDialogContentImpl',
  props: destylerDialogContentImplProps,
  emits: ['openAutoFocus', 'closeAutoFocus', 'escapeKeyDown', 'pointerDownOutside', 'focusOutside', 'interactOutside', 'dismiss'],
  setup() {
    const rootContext = injectDialogRootContext()
    const { customElement, currentElement: contentElement } = useCustomElement()

    onMounted(() => {
      rootContext.contentElement = contentElement
    })

    return {
      rootContext,
      customElement,
    }
  },
  render() {
    return h(DestylerFocusScope, {
      asChild: true,
      loop: true,
      trapped: this.$props.trapFocus,
      onMountAutoFocus: (event) => {
        this.$emit('openAutoFocus', event)
      },
      onUnmountAutoFocus: (event) => {
        this.$emit('closeAutoFocus', event)
      },
    }, withDirectives(h(DestylerDismissableLayer, {
      'ref': 'customElement',
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'role': 'dialog',
      'aria-describedby': this.rootContext.descriptionId,
      'aria-labelledby': this.rootContext.titleId,
      'data-state': getOpenState(this.rootContext.open.value),
      'onDismiss': () => {
        this.rootContext.onOpenChange(false)
      },
      'onEscapeKeyDown': (event) => {
        this.$emit('escapeKeyDown', event)
      },
      'onFocusOutside': (event) => {
        this.$emit('focusOutside', event)
      },
      'onInteractOutside': (event) => {
        this.$emit('interactOutside', event)
      },
      'onPoInterDownOutside': (event) => {
        this.$emit('pointerDownOutside', event)
      },
    }, this.$slots.default?.()), [
      [BindOnceDirective, { id: this.rootContext.contentId }],
    ]))
  },
})
