import type { PropType } from 'vue'
import { defineComponent, h, mergeProps, onMounted, withDirectives } from 'vue'
import { useForwardExpose, useId } from '@destyler/composition'
import { FocusScope } from '@destyler/focus-scope'
import { DismissableLayer } from '@destyler/dismissable-layer'
import { dismissableLayerEmits, dismissableLayerProps } from '@destyler/dismissable-layer/component'
import { BindOnceDirective } from '@destyler/directives'
import { getOpenState } from '@destyler/shared'

import { injectDialogRootContext } from './root'

export const dialogContentImplProps = {
  ...dismissableLayerProps,
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

export const dialogContentImplEmtis = {
  ...dismissableLayerEmits,
  openAutoFocus: (_event: Event) => true,
  closeAutoFocus: (_event: Event) => true,
}

export const DialogContentImpl = defineComponent({
  name: 'DestylerDialogContentImpl',
  props: dialogContentImplProps,
  emits: dialogContentImplEmtis,

  setup() {
    const rootContext = injectDialogRootContext()
    const { forwardRef, currentElement: contentElement } = useForwardExpose()

    rootContext.titleId ||= useId(undefined, 'destyler-dialog-title')
    rootContext.descriptionId ||= useId(undefined, 'destyler-dialog-description')

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
    }, () => withDirectives(h(DismissableLayer, mergeProps(this.$attrs, {
      'ref': (el: any) => this.forwardRef(el),
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'disableOutsidePointerEvents': this.$props.disableOutsidePointerEvents,
      'role': 'dialog',
      'aria-describedby': this.rootContext.descriptionId,
      'aria-labelledby': this.rootContext.titleId,
      'data-state': getOpenState(this.rootContext.open.value),
      'isDismissable': true,
      'onDismiss': () => {
        this.rootContext.onOpenChange(false)
      },
      'onEscapeKeyDown': (event: any) => {
        this.$emit('escapeKeyDown', event)
      },
      'onFocusOutside': (event: any) => {
        this.$emit('focusOutside', event)
      },
      'onInteractOutside': (event: any) => {
        this.$emit('interactOutside', event)
      },
      'onPointerDownOutside': (event: any) => {
        this.$emit('pointerDownOutside', event)
      },
    }), () => this.$slots.default?.()), [
      [BindOnceDirective, { id: this.rootContext.contentId }],
    ]))
  },
})
