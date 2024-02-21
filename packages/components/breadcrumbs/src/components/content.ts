import type { Component, PropType, Ref } from 'vue'
import { defineComponent, h, onMounted, ref } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useCollection, useForwardExpose } from '@destyler/composition'

export const destylerBreadcrumbsContentProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'ul',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type DestylerBreadcrumbsContentProps = ExtractPublicPropTypes<typeof destylerBreadcrumbsContentProps>

export interface ContextBreadcrumbsContext {
  lastItemId: Ref<string>
}

export const [injectContextBreadcrumbsContext, provideContextBreadcrumbsContext] = createContext<ContextBreadcrumbsContext>('DestylerContextBreadcrumbsContent')

export const DestylerBreadcrumbsContent = defineComponent({
  name: 'DestylerBreadcrumbsContent',
  props: destylerBreadcrumbsContentProps,
  setup(_) {
    const { forwardRef, currentElement } = useForwardExpose()
    const { createCollection } = useCollection('li', 'data-destyler-breadcrumb-item')
    const items = createCollection(currentElement)
    const lastItemId = ref('')

    onMounted(() => {
      lastItemId.value = items.value[items.value.length - 1]?.id ?? ''
    })

    provideContextBreadcrumbsContext({ lastItemId })

    return {
      forwardRef,
    }
  },
  render() {
    return h(DestylerPrimitive, {
      ref: (el: any) => this.forwardRef(el),
      as: this.$props.as,
      asChild: this.$props.asChild,
    }, {
      default: () => this.$slots.default?.(),
    })
  },
})
