import type { Component, PropType } from 'vue'
import { defineComponent, h, mergeProps, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { getScrollParent, isDocument, unwrapElement } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

export const destylerBackTopProps = {
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'button',
  },
  listen: {
    type: [String, Object, Function] as PropType<string | HTMLElement | Document | (() => HTMLElement | Document)>,
    required: false,
    default: undefined,
  },
} as const

export type DestylerbackTopProps = ExtractPublicPropTypes<typeof destylerBackTopProps>

export const DestylerBackTop = defineComponent({
  name: 'DestylerBackTop',
  props: destylerBackTopProps,
  setup(props) {
    const scrollTop = ref<number | null>(null)
    const DomInfoReady = ref<boolean>(false)
    let scrollElement: HTMLElement | Document
    let scrollListenerRegistered: boolean

    const { forwardRef, currentElement } = useForwardExpose()

    function init(): void {
      if (scrollListenerRegistered)
        return
      scrollListenerRegistered = true
      const scrollEl = unwrapElement(props.listen) || getScrollParent(currentElement.value)
      if (!scrollEl)
        return

      scrollElement = scrollEl === document.documentElement ? document : scrollEl

      scrollElement.addEventListener('scroll', handleScroll)
      handleScroll()
    }

    function handleScroll(): void {
      scrollTop.value = (isDocument(scrollElement) ? document.documentElement : scrollElement).scrollTop
      if (!DomInfoReady.value) {
        void nextTick(() => {
          DomInfoReady.value = true
        })
      }
    }

    function handleClick(): void {
      (isDocument(scrollElement)
        ? document.documentElement
        : scrollElement
      ).scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }

    onMounted(() => {
      init()
    })

    onBeforeUnmount(() => {
      if (scrollElement)
        scrollElement.removeEventListener('scroll', handleScroll)
    })

    return {
      forwardRef,
      handleClick,
    }
  },
  render() {
    return h(DestylerPrimitive, mergeProps(this.$props, this.$attrs, {
      ref: (el: any) => this.forwardRef(el),
      onClick: () => {
        this.handleClick()
      },
    }), {
      default: () => this.$slots.default?.(),
    })
  },
})
