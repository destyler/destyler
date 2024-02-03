import type { Component, PropType } from 'vue'
import { computed, defineComponent, h, mergeProps, nextTick, onMounted, ref, watch, withDirectives } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive } from '@destyler/primitive'
import { useCustomElement } from '@destyler/composition'
import { DestylerPresence } from '@destyler/presence'
import { BindOnceDirective } from '@destyler/directives'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectCollapsibleRootContext } from './root'

const destylerPrimitivePropsProps = {
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
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type DestylerPrimitivePropsProps = ExtractPublicPropTypes<typeof destylerPrimitivePropsProps>

export const DestylerCollapsibleContent = defineComponent({
  name: 'DestylerCollapsibleContent',
  inheritAttrs: false,
  props: destylerPrimitivePropsProps,
  setup(_, { attrs }) {
    const rootContext = injectCollapsibleRootContext()

    const presentRef = ref<InstanceType<typeof DestylerPresence>>()

    const { customElement, currentElement } = useCustomElement()

    const width = ref<number>(0)
    const height = ref<number>(0)

    // when opening we want it to immediately open to retrieve dimensions
    // when closing we delay `present` to retrieve dimensions before closing
    const isOpen = computed(() => rootContext.open.value)
    const isMountAnimationPrevented = ref(isOpen.value)
    const currentStyle = ref<Record<string, string>>()

    watch(
      () => [isOpen.value, presentRef.value?.present],
      async () => {
        await nextTick()
        const node = currentElement.value
        if (!node)
          return
        currentStyle.value = currentStyle.value || {
          transitionDuration: node.style.transitionDuration,
          animationName: node.style.animationName,
        }
        // block any animations/transitions so the element renders at its full dimensions
        node.style.transitionDuration = '0s'
        node.style.animationName = 'none'

        // get width and height from full dimensions
        const rect = node.getBoundingClientRect()
        height.value = rect.height
        width.value = rect.width

        // kick off any animations/transitions that were originally set up if it isn't the initial mount
        if (!isMountAnimationPrevented.value) {
          node.style.transitionDuration = currentStyle.value.transitionDuration
          node.style.animationName = currentStyle.value.animationName
        }
      },
      {
        immediate: true,
      },
    )

    onMounted(() => {
      requestAnimationFrame(() => {
        isMountAnimationPrevented.value = false
      })
    })

    return {
      rootContext,
      presentRef,
      customElement,
      width,
      height,
      attrStyle: attrs.style,
      attrClass: attrs.class,
    }
  },
  render() {
    return h(DestylerPresence, {
      ref: 'presentRef',
      present: this.$props.forceMount || this.rootContext.open.value,
      forceMount: true,
    }, withDirectives(h(DestylerPrimitive, mergeProps(this.$attrs, {
      'ref': 'customElement',
      'asChild': this.$props.asChild,
      'as': this.$props.as,
      'data-state': this.rootContext.open.value ? 'open' : 'closed',
      'data-disabled': this.rootContext.disabled?.value ? 'true' : undefined,
      'hidden': !this.presentRef?.present,
      'style': `--destyler_collapsible_content_width:${this.width}px;--destyler_collapsible_content_height:${this.height}px;`,
    }), {
      default: () => {
        return this.presentRef?.present ? this.$slots.default?.() : null
      },
    }), [
      [BindOnceDirective, { id: this.rootContext.contentId }],
    ]))
  },
})
