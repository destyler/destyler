import type { Component, PropType } from 'vue'
import { defineComponent, h, onMounted, ref } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive } from '@destyler/primitive'
import { useForwardExpose } from '@destyler/composition'
import { DestylerPopperAnchor } from '@destyler/popper'
import { type ExtractPublicPropTypes, createContext } from '@destyler/shared'

import { injectEllipsisRootContext } from './root'
import { injectEllipsisProviderContext } from './provider'

export type EllipsisTriggerDataState = | 'closed' | 'delayed-open' | 'instant-open'

export const destylerEllipsisTriggerProps = {
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'span',
  },
} as const

export type DestylerEllipsisTriggerProps = ExtractPublicPropTypes<typeof destylerEllipsisTriggerProps>

export interface EllipsisTriggerContent {
  text: string
}

export const [injectEllipsisTriggerContext, provideEllipsisTriggerContext] = createContext<EllipsisTriggerContent>('DestylerEllipsisTriggerContent')

export const DestylerEllipsisTrigger = defineComponent({
  name: 'DestylerEllipsisTrigger',
  props: destylerEllipsisTriggerProps,
  setup(_) {
    const rootContext = injectEllipsisRootContext()
    const providerContext = injectEllipsisProviderContext()

    const { forwardRef, currentElement: triggerElement } = useForwardExpose()

    const isPointerDown = ref(false)
    const hasPointerMoveOpened = ref(false)

    function handlePointerUp() {
      isPointerDown.value = false
    }

    function handlePointerDown() {
      isPointerDown.value = true
      document.addEventListener('pointerup', handlePointerUp, { once: true })
    }

    onMounted(() => {
      rootContext.onTriggerChange(triggerElement.value)
      rootContext.onSetText(triggerElement.value?.textContent ?? '')
    })

    return {
      rootContext,
      providerContext,
      forwardRef,
      isPointerDown,
      hasPointerMoveOpened,
      handlePointerDown,
    }
  },
  render() {
    return h(DestylerPopperAnchor, {
      asChild: true,
    }, () => h(DestylerPrimitive, {
      'ref': (el: any) => this.forwardRef(el),
      'aria-describedby': this.rootContext.open.value ? this.rootContext.contentId : undefined,
      'data-state': this.rootContext.stateAttribute.value,
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'style': {
        'white-space': 'nowrap',
        'display': 'inline-block',
        'vertical-align': 'bottom',
        'text-overflow': 'ellipsis',
        'overflow': 'hidden',
      },
      'onPointermove': (event: any) => {
        if (event.pointerType === 'touch')
          return
        if (!this.hasPointerMoveOpened && !this.providerContext.isPointerInTransitRef.value) {
          this.rootContext.onTriggerEnter()
          this.hasPointerMoveOpened = true
        }
      },
      'onPointerleave': () => {
        this.rootContext.onTriggerLeave()
        this.hasPointerMoveOpened = false
      },
      'onPointerdown': () => {
        this.handlePointerDown()
      },
      'onFocus': () => {
        if (!this.isPointerDown)
          this.rootContext.onOpen()
      },
      'onBlur': () => {
        this.rootContext.onClose()
      },
      'onClick': () => {
        if (!this.rootContext.disableClosingTrigger.value)
          this.rootContext.onClose()
      },
    }, () => this.$slots.default?.()))
  },
})
