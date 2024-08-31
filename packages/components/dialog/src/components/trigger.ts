import { defineComponent, h, mergeProps, onMounted } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import { useForwardExpose, useId } from '@destyler/composition'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectDialogRootContext } from './root'

export const dialogTriggerProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'button',
  },
} as const

export type DialogTriggerProps = ExtractPublicPropTypes<typeof dialogTriggerProps>

export const DialogTrigger = defineComponent({
  name: 'DestylerDialogTrigger',
  props: dialogTriggerProps,

  setup() {
    const rootContext = injectDialogRootContext()
    const { forwardRef, currentElement } = useForwardExpose()

    rootContext.contentId ||= useId(undefined, 'destyler-dialog-content')
    onMounted(() => {
      rootContext.triggerElement = currentElement
    })

    return {
      rootContext,
      forwardRef,
    }
  },
  render() {
    return h(Primitive, mergeProps(this.$attrs, this.$props, {
      'ref': (el: any) => this.forwardRef(el),
      'type': this.$props.as === 'button' ? 'button' : undefined,
      'aria-haspopup': 'dialog',
      'aria-expanded': this.rootContext.open.value || false,
      'aria-controls': this.rootContext.open.value ? this.rootContext.contentId : undefined,
      'data-state': this.rootContext.open.value ? 'open' : 'closed',
      'onClick': () => {
        this.rootContext.onOpenToggle()
      },
    }), () => this.$slots.default?.())
  },
})
