import type { PropType, Ref } from 'vue'
import { computed, defineComponent, h, toRefs } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useForwardExpose, useVModel } from '@destyler/composition'

export const paginationRootProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'nav',
  },
  page: {
    type: Number as PropType<number>,
    required: false,
  },
  defaultPage: {
    type: Number as PropType<number>,
    required: false,
    default: 1,
  },
  itemsPerPage: {
    type: Number as PropType<number>,
    required: false,
    default: 10,
  },
  total: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
  },
  siblingCount: {
    type: Number as PropType<number>,
    required: false,
    default: 2,
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  showEdges: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type PaginationRootProps = ExtractPublicPropTypes<typeof paginationRootProps>

export const paginationRootEmits = {
  'update:page': (_value: number) => true,
}

export interface PaginationRootContext {
  page: Ref<number>
  onPageChange: (value: number) => void
  pageCount: Ref<number>
  siblingCount: Ref<number>
  disabled: Ref<boolean | undefined>
  showEdges: Ref<boolean>
}

export const [injectPaginationRootContext, providePaginationRootContext] = createContext<PaginationRootContext>('PaginationRoot')

export const PaginationRoot = defineComponent({
  name: 'DestylerPaginationRoot',
  props: paginationRootProps,
  emits: paginationRootEmits,
  setup(props, { emit }) {
    const { siblingCount, disabled, showEdges } = toRefs(props)

    useForwardExpose()
    const page = useVModel(props, 'page', emit, {
      defaultValue: props.defaultPage,
      passive: (props.page === undefined) as false,
    }) as Ref<number>

    const pageCount = computed(() => Math.ceil(props.total / props.itemsPerPage))

    providePaginationRootContext({
      page,
      onPageChange(value) {
        page.value = value
      },
      pageCount,
      siblingCount,
      disabled,
      showEdges,
    })

    return {
      page,
      pageCount,
    }
  },
  render() {
    return h(Primitive, {
      as: this.$props.as,
      asChild: this.$props.asChild,
    }, () => this.$slots.default?.({ page: this.page, pageCount: this.pageCount }))
  },
})
