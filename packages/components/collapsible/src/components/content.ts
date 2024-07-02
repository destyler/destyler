import type { PropType } from 'vue'
import { computed, defineComponent, h, mergeProps, nextTick, onMounted, ref, watch, withDirectives } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import { useForwardExpose } from '@destyler/composition'
import { Presence } from '@destyler/presence'
import { BindOnceDirective } from '@destyler/directives'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { injectCollapsibleRootContext } from './root'

export const collapsibleContent = {
  ...primitiveProps,
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type CollapsibleContentProps = ExtractPublicPropTypes<typeof collapsibleContent>

export const CollapsibleContent = defineComponent({
  name: 'DestylerCollapsibleContent',
  inheritAttrs: false,
  props: collapsibleContent,
  setup(_) {
    const rootContext = injectCollapsibleRootContext()

    const presentRef = ref<InstanceType<typeof Presence>>()

    const { forwardRef, currentElement } = useForwardExpose()

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
      forwardRef,
      width,
      height,
    }
  },
  render() {
    return h(Presence, {
      ref: 'presentRef',
      present: this.$props.forceMount || this.rootContext.open.value,
      forceMount: true,
    }, () => withDirectives(h(Primitive, mergeProps(this.$attrs, {
      'ref': (el: any) => this.forwardRef(el),
      'asChild': this.$props.asChild,
      'as': this.$props.as,
      'data-state': this.rootContext.open.value ? 'open' : 'closed',
      'data-disabled': this.rootContext.disabled?.value ? 'true' : undefined,
      'hidden': !this.presentRef?.present,
      'style': `--destyler-collapsible-content-width:${this.width}px;--destyler-collapsible-content-height:${this.height}px;`,
    }), () => this.presentRef?.present ? this.$slots.default?.() : null), [
      [BindOnceDirective, { id: this.rootContext.contentId }],
    ]))
  },
})
