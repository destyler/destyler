import type { Ref } from 'vue'
import { defineComponent, h, onMounted, ref } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useCollection, useForwardExpose } from '@destyler/composition'

export const destylerBreadcrumbsContentProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'ul',
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
